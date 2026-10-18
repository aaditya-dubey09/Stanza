# ⚡ Stanza

> **Instant, Stateful Mock APIs Generated from Natural Language Prompts.**

Stanza is a production-ready, open-source developer tool that transforms plain-text descriptions into live, stateful mock REST endpoints in under 3 seconds.

Whether you need a simple list of 20 online users or a deeply nested user profile with custom chat logs and participant arrays, Stanza uses open-weight AI models to parse intent, generate dynamic schemas, and provision live endpoints instantly.

---

## ✨ Features

- 🧠 **AI Blueprint Engine:** Uses open-weight LLMs (`qwen/qwen3.8-27b` via Groq) with structured JSON generation to translate natural language into dynamic schema blueprints.
- 🔄 **Full Stateful CRUD:** Supports `GET`, `POST`, `PUT`, and `DELETE` requests directly on generated mock endpoints. State persists dynamically during the endpoint's lifespan.
- 🌳 **Nested Structures & Arrays:** Handles complex, deeply nested JSON objects, lists, and custom child fields without hardcoded schema constraints.
- 🎛️ **Simulated Network Infrastructure:** Test edge cases by overriding response status codes (`?status=500`) or introducing artificial network latency (`?delay=2000`).
- 🎚️ **Flexible Response Formats:** Toggle between array lists and single-object schemas directly from the UI.
- ⏳ **Auto-Expiring Ephemeral Storage:** Powered by MongoDB Atlas TTL (Time-To-Live) indexes to automatically expire temporary mock endpoints after a user-defined lifespan (minutes to 48 hours), keeping memory footprints flat.
- 🛡️ **Resilient Fallback Parser:** Token-agnostic local fallback heuristic engine ensures uninterrupted service even if external AI providers experience outages or rate limits.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: `v18.x` or later
- **Package Manager**: `npm`, `pnpm`, or `bun`
- **Database**: MongoDB instance (Local or free MongoDB Atlas Cluster)
- **API Key**: Groq API Key (Free tier from [Groq Console](https://console.groq.com/))

### Environment Setup

Create a `.env.local` file in the root directory:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/stanza?retryWrites=true&w=majority
GROQ_API_KEY=gsk_your_groq_api_key_here
```

### Installation
1. Clone the repository:

```Bash
git clone [https://github.com/aaditya-dubey09/stanza.git](https://github.com/aaditya-dubey09/stanza.git)
cd stanza
```

1. Install dependencies:

```Bash
npm install
```

- Run the development server:

```Bash
npm run dev
```

Open <http://localhost:3000> in your browser.

### 🛠️ Usage & API Quickstart

1. Generating an Endpoint via UI

- Enter your prompt (e.g., "A list of 10 e-commerce products with id, title, price, inStock status, and category").

- Choose your endpoint lifespan (e.g., 24 hours).

- Toggle between List (Array) or Single Item mode.

- Click Generate Live Mock API and copy your deployment URL.

1. Testing CRUD Operations on a Live Mock
Once generated, your mock URL (e.g., /api/mock/a1b2c3d4) acts as a full REST backend:

- Read Collection (GET):

```Bash
curl -X GET "[https://stanza/api/mock/a1b2c3d4](https://stanza/api/mock/a1b2c3d4)"
```

- Create Item (POST):

```Bash
curl -X POST "[https://stanza/api/mock/a1b2c3d4](https://stanza/api/mock/a1b2c3d4)" \
     -H "Content-Type: application/json" \
     -d '{"title": "Wireless Mouse", "price": 29.99}'
```

- Update Item by ID (PUT):

```Bash
curl -X PUT "[https://stanza/api/mock/a1b2c3d4?itemId=1](https://stanza/api/mock/a1b2c3d4?itemId=1)" \
     -H "Content-Type: application/json" \
     -d '{"inStock": false}'
```

- Delete Item by ID (DELETE):

```Bash
curl -X DELETE "[https://stanza/api/mock/a1b2c3d4?itemId=1](https://stanza/api/mock/a1b2c3d4?itemId=1)"
```

3. Simulation Parameters
- Simulate Latency (Delay): Append ?delay=ms (clamped between 0 and 10,000ms).

```Bash
GET /api/mock/a1b2c3d4?delay=3000
```

- Simulate Status Codes: Append ?status=code or ?statusCode=code.

```Bash
GET /api/mock/a1b2c3d4?status=401
```

### 🏗️ Architecture Stack

- Framework: Next.js 15 (App Router) + React 19

- Language: TypeScript

- Styling: Tailwind CSS + Lucide Icons

- AI Inference Engine: Open-weight models (qwen/qwen3.8-27b) via Groq Cloud API

- Data Generation: @faker-js/faker

- Database Layer: MongoDB Atlas (Mongoose ODM with TTL indexing)

Validation: Zod

### 📄 License
This project is open-source software licensed under the AGPL-3.0 License.
