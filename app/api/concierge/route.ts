import { z } from 'zod';
import {
  getChatCompletion,
  completeToolRoundTrip,
  type ChatMessage,
  type ToolDefinition,
} from '@/lib/concierge/llm';
import { buildSystemPrompt, projectTypeOptions } from '@/lib/concierge/system-prompt';
import { CONCIERGE_ERROR_REPLY } from '@/lib/concierge/errors';
import { checkConciergeLimit, clientKey } from '@/lib/rate-limit';
import { sendContactEmail } from '@/app/actions/contact';
import { site } from '@/lib/site';

export const runtime = 'nodejs';
export const maxDuration = 30;

/** Hard session cap — past this the concierge hands off to the contact form. */
const MAX_MESSAGES = 20;

/**
 * The schema ceiling sits above MAX_MESSAGES on purpose: a conversation that
 * has reached the cap must still parse so the friendly hand-off below can
 * run. Capping the array at MAX_MESSAGES instead would reject those requests
 * as malformed and make the hand-off unreachable.
 */
const MAX_ACCEPTED_MESSAGES = 60;

const requestSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string().min(1).max(2000),
      }),
    )
    .min(1)
    .max(MAX_ACCEPTED_MESSAGES),
  /** Drives the route-aware opener and lets the prompt reference the current build. */
  pathname: z.string().max(200).optional(),
});

const captureLeadTool: ToolDefinition = {
  name: 'capture_lead',
  description:
    "Send the visitor's details to TEKGUYZ as a lead. Call this once the visitor has shared their name, email, and either a project type or a real description of what they need. Only pass values the visitor actually provided.",
  inputSchema: {
    type: 'object',
    properties: {
      name: { type: 'string', description: "The visitor's name, as they gave it." },
      email: { type: 'string', description: "The visitor's email address." },
      company: {
        type: 'string',
        description: "The visitor's company, only if they volunteered it.",
      },
      projectType: {
        type: 'string',
        enum: projectTypeOptions,
        description: 'Which solution line fits what they described.',
      },
      message: {
        type: 'string',
        description:
          'A 2–4 sentence third-person summary of what the visitor described needing.',
      },
    },
    required: ['name', 'email', 'projectType', 'message'],
  },
};

/** Minimal shape check on what the model passed to capture_lead. */
const leadInputSchema = z.object({
  name: z.string().min(2),
  email: z.email(),
  company: z.string().optional(),
  projectType: z.string().min(1),
  message: z.string().min(10),
});

const CAP_REPLY = `We've covered a lot — the fastest next step is the contact form at /contact, or email ${site.publicEmail} directly. Either way you'll hear back within one business day.`;

/* Shared with the panel, which renders the same sentence when the fetch itself
   fails. It used to be declared here AND as a literal in `concierge.tsx`, and
   the two had drifted — see `lib/concierge/errors.ts`. */
const ERROR_REPLY = CONCIERGE_ERROR_REPLY;

export async function POST(req: Request) {
  try {
    // Shared durable limiter — same module the contact action uses.
    if (!(await checkConciergeLimit(clientKey(req)))) {
      return Response.json(
        { error: `Too many messages at once — give it a minute, or email ${site.publicEmail}.` },
        { status: 429 },
      );
    }

    const parsed = requestSchema.safeParse(await req.json());
    if (!parsed.success) {
      return Response.json({ error: 'Invalid request.' }, { status: 400 });
    }

    const messages: ChatMessage[] = parsed.data.messages;
    // Check the cap before the shape rule, so a capped conversation always
    // gets the hand-off rather than a bare 400 on its trailing turn.
    if (messages.length >= MAX_MESSAGES) {
      return Response.json({ reply: CAP_REPLY, capReached: true });
    }
    if (messages[messages.length - 1]!.role !== 'user') {
      return Response.json({ error: 'Invalid request.' }, { status: 400 });
    }

    const system = buildSystemPrompt(parsed.data.pathname);
    const result = await getChatCompletion({
      system,
      messages,
      tools: [captureLeadTool],
    });

    if (!result.toolCall) {
      return Response.json({
        reply: result.text ?? ERROR_REPLY,
      });
    }

    // The model decided this is a real lead — run it through the one shared
    // action (chat leads skip the honeypot/timing anti-bot path by design).
    const lead = leadInputSchema.safeParse(result.toolCall.input);
    let leadCaptured = false;
    let toolResult: string;
    if (!lead.success) {
      toolResult =
        'Lead not captured — a required field was missing or malformed. Ask the visitor for the missing detail.';
    } else {
      const sent = await sendContactEmail(
        {
          ...lead.data,
          phone: undefined,
          website: undefined,
          hp_confirm: undefined,
          timestamp: undefined,
        },
        'AI Concierge',
      );
      if (sent.success) {
        leadCaptured = true;
        // "Accepted", not "delivered". The shared action now returns as soon as
        // it has validated and rate-limited, and does the CRM write and both
        // emails in after() — so at this point delivery is guaranteed to be
        // ATTEMPTED and recorded either way, not observed to have finished.
        // Telling the model otherwise would put a claim in the visitor's face
        // that nothing here can actually stand behind.
        toolResult =
          'Lead captured. Confirm to the visitor and set the expectation of a reply within one business day.';
      } else {
        toolResult = `Lead delivery failed. Apologize briefly and give the visitor ${site.publicEmail} as the direct fallback.`;
      }
    }

    const followUp = await completeToolRoundTrip({
      system,
      messages,
      tools: [captureLeadTool],
      assistantTurn: result.assistantTurn,
      toolCallId: result.toolCall.id,
      toolResult,
      isError: !lead.success,
    });

    return Response.json({
      reply:
        followUp.text ??
        (leadCaptured
          ? 'Done — your details are in. Expect a reply within one business day.'
          : ERROR_REPLY),
      leadCaptured,
    });
  } catch (error) {
    console.error('Concierge route error:', error);
    return Response.json({ error: ERROR_REPLY }, { status: 500 });
  }
}
