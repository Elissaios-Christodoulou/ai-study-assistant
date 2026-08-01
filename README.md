# AI Study Assistant 🚀

AI Study Assistant is a responsive web application that helps students understand topics through an interactive AI-powered chat interface.

The project was built with React, TypeScript and Vite, while the AI responses are generated through the Google Gemini API using a secure Vercel serverless function.

## 🌐 Live Demo

[Open AI Study Assistant](https://ai-study-assistant-amber-two.vercel.app)

## 📖 What the application does

Users can enter a question or study topic and receive an AI-generated explanation. The assistant keeps the current conversation context, allowing the user to ask follow-up questions naturally.

The application can be used to:

- Explain difficult concepts in simpler language
- Answer study-related questions
- Summarize topics and notes
- Generate examples and practice questions
- Continue a discussion using previous messages as context

## ✨ Implemented features

- AI chat powered by the Google Gemini API
- Conversation context sent with every new question
- Multiple saved conversations
- Conversation history stored in the browser with `localStorage`
- New chat functionality
- Clear chat functionality
- Loading state while the assistant is generating a response
- Automatic scrolling to the latest message
- Responsive navigation and mobile layout
- Secure API key handling through Vercel Environment Variables
- Server-side validation and Gemini API error handling
- Vercel serverless API route at `/api/ask`

## 🧠 Recent development work

The project originally started as a static study assistant interface. It was then expanded into a working full-stack AI application.

Recent work includes:

- Integrating the Google Gemini API
- Creating and debugging the Vercel serverless function
- Moving Gemini request logic into a separate reusable module
- Fixing empty AI responses caused by output-token and thinking configuration
- Updating the Gemini model configuration
- Handling missing environment variables and invalid API responses
- Fixing TypeScript and NodeNext module issues for deployment
- Improving conversation state and chat history management

The Git commit history contains the individual development and debugging steps.

## 🔄 How it works

```text
User enters a question
        ↓
React sends the conversation to POST /api/ask
        ↓
Vercel runs the serverless API function
        ↓
The API function securely reads GEMINI_API_KEY
        ↓
The request is sent to Google Gemini
        ↓
The generated answer is returned to the React interface
        ↓
The conversation is updated and saved locally
```

## 🛠️ Technologies

### Frontend

- React
- TypeScript
- Vite
- CSS

### Backend and AI

- Vercel Serverless Functions
- Google Gemini API
- Fetch API

### Development and deployment

- Git
- GitHub
- Vercel
- npm

## 📁 Main project structure

```text
ai-study-assistant/
├── api/
│   ├── ask.ts              # Vercel API endpoint
│   └── geminiAsk.ts        # Gemini request and response logic
├── src/
│   ├── components/
│   │   ├── Assistant.tsx   # Main chat state and API communication
│   │   ├── Chat.tsx        # Conversation messages
│   │   ├── ChatInput.tsx   # User input and actions
│   │   └── Sidebar.tsx     # Saved conversations
│   ├── types/
│   │   └── chat.ts         # Conversation and message types
│   ├── App.tsx
│   └── App.css
├── package.json
└── README.md
```

## 🚀 Running the project locally

Clone the repository:

```bash
git clone https://github.com/Elissaios-Christodoulou/ai-study-assistant.git
```

Open the project folder:

```bash
cd ai-study-assistant
```

Install the dependencies:

```bash
npm install
```

Start the frontend development server:

```bash
npm run dev
```

The standard Vite development server runs the frontend only. To test the `/api/ask` serverless function locally, use the Vercel development environment.

```bash
npx vercel dev
```

## 🔐 Environment variables

Create the Gemini API key as a server-side environment variable:

```text
GEMINI_API_KEY=your_api_key
```

An optional model variable can also be configured:

```text
GEMINI_MODEL=your_supported_gemini_model
```

Do not place the API key inside frontend code or commit it to GitHub.

## 📦 Production build

```bash
npm run build
```

## 🗺️ Planned improvements

- Better formatting for AI responses
- Markdown and code-block rendering
- Enter to send and Shift + Enter for a new line
- Rename and delete saved conversations
- More detailed error messages in the interface
- Dedicated summary and practice-question modes
- Improved accessibility and mobile experience

## 👤 Author

Developed by [Elissaios Christodoulou](https://github.com/Elissaios-Christodoulou) as a learning project focused on React, TypeScript, API integration and AI-powered web development.
## 📸 Screenshots

### Home Page

![AI Study Assistant Home Page]<img width="2355" height="1298" alt="HOME" src="https://github.com/user-attachments/assets/a884540a-8a23-45d5-be4b-89f308ca5366" />

### FEATURES

![AI Study Assistant features Page]<img width="2375" height="1301" alt="FEATURES" src="https://github.com/user-attachments/assets/0aa2e10a-574c-4843-80fa-4a7cac625c17" />

### AI Chat

![AI Study Assistant Chat]<img width="2376" height="1296" alt="Screenshot 2026-08-01 171227" src="https://github.com/user-attachments/assets/0e8fbd0c-3a37-4a63-9534-079bd1921bdf" />
<img width="2377" height="1296" alt="CHAT" src="https://github.com/user-attachments/assets/7a8c06c3-2040-4063-a120-0828c5d9abcb" />


### Mobile View

![AI Study Assistant Mobile View]<img width="1160" height="1256" alt="MOBILE4" src="https://github.com/user-attachments/assets/5cb5f4f5-5424-4b95-b7af-07a52adad476" />
<img width="1160" height="1299" alt="MOBILE3" src="https://github.com/user-attachments/assets/42de6db7-7f48-430b-906d-e171e81502a3" />
<img width="1162" height="1300" alt="MOBILE2" src="https://github.com/user-attachments/assets/45a2292e-ca02-4d06-a775-515df60aae2c" />
<img width="1160" height="1296" alt="MOBILE1" src="https://github.com/user-attachments/assets/778e7459-51a1-4b3d-9bc7-146ce6bdcd30" />
<img width="1160" height="1302" alt="MOBILEVIEW" src="https://github.com/user-attachments/assets/1ecbbec2-bad6-4000-9f05-8c2dac1fdf77" />

