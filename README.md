# Collaborative Markdown Editor

A real-time, collaborative markdown editor featuring a live preview, designed to emulate a lightweight development environment for project documentation and co-editing.

---

## 🚀 Features

- **Real-time Collaboration:** Multiple users can edit the same project simultaneously.
- **Live Markdown Preview:** Instant rendering of markdown content as you type.
- **Project-Based Collaboration:** Users must create a project and invite collaborators to start editing.
- **Visual Editor Interface:** An interface designed to feel like a lightweight code editor, allowing users to navigate, create, edit, update, and remove files within a project structure (tree view).
- **Authentication:** Secure sign-in using Google OAuth.

---

## 🛠️ Tech Stack

| Category               | Technology                                                    |
| :--------------------- | :------------------------------------------------------------ |
| **Frontend Framework** | **Next.js**                                                   |
| **Database**           | **MongoDB**, **Supabase**                                     |
| **Authentication**     | **Next-Auth**, **Google OAuth**                               |
| **Real-time Engine**   | **Yjs** (using Supabase for temporary Real-time capabilities) |

---

## ⚠️ Collaboration Engine Note

This project utilizes **Yjs** for collaborative editing. Due to deployment constraints (specifically, Vercel's lack of support for persistent WebSockets on the free tier), the initial real-time connection is currently routed through **Supabase Realtime**.

> 💡 **Future Plan:** Upon securing investment, the plan is to transition the deployment to **AWS** and implement a dedicated WebSocket server for Yjs, bypassing the limitations of Supabase's free connection limit (currently 100 connections).

---

## ⚙️ Getting Started

### Prerequisites

You need **Node.js** and **npm** installed on your machine.

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/e2e2a/nextjs-markdown
    cd nextjs-markdown
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```

### Environment Variables

Create a file named `.env.local` in the root of your project and populate it with the following environment variables.

| Variable                   | Description                                                                |
| :------------------------- | :------------------------------------------------------------------------- |
| `MONGO_URI`                | Connection string for your MongoDB database.                               |
| `JWT_SECRET`               | A secret key used for signing JWTs (e.g., for general API tokens).         |
| `NEXTAUTH_URL`             | The URL of your app (e.g., `http://localhost:3000`).                       |
| `NEXTAUTH_SECRET`          | A secret used to encrypt Next-Auth cookies and tokens. **Must be strong.** |
| `GOOGLE_CLIENT_ID`         | Your Google OAuth client ID.                                               |
| `GOOGLE_CLIENT_SECRET`     | Your Google OAuth client secret.                                           |
| `NEXT_PUBLIC_BASE_URL`     | The public base URL for API calls.                                         |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL for the Real-time connection.                    |
| `NEXT_PUBLIC_SUPABASE_KEY` | Your Supabase public anonymous key.                                        |
