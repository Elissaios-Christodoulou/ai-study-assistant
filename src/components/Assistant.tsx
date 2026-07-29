import { useEffect, useRef, useState } from "react";
import Sidebar from "./Sidebar";
import type {
    Conversation,
    Message as MessageType
} from "../types/chat";
import ChatInput from "./ChatInput";
import Chat from "./Chat";

function Assistant() {
    const [topic, setTopic] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const [conversations, setConversations] =
        useState<Conversation[]>(() => {
            const savedConversations =
                localStorage.getItem("conversations");

            if (!savedConversations) {
                return [];
            }

            return JSON.parse(savedConversations);
        });

    const [activeConversationId, setActiveConversationId] =
        useState<number | null>(null);

    const [hasStartedChat, setHasStartedChat] =
        useState(false);

    const messagesEndRef =
        useRef<HTMLDivElement>(null);

    const activeConversation = conversations.find(
        (conversation) =>
            conversation.id === activeConversationId
    );

    const activeMessages =
        activeConversation?.messages ?? [];

    useEffect(() => {
        localStorage.setItem(
            "conversations",
            JSON.stringify(conversations)
        );
    }, [conversations]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth"
        });
    }, [conversations, activeConversationId]);

    const handleExplain = async () => {
        const cleanTopic = topic.trim();

        if (cleanTopic === "" || isLoading) {
            return;
        }

        const userMessage: MessageType = {
            role: "user",
            text: cleanTopic
        };

        const assistantMessage: MessageType = {
            role: "assistant",
            text: ""
        };

        const requestMessages: MessageType[] = [
            ...activeMessages,
            userMessage
        ];

        const conversationId =
            activeConversationId ?? Date.now();

        setIsLoading(true);
        setHasStartedChat(true);
        setTopic("");

        if (activeConversationId === null) {
            const newConversation: Conversation = {
                id: conversationId,
                title:
                    cleanTopic.length > 30
                        ? cleanTopic.substring(0, 30) + "..."
                        : cleanTopic,
                messages: [
                    ...requestMessages,
                    assistantMessage
                ]
            };

            setConversations((prev) => [
                ...prev,
                newConversation
            ]);

            setActiveConversationId(conversationId);
        } else {
            setConversations((prev) =>
                prev.map((conversation) =>
                    conversation.id === conversationId
                        ? {
                              ...conversation,
                              messages: [
                                  ...requestMessages,
                                  assistantMessage
                              ]
                          }
                        : conversation
                )
            );
        }

        try {
            const response = await fetch(
                "/api/ask",
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json"
                    },
                    body: JSON.stringify({
                        messages: requestMessages
                    })
                }
            );

            if (!response.ok) {
                throw new Error(
                    `Server error: ${response.status}`
                );
            }

            const assistantText =
                await response.text();

            setConversations((prev) =>
                prev.map((conversation) => {
                    if (
                        conversation.id !== conversationId
                    ) {
                        return conversation;
                    }

                    const updatedMessages = [
                        ...conversation.messages
                    ];

                    const lastIndex =
                        updatedMessages.length - 1;

                    const lastMessage =
                        updatedMessages[lastIndex];

                    if (
                        !lastMessage ||
                        lastMessage.role !== "assistant"
                    ) {
                        return conversation;
                    }

                    updatedMessages[lastIndex] = {
                        ...lastMessage,
                        text: assistantText
                    };

                    return {
                        ...conversation,
                        messages: updatedMessages
                    };
                })
            );
        } catch (error) {
            console.error(error);

            setConversations((prev) =>
                prev.map((conversation) => {
                    if (
                        conversation.id !== conversationId
                    ) {
                        return conversation;
                    }

                    const updatedMessages = [
                        ...conversation.messages
                    ];

                    const lastIndex =
                        updatedMessages.length - 1;

                    const lastMessage =
                        updatedMessages[lastIndex];

                    if (
                        lastMessage?.role === "assistant"
                    ) {
                        updatedMessages[lastIndex] = {
                            role: "assistant",
                            text:
                                "Something went wrong. Please try again."
                        };
                    }

                    return {
                        ...conversation,
                        messages: updatedMessages
                    };
                })
            );
        } finally {
            setIsLoading(false);
        }
    };

    const createNewChat = () => {
        setActiveConversationId(null);
        setTopic("");
        setHasStartedChat(false);
    };

    const clearChat = () => {
        if (activeConversationId === null) {
            return;
        }

        setConversations((prev) =>
            prev.map((conversation) =>
                conversation.id === activeConversationId
                    ? {
                          ...conversation,
                          messages: []
                      }
                    : conversation
            )
        );

        setTopic("");
        setHasStartedChat(false);
    };

    const selectConversation = (id: number) => {
        setActiveConversationId(id);
        setHasStartedChat(true);
    };

    return (
        <section
            id="assistant"
            className="assistant"
        >
            <div className="assistant-layout">
                <div className="chat-container">
                    <h2>AI Study Assistant</h2>

                    <p className="assistant-description">
                        Ask anything about a topic
                    </p>

                    <ChatInput
                        topic={topic}
                        isLoading={isLoading}
                        hasStartedChat={hasStartedChat}
                        onTopicChange={setTopic}
                        onExplain={handleExplain}
                        onClearChat={clearChat}
                    />

                    <Chat
                        messages={activeMessages}
                        messagesEndRef={messagesEndRef}
                    />
                </div>

                <Sidebar
                    conversations={conversations}
                    activeConversationId={
                        activeConversationId
                    }
                    onSelectConversation={
                        selectConversation
                    }
                    onNewChat={createNewChat}
                />
            </div>
        </section>
    );
}

export default Assistant;