import type { Message as MessageType } from "../types/chat";

type MessageProps = {
    message: MessageType;
};

function Message({ message }: MessageProps) {
    return (
        <div className={`message ${message.role}`}>
            {message.text}
        </div>
    );
}

export default Message;