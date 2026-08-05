/**
 * The provider seam.
 *
 * The concierge route's tool round-trip is shaped after the Anthropic Messages
 * API; this adapter is exactly the place a provider swap lives, so the route
 * itself needed no restructuring. Everything Gemini-specific is contained here.
 *
 * Model: gemini-3.6-flash. Overridable by env so a model rename is config, not
 * a code change. GEMINI_API_KEY is server-side only and is never logged.
 */

const ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models';
const DEFAULT_MODEL = 'gemini-3.6-flash';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

export interface ToolCall {
  id: string;
  name: string;
  input: unknown;
}

/**
 * `assistantTurn` is the opaque provider-shaped turn that produced the tool
 * call. The route hands it straight back on the follow-up so this adapter can
 * reconstruct the conversation without the route knowing the wire format.
 */
export interface CompletionResult {
  text: string | null;
  toolCall: ToolCall | null;
  assistantTurn: unknown;
}

type GeminiPart =
  | { text: string }
  | { functionCall: { name: string; args: Record<string, unknown> } }
  | { functionResponse: { name: string; response: Record<string, unknown> } };

interface GeminiContent {
  role: 'user' | 'model';
  parts: GeminiPart[];
}

function model(): string {
  return process.env.GEMINI_MODEL || DEFAULT_MODEL;
}

function apiKey(): string {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error('GEMINI_API_KEY is not set');
  return key;
}

function toContents(messages: ChatMessage[]): GeminiContent[] {
  return messages.map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));
}

/** Gemini expects OpenAPI-ish schemas; strip anything it rejects. */
function toFunctionDeclarations(tools: ToolDefinition[]) {
  return tools.map((t) => ({
    name: t.name,
    description: t.description,
    parameters: t.inputSchema,
  }));
}

async function call(body: unknown): Promise<GeminiContent[]> {
  const res = await fetch(`${ENDPOINT}/${model()}:generateContent`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': apiKey(),
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(25_000),
  });

  if (!res.ok) {
    // Status only — never echo the body, which can contain the request payload.
    throw new Error(`Gemini request failed with status ${res.status}`);
  }

  const json = (await res.json()) as {
    candidates?: { content?: GeminiContent }[];
  };
  const content = json.candidates?.[0]?.content;
  return content ? [content] : [];
}

function extract(contents: GeminiContent[]): CompletionResult {
  const content = contents[0];
  if (!content) return { text: null, toolCall: null, assistantTurn: null };

  let text: string | null = null;
  let toolCall: ToolCall | null = null;

  for (const part of content.parts ?? []) {
    if ('text' in part && part.text) {
      text = (text ?? '') + part.text;
    } else if ('functionCall' in part) {
      toolCall = {
        // Gemini matches function responses by name, not by id, but the route's
        // interface expects an id — use the name so the round-trip stays valid.
        id: part.functionCall.name,
        name: part.functionCall.name,
        input: part.functionCall.args ?? {},
      };
    }
  }

  return { text: text?.trim() || null, toolCall, assistantTurn: content };
}

export async function getChatCompletion({
  system,
  messages,
  tools,
}: {
  system: string;
  messages: ChatMessage[];
  tools?: ToolDefinition[];
}): Promise<CompletionResult> {
  const contents = await call({
    systemInstruction: { parts: [{ text: system }] },
    contents: toContents(messages),
    ...(tools?.length ? { tools: [{ functionDeclarations: toFunctionDeclarations(tools) }] } : {}),
    generationConfig: { temperature: 0.6, maxOutputTokens: 900 },
  });
  return extract(contents);
}

/**
 * Second leg of the tool round-trip: replay the conversation, the assistant turn
 * that requested the tool, and the tool's result, then let the model write the
 * reply the visitor actually sees.
 */
export async function completeToolRoundTrip({
  system,
  messages,
  tools,
  assistantTurn,
  toolCallId,
  toolResult,
  isError,
}: {
  system: string;
  messages: ChatMessage[];
  tools?: ToolDefinition[];
  assistantTurn: unknown;
  toolCallId: string;
  toolResult: string;
  isError?: boolean;
}): Promise<CompletionResult> {
  const priorTurn = (assistantTurn as GeminiContent | null) ?? {
    role: 'model' as const,
    parts: [],
  };

  const contents = await call({
    systemInstruction: { parts: [{ text: system }] },
    contents: [
      ...toContents(messages),
      priorTurn,
      {
        role: 'user' as const,
        parts: [
          {
            functionResponse: {
              name: toolCallId,
              response: isError ? { error: toolResult } : { result: toolResult },
            },
          },
        ],
      },
    ],
    ...(tools?.length ? { tools: [{ functionDeclarations: toFunctionDeclarations(tools) }] } : {}),
    generationConfig: { temperature: 0.6, maxOutputTokens: 500 },
  });

  return extract(contents);
}
