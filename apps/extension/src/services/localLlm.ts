const OLLAMA_BASE_URL = (import.meta.env.VITE_OLLAMA_BASE_URL || 'http://127.0.0.1:11434').replace(/\/$/, '');

type UserRole = 'USER' | 'ADMIN' | 'SUPER_ADMIN';

interface OllamaChatResponse {
  message?: {
    content?: string;
  };
  response?: string;
  error?: string;
}

const ADMIN_ROLES = new Set<UserRole>(['ADMIN', 'SUPER_ADMIN']);

const enhanceInstructions: Record<string, string> = {
  professional: 'Rewrite the following text to be more formal and professional.',
  formal: 'Rewrite the following text to be more formal and professional.',
  casual: 'Rewrite the following text to be more casual and friendly.',
  concise: 'Rewrite the following text to be more concise and to the point.',
  elaborate: 'Expand on the following text, adding more detail and context.',
  clarity: 'Rewrite the following text to improve clarity and flow.',
  more: 'Improve the writing of the following text with more detail and polish.',
};

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split('.');
    if (parts.length < 2) {
      return null;
    }

    const normalized = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padding = '='.repeat((4 - (normalized.length % 4)) % 4);
    const decoded = atob(normalized + padding);

    return JSON.parse(decoded) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function stripCodeFences(content: string): string {
  const fencedMatch = content.trim().match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  return fencedMatch ? fencedMatch[1] : content;
}

function extractBalancedJson(content: string, startIndex: number): string | null {
  const opening = content[startIndex];
  const closing = opening === '{' ? '}' : opening === '[' ? ']' : null;

  if (!closing) {
    return null;
  }

  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let i = startIndex; i < content.length; i += 1) {
    const char = content[i];

    if (inString) {
      if (escaped) {
        escaped = false;
        continue;
      }

      if (char === '\\') {
        escaped = true;
        continue;
      }

      if (char === '"') {
        inString = false;
      }
      continue;
    }

    if (char === '"') {
      inString = true;
      continue;
    }

    if (char === opening) {
      depth += 1;
      continue;
    }

    if (char === closing) {
      depth -= 1;
      if (depth === 0) {
        return content.slice(startIndex, i + 1);
      }
    }
  }

  return null;
}

function parseJsonFromContent<T>(content: string): T {
  const normalized = stripCodeFences(content).trim();
  const candidates: string[] = [normalized];
  const seen = new Set<string>(candidates);

  for (let i = 0; i < normalized.length; i += 1) {
    const char = normalized[i];
    if (char !== '{' && char !== '[') {
      continue;
    }

    const candidate = extractBalancedJson(normalized, i);
    if (candidate && !seen.has(candidate)) {
      candidates.push(candidate);
      seen.add(candidate);
    }
  }

  for (const candidate of candidates) {
    try {
      return JSON.parse(candidate) as T;
    } catch {
      continue;
    }
  }

  throw new Error(`Failed to parse local JSON response. Raw response: ${normalized.slice(0, 200)}`);
}

function getLocalModelName(model: string): string {
  return model.replace(/^ollama:/, '');
}

