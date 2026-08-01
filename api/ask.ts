import type {
    VercelRequest,
    VercelResponse
} from "@vercel/node";

type Message = {
    role: "user" | "assistant";
    text: string;
};

type GeminiPart = {
    text?: string;
};

export default async function handler(
    req: VercelRequest,
    res: VercelResponse
) {
    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Method not allowed"
        });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return res.status(500).json({
            error: "GEMINI_API_KEY is missing"
        });
    }

    try {
        const messages: Message[] = req.body?.messages;

        if (
            !Array.isArray(messages) ||
            messages.length === 0
        ) {
            return res.status(400).json({
                error: "Messages are required"
            });
        }

        const contents = messages.map((message) => ({
            role:
                message.role === "assistant"
                    ? "model"
                    : "user",
            parts: [
                {
                    text: message.text
                }
            ]
        }));

        const geminiResponse = await fetch(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-goog-api-key": apiKey
                },
                body: JSON.stringify({
                    contents,
                    generationConfig: {
                        maxOutputTokens: 500,
                        temperature: 0.7
                    }
                })
            }
        );

        const data = await geminiResponse.json();

        if (!geminiResponse.ok) {
            console.error("Gemini error:", data);

            return res.status(geminiResponse.status).json({
                error:
                    data?.error?.message ??
                    "Gemini request failed"
            });
        }

        const parts: GeminiPart[] =
            data.candidates?.[0]?.content?.parts ?? [];

        const answer = parts
            .map((part) => part.text ?? "")
            .join("")
            .trim();

        if (!answer) {
            console.error(
                "Empty Gemini response:",
                JSON.stringify(data)
            );

            return res.status(502).json({
                error: "Gemini returned an empty response"
            });
        }

        return res
            .status(200)
            .setHeader(
                "Content-Type",
                "text/plain; charset=utf-8"
            )
            .send(answer);
    } catch (error) {
        console.error("API error:", error);

        return res.status(500).json({
            error: "Something went wrong"
        });
    }
}