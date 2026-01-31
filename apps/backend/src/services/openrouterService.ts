import axios from "axios";

export class OpenRouterService {
    private static apiKey = process.env.OPENROUTER_API_KEY;
    // Models from .env or database
    private static defaultModel = process.env.DEFAULT_AI_MODEL;
    private static fallbackModel = process.env.FALLBACK_AI_MODEL;

    /**
     * Generates text content using the OpenRouter API.
     * @param prompt The prompt to send to the AI.
     * @param model The model to use (optional, defaults to env default).
     * @returns The generated text response.
     */
    static async generateContent(prompt: string, model?: string): Promise<string> {
        const selectedModel = model || this.defaultModel;
        console.log(`[OpenRouter] Sending request to model: ${selectedModel}`);

        const maxRetries = 3;
        let retryCount = 0;
        let lastError: any = null;

        while (retryCount < maxRetries) {
            try {
                const response = await axios.post(
                    "https://openrouter.ai/api/v1/chat/completions",
                    {
                        model: selectedModel,
                        messages: [
                            {
                                role: "user",
                                content: prompt
                            }
                        ],
                    },
                    {
                        headers: {
                            "Authorization": `Bearer ${this.apiKey}`,
                            "HTTP-Referer": "http://localhost:3000",
                            "X-Title": "Mavinmail Email Assistant"
                        },
                        timeout: 120000 // 120 second timeout for reasoning models
                    }
                );

                // Debug: log raw response structure
                console.log(`[OpenRouter] Response status: ${response.status}`);

                // Validate response structure
                if (!response.data) {
                    console.error("[OpenRouter] Empty response data");
                    throw new Error("Empty response from OpenRouter");
                }

                // Check for API-level errors
                if (response.data.error) {
                    console.error("[OpenRouter] API Error:", response.data.error);
                    throw new Error(`OpenRouter API Error: ${response.data.error.message || JSON.stringify(response.data.error)}`);
                }

                // Validate choices array
                if (!response.data.choices || !Array.isArray(response.data.choices) || response.data.choices.length === 0) {
                    console.error("[OpenRouter] Invalid response structure:", JSON.stringify(response.data, null, 2));
                    throw new Error("Invalid response structure: missing choices array");
                }

                const choice = response.data.choices[0];

                // Handle different response formats (some models use different structures)
                let content: string | undefined;

                if (choice.message?.content) {
                    content = choice.message.content;
                } else if (choice.text) {
                    // Some models return text directly
                    content = choice.text;
                } else if (choice.content) {
                    content = choice.content;
                }

                if (!content) {
                    console.error("[OpenRouter] No content in response choice:", JSON.stringify(choice, null, 2));
                    throw new Error("No content in OpenRouter response");
                }

                console.log(`[OpenRouter] Success! Got ${content.length} chars`);
                return content;

            } catch (err: any) {
                lastError = err;

                // Log API key for debugging (prefix only)
                const keyPrefix = this.apiKey ? this.apiKey.substring(0, 12) + "..." : "UNDEFINED";
                console.log(`[OpenRouter Debug] API Key prefix: ${keyPrefix}`);

                // Handle rate limiting
                if (err.response?.status === 429) {
                    retryCount++;
                    const delay = Math.pow(2, retryCount) * 1000;
                    console.warn(`[OpenRouter] Rate limited (429). Retry ${retryCount}/${maxRetries} in ${delay}ms`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                    continue;
                }

                // Handle model not found - try fallback
                if (err.response?.status === 404 || err.response?.status === 400) {
                    console.error(`[OpenRouter] Model error (${err.response?.status}):`, err.response?.data);

                    // Try fallback model once
                    if (selectedModel !== this.fallbackModel && this.fallbackModel && retryCount === 0) {
                        console.log(`[OpenRouter] Trying fallback model: ${this.fallbackModel}`);
                        retryCount++;
                        return this.generateContent(prompt, this.fallbackModel);
                    }
                }

                // Log the full error for debugging
                console.error("[OpenRouter] Request failed:", {
                    status: err.response?.status,
                    data: err.response?.data,
                    message: err.message
                });

                throw new Error(`OpenRouter request failed: ${err.message}`);
            }
        }

        throw new Error(`OpenRouter request failed after ${maxRetries} retries: ${lastError?.message}`);
    }

    /**
     * Generates a JSON response from the OpenRouter API.
     * Includes prompt engineering to enforce JSON output and strict parsing.
     * @param prompt The prompt to send.
     * @param model The model to use.
     * @returns The parsed JSON object.
     */
    static async generateJSON(prompt: string, model?: string): Promise<any> {
        // Augment prompt to ensure JSON
        const jsonPrompt = `${prompt}\n\nIMPORTANT: Return ONLY valid JSON. No markdown code fences. No explanations. No thinking. Just the JSON object.`;

        const rawContent = await this.generateContent(jsonPrompt, model);

        // Robust JSON extraction: Find the first '{' and the last '}'
        const jsonMatch = rawContent.match(/\{[\s\S]*\}/);

        const cleaned = jsonMatch ? jsonMatch[0] : rawContent;

        try {
            return JSON.parse(cleaned);
        } catch (e) {
            console.error("[OpenRouter] Failed to parse JSON. Raw output:", rawContent.substring(0, 500));
            console.error("Cleaned output was:", cleaned.substring(0, 500));
            throw new Error("AI returned invalid JSON.");
        }
    }
}
