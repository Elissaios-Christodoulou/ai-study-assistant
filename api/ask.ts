type ChatMessage = {
    role: "user" | "assistant";
    text: string;
};

type GeminiPart = {
    text?: string;
};

export const maxDuration = 60;

export default {
    async fetch(request: Request): Promise<Response> {
        if (request.method !== "POST") {
            return Response.json(
                { error: "Method not allowed" },
                {
                    status: 405,
                    headers: {
                        Allow: "POST"
                    }
                }
            );
        }

        try {
            const apiKey = process.env.GEMINI_API_KEY;

            if (!apiKey) {
                return Response.json(
                    { error: "GEMINI_API_KEY is missing" },
                    { status: 500 }
                );
            }

            const body = await request.json();
            const messages: ChatMessage[] = body.messages;

            if (
                !Array.isArray(messages) ||
                messages.length === 0
            ) {
                return Response.json(
                    { error: "Messages are required" },
                    { status: 400 }
                );
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
                        "x-goog-api-key": apiKey
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

                return Response.json(
                    {
                        error:
                            data?.error?.message ??
                            "Gemini request failed"
                    },
                    {
                        status: geminiResponse.status
                    }
                );
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

                return Response.json(
                    {
                        error:
                            "Gemini returned an empty response"
                    },
                    {
                        status: 502
                    }
                );
            }

            return new Response(answer, {
                status: 200,
                headers: {
                    "Content-Type":
                        "text/plain; charset=utf-8"
                }
            });
        } catch (error) {
            console.error("API error:", error);

            return Response.json(
                { error: "Something went wrong" },
                { status: 500 }
            );
        }
    }
};