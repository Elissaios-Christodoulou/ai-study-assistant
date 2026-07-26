import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Server is running!");
});

app.post("/ask", async (req, res) => {
    const { message } = req.body;

    try {
        const response = await fetch(
            "http://localhost:11434/api/generate",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "llama3.2:3b",
                    prompt: message,
                    stream: false
                })
            }
        );

        const data = await response.json();

        res.json({
            answer: data.response
        });
    } catch (error) {
        console.log(error);

        res.status(500).json({
            answer: "Something went wrong."
        });
    }
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});