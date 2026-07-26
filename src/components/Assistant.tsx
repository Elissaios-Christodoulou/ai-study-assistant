import { useState, useEffect, useRef } from "react";
const explanations = {
    react: {
        title: "React",
        text: "React is a JavaScript library for building user interfaces.",
        example: "A component is a reusable piece of UI.",
        points: [
            "Components",
            "Props",
            "State"
        ]
    },

    python: {
        title: "Python",
        text: "Python is a programming language known for its simplicity.",
        example: "You can use Python for web development and AI.",
        points: [
            "Simple syntax",
            "Large ecosystem",
            "AI and Machine Learning"
        ]
    }
};
type Message = {
    role: "user" | "assistant";
    text: string;
};
type Explanation = {
    title: string;
    text: string;
    example: string;
    points: string[];
};
function Assistant() {

    const [topic, setTopic] = useState("");

    const fallbackAnswer = {
        title: "Topic not found",
        text: "Sorry, I don't have information about this topic yet.",
        example: "Try another topic like React or Python.",
        points: [
            "Available topic: React",
            "Available topic: Python"
        ]
    };


    const [explanation, setExplanation] = useState<Explanation | null>(null);

    const [isLoading, setIsLoading] = useState(false);


    const [messages, setMessages] = useState<Message[]>([]);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth"
        });
    }, [messages]);

    const handleExplain = () => {
        const cleanTopic = topic.trim().toLowerCase();
        if (topic.trim() === "") { return };
        setIsLoading(true);
        setMessages((prev) => [
            ...prev,
            {
                role: "user",
                text: topic
            }
        ]);
        setTimeout(() => {
            const answer = explanations[cleanTopic];
            if (answer) {
                setExplanation(answer);
                setMessages((prev) => [
                    ...prev,
                    {
                        role: "assistant",
                        text: answer.text
                    }
                ]);
            } else {
                setExplanation(fallbackAnswer);

                setMessages((prev) => [
                    ...prev,
                    {
                        role: "assistant",
                        text: fallbackAnswer.text
                    }
                ]);
            };


            setIsLoading(false);

            setTopic("");

        }, 1500);

    }
    const clearChat = () => {
        setMessages([]);
        setExplanation(null);
    };

    return (
        <section id="assistant" className="assistant">
            <h2>AI Study Assistant</h2>

            <p className="assistant-description">Ask anything about a topic</p>

            <input placeholder="Type a topic..." value={topic} onChange={(event) => setTopic(event.target.value)} />
            
            <button
                onClick={handleExplain}
                disabled={isLoading}
            >{isLoading ? "Thinking..." : "Explain"}</button>

            <button onClick={clearChat}>
                Clear Chat
            </button>

            {isLoading && (
                <div className="explanation">
                    Thinking...
                </div>
            )}

            <div className="messages">
                {messages.map((message, index) => (
                    <div key={index} className={`message ${message.role}`}>
                        {message.text}
                    </div>

                ))}
                <div ref={messagesEndRef}></div>
            </div>
            {explanation && (
                <div className="explanation">
                    <h3>{explanation?.title}</h3>

                    <h4>Explanation</h4>
                    <p>{explanation?.text}</p>

                    <h4>Example</h4>
                    <p>{explanation?.example}</p>

                    <h4>Key points</h4>

                    <ul>
                        {explanation?.points.map((point) => (
                            <li key={point}>{point}</li>
                        ))}</ul>
                </div>
            )}
        </section>
    )

}

export default Assistant;