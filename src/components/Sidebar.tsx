import type { Conversation } from "../types/chat";

type SidebarProps = {
    conversations: Conversation[];
    activeConversationId: number | null;
    onSelectConversation: (id: number) => void;
    onNewChat: () => void;
};

function Sidebar({
    conversations,
    activeConversationId,
    onSelectConversation,
    onNewChat
}: SidebarProps) {
    return (
        <aside className="sidebar">

            <button
                className="new-chat-button"
                onClick={onNewChat}
            >
                + New Chat
            </button>

            <div className="conversation-list">

                {conversations.map((conversation) => (

                    <button
                        key={conversation.id}
                        className={
                            conversation.id === activeConversationId
                                ? "conversation active"
                                : "conversation"
                        }
                        onClick={() =>
                            onSelectConversation(conversation.id)
                        }
                    >
                        {conversation.title}
                    </button>

                ))}

            </div>

        </aside>
    );
}

export default Sidebar;