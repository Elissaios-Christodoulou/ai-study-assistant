import {
    askGemini,
    type ChatMessage
} from "./geminiAsk";

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
            const body = await request.json();
            const messages: ChatMessage[] = body.messages;

            const result = await askGemini(
                messages,
                process.env.GEMINI_API_KEY
            );

            if (!result.ok) {
                return Response.json(
                    { error: result.error },
                    { status: result.status }
                );
            }

            return new Response(result.answer, {
                status: 200,
                headers: {
                    "Content-Type": "text/plain; charset=utf-8"
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
