import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";
import {
    askGemini,
    type ChatMessage
} from "./api/geminiAsk.ts";

dotenv.config();

function readRequestBody(
    request: import("node:http").IncomingMessage
): Promise<string> {
    return new Promise((resolve, reject) => {
        const chunks: Buffer[] = [];

        request.on("data", (chunk: Buffer) => {
            chunks.push(chunk);
        });

        request.on("end", () => {
            resolve(Buffer.concat(chunks).toString("utf8"));
        });

        request.on("error", reject);
    });
}

function apiAskDevPlugin(): Plugin {
    return {
        name: "api-ask-dev",
        configureServer(server) {
            server.middlewares.use(async (req, res, next) => {
                const path = req.url?.split("?")[0];

                if (path !== "/api/ask") {
                    next();
                    return;
                }

                if (req.method !== "POST") {
                    res.statusCode = 405;
                    res.setHeader("Allow", "POST");
                    res.setHeader(
                        "Content-Type",
                        "application/json"
                    );
                    res.end(
                        JSON.stringify({
                            error: "Method not allowed"
                        })
                    );
                    return;
                }

                try {
                    const rawBody = await readRequestBody(req);
                    const body = JSON.parse(rawBody) as {
                        messages?: ChatMessage[];
                    };

                    const result = await askGemini(
                        body.messages ?? [],
                        process.env.GEMINI_API_KEY
                    );

                    if (!result.ok) {
                        res.statusCode = result.status;
                        res.setHeader(
                            "Content-Type",
                            "application/json"
                        );
                        res.end(
                            JSON.stringify({
                                error: result.error
                            })
                        );
                        return;
                    }

                    res.statusCode = 200;
                    res.setHeader(
                        "Content-Type",
                        "text/plain; charset=utf-8"
                    );
                    res.end(result.answer);
                } catch (error) {
                    console.error("Dev API error:", error);

                    res.statusCode = 500;
                    res.setHeader(
                        "Content-Type",
                        "application/json"
                    );
                    res.end(
                        JSON.stringify({
                            error: "Something went wrong"
                        })
                    );
                }
            });
        }
    };
}

export default defineConfig({
    plugins: [react(), apiAskDevPlugin()]
});
