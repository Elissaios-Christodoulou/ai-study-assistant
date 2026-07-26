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

    const [hasStartedChat, setHasStartedChat] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth"
        });
    }, [messages]);

    const handleExplain = async () => {
        if (topic.trim() === "") { return };

        setIsLoading(true);

        setHasStartedChat(true);

        setMessages((prev) => [
            ...prev,
            {
                role: "user",
                text: topic
            }
        ]);
        
            try {
                const response = await fetch("http://localhost:5000/ask", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        message: topic
                    }),
                });

                const data = await response.json();

                setMessages((prev) => [
                    ...prev,
                    {
                        role: "assistant",
                        text: data.answer
                    }
                ]);

            } catch (error) {
                console.log(error);
                setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    text: "Something went wrong. Please try again."
                }
            ]);
            }

            setIsLoading(false);

    

    }
    const clearChat = () => {
        setMessages([]);
        setExplanation(null);
        setHasStartedChat(false);
    }; 
    return (
        <section id="assistant" className="assistant">
            <h2>AI Study Assistant</h2>

            <p className="assistant-description">Ask anything about a topic</p>

            <div className={hasStartedChat ? "chat-input bottom" : "chat-input"}>

                <input
                    placeholder="Type a topic..."
                    value={topic}
                    onChange={(event) => setTopic(event.target.value)}
                />

                <div className="assistant-buttons">

                    <button onClick={handleExplain}>
                        {isLoading ? "Thinking..." : "Explain"}
                    </button>

                    <button onClick={clearChat}>
                        Clear Chat
                    </button>

                </div>

            </div>

            <div className="messages">
                {messages.map((message, index) => (
                    <div key={index} className={`message ${message.role}`}>
                        {message.text}
                    </div>

                ))}
                <div ref={messagesEndRef}></div>
            </div>
            
        </section>
    )

}

export default Assistant;