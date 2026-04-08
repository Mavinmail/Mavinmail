<div align="center">
  <img src="./apps/dashboard/public/mavinlogo.png" alt="Mavinmail Logo" width="120" />
  <h1>📧 Mavinmail</h1>
  <p><strong>Your Next-Generation AI-Driven Email Assistant</strong></p>
</div>

Mavinmail is an intelligent ecosystem designed to supercharge your email experience. It is built as a highly performant **Monorepo** using **Turborepo**, combining a Node.js/Express backend, a Next.js (Tailwind v4) dashboard, and a React & Vite Chrome extension into one unified codebase.

---

## 🎯 Key Features

- 🧠 **AI Processing Pipeline:** Summarizes daily emails, drafts intelligent replies, and acts as a RAG (Retrieval-Augmented Generation) knowledge base over your inbox.
- ⚡ **Local LLM Support:** Full integration with Ollama to run models like `llama3.2` locally, bypassing API costs and ensuring maximum privacy.
- 🔐 **Enterprise-Grade Security:** Utilizes Google OAuth 2.0, JWT stateless sessions, and AES-256 for background credential encryption.
- 🧩 **Multi-Client Architecture:** Manage settings in the web dashboard, act directly inside Gmail via the Chrome Extension.
- 🐳 **Dockerized Backend:** Redis background schedulers (BullMQ) and PostgreSQL ready out of the box.

---

## 🏗 System Architecture

Mavinmail operates across three primary environments, syncing state and processing heavy AI queries asynchronously.

```mermaid
graph TD
    %% User Interactions
    User((User))
    
    %% Clients
    subgraph "Client Layer"
        Extension[🧩 Chrome Extension<br/>React + Vite]
        Dashboard[💻 Next.js Dashboard<br/>React 19 + Tailwind v4]
    end
    
    %% API Gateway
    API((Express API Gateway))
    
    %% Services
    subgraph "Backend Services"
        AuthService[🔒 Auth & Encryption]
        GmailWorker[📧 Gmail Graph API]
        LLMOrchestrator[🧠 AI Orchestrator]
    end
    
    %% External Services
    subgraph "AI Providers"
        OpenRouter((OpenRouter))
        Ollama((Local Ollama))
        RAG((Cohere / Pinecone))
    end
    
    %% Databases
    DB[(PostgreSQL)]
    Redis[(Redis Queue)]

    %% Connections
    User -->|Interacts inside Gmail| Extension
    User -->|Manages Subscriptions| Dashboard
    Extension <-->|REST| API
    Dashboard <-->|REST| API
    
    API --> AuthService
    API --> GmailWorker
    API --> LLMOrchestrator
    
    AuthService <--> DB
    GmailWorker <--> Redis
    
    LLMOrchestrator <--> OpenRouter
    LLMOrchestrator <--> Ollama
    LLMOrchestrator <--> RAG
```

---

## 📂 Monorepo Structure

```text
Mavinmail/
├── apps/
│   ├── backend/          # Node.js + Express API server, Prisma ORM, Redis queues
│   ├── dashboard/        # Next.js 15 Web Application (Settings, Analytics)
│   └── extension/        # React + Vite Chrome Extension (Gmail Overlay)
├── packages/             # Shared internal utilities and configurations
├── turbo.json            # Turborepo task pipeline configuration
└── package.json          # Root workspace configuration
```

---

## 🔐 Environment Variables (`.env`) Installation

Because this is a monorepo, each app has its own environment configuration. You must create a `.env` file in each respective directory before running the project.

### 1. Backend (`apps/backend/.env`)
These secrets handle database connections, session security, and AI integrations.

```env
# Database & Core
PORT=5001
NODE_ENV=development
DATABASE_URL="postgresql://user:password@localhost:5432/mavinmail?sslmode=disable"
FRONTEND_URL="http://localhost:3000"

# Security & Sessions
JWT_SECRET="YOUR_JWT_SECRET_STRING"
TOKEN_HASH_SECRET="YOUR_TOKEN_HASH_STRING"
ENCRYPTION_SECRET="YOUR_AES_ENCRYPTION_SECRET_32_CHARS"

# Google Auth (Required for Login & Gmail API)
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GOOGLE_CALLBACK_URL="http://localhost:5001/api/auth/google/callback"
GOOGLE_REDIRECT_URI="http://localhost:5001/api/auth/google/callback"

# AI Integrations
FALLBACK_AI_MODEL="google/gemini-2.0-flash-001"
GEMINI_API_KEY="your-gemini-key"
OPENROUTER_API_KEY="your-openrouter-key"

# RAG / Embeddings (Optional based on usage)
COHERE_API_KEY="your-cohere-key"
PINECONE_API_KEY="your-pinecone-key"
PINECONE_ENVIRONMENT="us-east-1-aws"
PINECONE_INDEX_NAME="mavinmail-index"
```

### 2. Dashboard (`apps/dashboard/.env`)
Configuration for the Next.js frontend web application.

```env
# API URL must point to your running backend
NEXT_PUBLIC_API_URL="http://localhost:5001/api"

# Unique secret for any Next-Auth or generic UI signing requirements
AUTH_SECRET="your-random-32-char-string"
```

### 3. Extension (`apps/extension/.env`)
Vite configuration to tell the Chrome browser where to route requests.

```env
# Backend API Location
VITE_API_URL="http://localhost:5001/api"

# Local LLM Fallback (Allows bypass of OpenRouter when using local models)
VITE_OLLAMA_BASE_URL="http://127.0.0.1:11434"
```

---

## 🚀 Local Setup Instructions

Follow these steps carefully to spin up the entire ecosystem on your local machine.

### 1. Clone & Install Dependencies
Ensure you have **Node.js (v18+)** and **Yarn** installed.
```bash
git clone https://github.com/Email-Assistant/Mavinmail.git
cd Mavinmail

# Install dependencies across all packages utilizing Yarn Workspaces
yarn install
```

### 2. Configure Environments
Manually create the `.env` files in `apps/backend/`, `apps/dashboard/`, and `apps/extension/` using the templates provided in the section above.

### 3. Setup PostgreSQL Database
Make sure Docker is running on your machine.
```bash
cd apps/backend

# Starts a local PostgreSQL database in the background
docker-compose up -d

# Sync the Prisma Schema to your database instance
npx prisma db push
```

### 4. Build Chrome / Firefox Extension
Because browser extensions don't natively support Next/Express development servers, you must build the extension before loading it into your browser.

```bash
cd apps/extension
yarn build
```
*To load into Chrome: Navigate to `chrome://extensions/`, enable "Developer mode", click "Load unpacked", and select the `apps/extension/dist/` directory!*

### 5. Launch the Monorepo Development Environment
Returns to the root of the project and execute Turborepo to spin up both the Backend and Dashboard simultaneously!

```bash
# from the Mavinmail root directory
yarn dev
```

🎯 **Your development URLs:**
- Dashboard: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:5001](http://localhost:5001)

---

## 🤖 Ollama Local LLM Support (Optional)

Mavinmail natively supports **Local LLMs** via Ollama to maximize data privacy and minimize API costs.
1. Download and install [Ollama](https://ollama.com).
2. Start your local model (e.g. `ollama run llama3.2:3b`).
3. Ensure `VITE_OLLAMA_BASE_URL` is set to `http://127.0.0.1:11434` in your extension's `.env`.
4. Go to your Dashboard Settings and select the "Local Models" toggle!

<br />
<div align="center">
  <p><i>Built with ☕️ by the Mavinmail Team.</i></p>
</div>