async function requestLocalCompletion(prompt: string, model: string, json = false): Promise<string> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 120000);

  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: getLocalModelName(model),
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        stream: false,
        ...(json ? { format: 'json' } : {}),
      }),
      signal: controller.signal,
    });

    const rawBody = await response.text();
    let data: OllamaChatResponse | null = null;

    try {
      data = rawBody ? JSON.parse(rawBody) as OllamaChatResponse : null;
    } catch {
      data = null;
    }

    if (!response.ok) {
      if (response.status === 403) {
        throw new Error(
          'Ollama blocked the Chrome extension origin. Set OLLAMA_ORIGINS=chrome-extension://* and restart Ollama.'
        );
      }

      if (response.status === 404) {
        throw new Error(`Local Ollama model "${getLocalModelName(model)}" was not found. Pull it in Ollama first.`);
      }

      throw new Error(
        data?.error ||
        rawBody ||
        `Local Ollama request failed with status ${response.status}.`
      );
    }

    const content = data?.message?.content || data?.response;
    if (!content || !content.trim()) {
      throw new Error('Local Ollama returned an empty response.');
    }

    return content;
  } catch (error: any) {
    if (error?.name === 'AbortError') {
      throw new Error('Local Ollama request timed out. Please check that the model is running.');
    }

    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

function buildSummarizePrompt(text: string): string {
  return `
You are an intelligent email summarization assistant. Your goal is to extract key information and return it in a structured JSON format.

Input Email:
---
${text}
---

Instructions:
1. Analyze the email content.
2. Extract the following fields:
   - "email_title": A short, clear title for the email.
   - "sender": The name or email address of the sender (inferred from context if not explicitly stated, otherwise "Unknown").
   - "summary": A concise 2-3 sentence summary of the main point.
   - "action_items": A list of specific actionable tasks or requests (strings). If none, use an empty list.
   - "important_details": A list of key facts, dates, or deadlines (strings).
   - "intent": One of "Request", "Informational", "Urgent", "Meeting", "Follow-up", "Other".
   - "sentiment": One of "Positive", "Neutral", "Negative", "Urgent".

Return ONLY valid JSON matching this structure:
{
  "email_title": "...",
  "sender": "...",
  "summary": "...",
  "action_items": ["...", "..."],
  "important_details": ["...", "..."],
  "intent": "...",
  "sentiment": "..."
}`;
}

function buildAutocompletePrompt(text: string): string {
  return `You are an AI assistant helping a user write. Your task is to provide a short, single-sentence completion for the text they have started. Do not repeat the user's text in your response. Only provide the new, autocompleted part. Be concise.\n\nUser's text:\n---\n${text}\n---`;
}

function buildEnhancePrompt(text: string, type?: string): string {
  const instruction = (type && enhanceInstructions[type]) || 'Improve the writing of the following text.';
  return `${instruction}\n\nText:\n---\n${text}\n---\n\nReturn only the enhanced text, nothing else.`;
}

function buildDraftReplyPrompt(emailContent: string, userPrompt?: string): string {
  return `
You are a professional email assistant.
Context (The email thread):
---
${emailContent}
---

User Instruction:
${userPrompt || 'Draft a suitable reply based on the context.'}

Draft a professional and polite reply to the above email.
Return only the reply text.`;
}

function buildGeneralChatPrompt(question: string): string {
  return `You are a helpful AI assistant.\nAnswer the following question to the best of your ability.\n\nQuestion: ${question}`;
}

export function isLocalModel(model?: string | null): model is string {
  return Boolean(model && model.startsWith('ollama:'));
}

export function getRoleFromToken(token?: string | null): UserRole | null {
  if (!token) {
    return null;
  }

  const payload = decodeJwtPayload(token);
  const role = payload?.role;

  return role === 'ADMIN' || role === 'SUPER_ADMIN' || role === 'USER'
    ? role
    : null;
}

export function getLocalModelAccessError(token?: string | null, model?: string | null): string | null {
  if (!isLocalModel(model)) {
    return null;
  }

  const role = getRoleFromToken(token);
  if (!role || !ADMIN_ROLES.has(role)) {
    return 'Local Ollama models are only available for admin and super admin accounts.';
  }

  return null;
}

export async function summarizeWithLocalModel(text: string, model: string): Promise<Record<string, unknown>> {
  const rawContent = await requestLocalCompletion(buildSummarizePrompt(text), model, true);
  return parseJsonFromContent<Record<string, unknown>>(rawContent);
}

export async function autocompleteWithLocalModel(text: string, model: string): Promise<string> {
  return requestLocalCompletion(buildAutocompletePrompt(text), model);
}

export async function enhanceWithLocalModel(
  text: string,
  type: 'formal' | 'concise' | 'casual' | 'clarity' | 'more',
  model: string
): Promise<string> {
  return requestLocalCompletion(buildEnhancePrompt(text, type), model);
}

export async function draftReplyWithLocalModel(
  emailContent: string,
  userPrompt: string | undefined,
  model: string
): Promise<string> {
  return requestLocalCompletion(buildDraftReplyPrompt(emailContent, userPrompt), model);
}

export async function generalChatWithLocalModel(question: string, model: string): Promise<string> {
  return requestLocalCompletion(buildGeneralChatPrompt(question), model);
}
