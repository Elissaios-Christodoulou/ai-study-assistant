export type ChatMessage = {
    role: "user" | "assistant";
    text: string;
};

type GeminiPart = {
    text?: string;
};

export type AskGeminiResult =
    | { ok: true; answer: string }
    | { ok: false; status: number; error: string };

export async function askGemini(
    messages: ChatMessage[],
    apiKey: string | undefined
): Promise<AskGeminiResult> {
    if (!apiKey) {
        return {
            ok: false,
            status: 500,
            error: "GEMINI_API_KEY is missing"
        };
    }

    if (!Array.isArray(messages) || messages.length === 0) {
        return {
            ok: false,
            status: 400,
            error: "Messages are required"
        };
    }

    const contents = messages
        .filter((message) => message.text.trim() !== "")
        .map((message) => ({
            role:
                message.role === "assistant" ? "model" : "user",
            parts: [{ text: message.text }]
        }));

    if (contents.length === 0) {
        return {
            ok: false,
            status: 400,
            error: "Messages are required"
        };
    }

    const model =
        process.env.GEMINI_MODEL?.trim() ||
        "gemini-2.5-flash-lite";

    const geminiResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-goog-api-key": apiKey
            },
            body: JSON.stringify({
                contents,
                generationConfig: {
                    maxOutputTokens: 2048,
                    temperature: 0.7,
                    thinkingConfig: {
                        thinkingBudget: 0
                    }
                }
            })
        }
    );

    const data = await geminiResponse.json();

    if (!geminiResponse.ok) {
        console.error("Gemini error:", data);

        return {
            ok: false,
            status: geminiResponse.status,
            error:
                (data as { error?: { message?: string } })?.error
                    ?.message ?? "Gemini request failed"
        };
    }

    const parts: GeminiPart[] =
        (
            data as {
                candidates?: Array<{
                    content?: { parts?: GeminiPart[] };
                }>;
            }
        ).candidates?.[0]?.content?.parts ?? [];

    const answer = parts
        .map((part) => part.text ?? "")
        .join("")
        .trim();

    if (!answer) {
        console.error(
            "Empty Gemini response:",
            JSON.stringify(data)
        );

        return {
            ok: false,
            status: 502,
            error: "Gemini returned an empty response"
        };
    }

    return { ok: true, answer };
}
