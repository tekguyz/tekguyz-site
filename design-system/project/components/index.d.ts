/** TEKGUYZ components. Global: window.TEKGUYZ. Needs window.React and window.ReactDOM (18), tokens.css and bundle.css. */
type SolutionSlug = 'smart-operations' | 'ai-voice-agents' | 'business-systems' | 'custom-web-apps';
type Node = unknown;

export interface ConnectedNodesProps { /** px, default 26 */ size?: number; /** connector colour, default var(--tg-border-strong) */ stroke?: string; strokeOpacity?: number; className?: string }
export interface LockupProps { /** px tall, default 32 */ height?: number; stroke?: string; className?: string }
export interface ButtonProps { variant?: 'primary' | 'secondary'; size?: 'nav' | 'default' | 'form' | 'large'; /** renders a link when set */ href?: string; disabled?: boolean; type?: 'button' | 'submit'; onClick?: (e: unknown) => void; className?: string; children?: Node }
export interface EyebrowProps { /** colour it in this Solution's accent */ solution?: SolutionSlug; className?: string; children?: Node }
export interface SolutionTagProps { solution: SolutionSlug; /** defaults to the Solution name, uppercased */ label?: string; variant?: 'default' | 'card'; className?: string }
export interface AccentDotProps { solution: SolutionSlug; /** px, default 10 */ size?: number; className?: string }
export interface StatusLineProps { state?: 'live' | 'unreachable'; /** age of the last real check, e.g. "4 minutes ago" */ stamp?: string; variant?: 'default' | 'compact'; className?: string }
export interface SignatureStripeProps { className?: string }
export interface PullQuoteProps { solution: SolutionSlug; size?: 'display' | 'band'; className?: string; children?: Node }
export interface TestimonialProps { author: string; source: string; className?: string; children?: Node }
export interface SolutionRowProps { solution: SolutionSlug; name?: string; hook?: string; href?: string; /** adds the closing hairline */ last?: boolean; className?: string }
export interface ProjectCardProps { solution: SolutionSlug; tag: string; headline: string; summary: string; state?: 'live' | 'unreachable'; stamp?: string; href?: string; className?: string }
export interface DisclosureProps { items: { question: string; answer: string }[]; /** index of the row open at first */ defaultOpen?: number; className?: string }
export interface OutcomeBlockProps { tone: 'success' | 'error'; label: string; className?: string; children?: Node }
export interface FieldProps { label: string; as?: 'input' | 'select' | 'textarea'; type?: string; id?: string; name?: string; options?: string[]; placeholder?: string; hint?: string; error?: string; optional?: boolean; rows?: number; defaultValue?: string; disabled?: boolean; className?: string }
export interface ProcessStepProps { numeral: string; title: string; solution: SolutionSlug; last?: boolean; className?: string; children?: Node }
export interface ClosingCtaProps { headline?: string; sub?: string; /** three short facts */ trust?: string[]; cta?: string; href?: string; /** false removes the quiet link */ link?: string | false; className?: string }
export interface NavProps { links?: { label: string; href?: string }[]; /** label of the current page */ current?: string; cta?: string; className?: string }
export interface FooterProps { columns?: { heading: string; links: string[] }[]; tagline?: string; copyright?: string; className?: string }
