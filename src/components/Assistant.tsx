import { useState } from "react";
function Assistant() {
    const [topic, setTopic] = useState("");
    const [explanation, setExplanation] = useState("")
    const handleExplain = () => {
        if(topic.trim() === ""){return};
        setExplanation(`Here is an explanation about ${topic}`);
    }

    return (
        <section id="assistant" className="assistant">
            <h2>AI Study Assistant</h2>
            <p className="assistant-description">Ask anything about a topic</p>
            <input placeholder="Type a topic..." value={topic} onChange={(event) => setTopic(event.target.value)}/>
            <button onClick={handleExplain}>Explain</button>
            <div className="explanation">{explanation}</div>
        </section>
    )

}

export default Assistant;