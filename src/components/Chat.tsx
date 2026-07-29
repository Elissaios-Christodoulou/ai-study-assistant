import type { Message as MessageType } from "../types/chat";
import Message from "./Message";

type ChatProps = {
    messages: MessageType[];
    messagesEndRef: React.RefObject<HTMLDivElement | null>;
};

function Chat({
    messages,
    messagesEndRef
}: ChatProps) {
    return (
        <div className="messages">
            {messages.map((message, index) => (
                <Message
                    key={index}
                    message={message}
                />
            ))}

            <div ref={messagesEndRef}></div>
        </div>
    );
}

export default Chat;