type ChatInputProps = {
    topic: string;
    isLoading: boolean;
    hasStartedChat: boolean;
    onTopicChange: (value: string) => void;
    onExplain: () => void;
    onClearChat: () => void;
};

function ChatInput({
    topic,
    isLoading,
    hasStartedChat,
    onTopicChange,
    onExplain,
    onClearChat
}: ChatInputProps) {
    return (
        <div
            className={
                hasStartedChat
                    ? "chat-input bottom"
                    : "chat-input"
            }
        >
            <input
                placeholder="Type a topic..."
                value={topic}
                onChange={(event) =>
                    onTopicChange(event.target.value)
                }
                onKeyDown={(event) => {
                    if (event.key === "Enter") {
                        onExplain();
                    }
                }}
                disabled={isLoading}
            />

            <div className="assistant-buttons">
                <button
                    onClick={onExplain}
                    disabled={isLoading}
                >
                    {isLoading
                        ? "Thinking..."
                        : "Explain"}
                </button>

                <button
                    onClick={onClearChat}
                    disabled={isLoading}
                >
                    Clear Chat
                </button>
            </div>
        </div>
    );
}

export default ChatInput;