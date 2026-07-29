export type Message = {
    role: "user" | "assistant";
    text: string;
};

export type Conversation = {
    id: number;
    title: string;
    messages: Message[];
};