import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Server is running!");
});

app.post("/ask", async (req, res) => {
    const { messages } = req.body;

    if (!Array.isArray(messages)) {
        return res.status(400).json({
            error: "Messages must be an array."
        });
    }

    const ollamaMessages = messages.map((message) => ({
        role: message.role,
        content: message.text
    }));

    try {
        const response = await fetch(
            "http://localhost:11434/api/chat",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "llama3.2:3b",
                    messages: ollamaMessages,
                    stream: true
                })
            }
        );

        if (!response.ok) {
            throw new Error(`Ollama error: ${response.status}`);
        }

        if (!response.body) {
            throw new Error("Ollama response body is missing");
        }

        res.setHeader(
            "Content-Type",
            "text/plain; charset=utf-8"
        );

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        let buffer = "";

        while (true) {
            const { done, value } = await reader.read();

            if (done) {
                break;
            }

            buffer += decoder.decode(value, {
                stream: true
            });

            const lines = buffer.split("\n");

            buffer = lines.pop() || "";

            for (const line of lines) {
                if (!line.trim()) {
                    continue;
                }

                const data = JSON.parse(line);

                if (data.message?.content) {
                    res.write(data.message.content);
                }
            }
        }

        buffer += decoder.decode();

        if (buffer.trim()) {
            const data = JSON.parse(buffer);

            if (data.message?.content) {
                res.write(data.message.content);
            }
        }

        res.end();
    } catch (error) {
        console.error(error);

        if (!res.headersSent) {
            res.status(500).json({
                error: "Something went wrong."
            });
        } else {
            res.end();
        }
    }
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});