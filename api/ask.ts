type Message = {
    role: "user" | "assistant";
    text: string;
};
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
export default async function handler(request: Request) {
        try {
            if (request.method !== "POST") {
                return Response.json(
                    { error: "Method not allowed" },
                    { status: 405 }
                );
        }
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return Response.json(
                {
                    error: "GEMINI_API_KEY is missing"
                },
                {
                    status: 500
                }
            );
        }

        const body = await request.json();
        const messages: Message[] = body.messages;

        if (!Array.isArray(messages) || messages.length === 0) {
            return Response.json(
                {
                    error: "Messages are required"
                },
                {
                    status: 400
                }
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
                    "X-goog-api-key": apiKey
                },
                body: JSON.stringify({
                    contents
                })
            }
        );

        if (!geminiResponse.ok) {
            const errorText = await geminiResponse.text();

            console.error("Gemini error:", errorText);

            return Response.json(
                {
                    error: "Gemini request failed"
                },
                {
                    status: geminiResponse.status
                }
            );
        }

        const data = await geminiResponse.json();

        const answer =
            data.candidates?.[0]?.content?.parts
                ?.map((part: { text?: string }) => part.text ?? "")
                .join("") ?? "";

        return new Response(answer, {
            status: 200,
            headers: {
                "Content-Type": "text/plain; charset=utf-8"
            }
        });
    } catch (error) {
        console.error(error);

        return Response.json(
            {
                error: "Something went wrong"
            },
            {
                status: 500
            }
        );
    }
}