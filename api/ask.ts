import type { VercelRequest, VercelResponse } from "@vercel/node";

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
            error: "Missing API key"
        });
    }

    try {
        const { messages } = req.body;

        const contents = messages.map((message: any) => ({
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

        const response = await fetch(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-goog-api-key": apiKey
                },
                body: JSON.stringify({
                    contents
                })
            }
        );

        const data = await response.json();

        const answer =
            data.candidates?.[0]?.content?.parts
                ?.map((part: any) => part.text)
                .join("") ?? "";

        return res.status(200).send(answer);
    } catch (err) {
        console.error(err);

        return res.status(500).json({
            error: "Something went wrong"
        });
    }
}