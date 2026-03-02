# 📝 Collaborative Markdown Workspace (Obsidian-Style)

A real-time, multi-user markdown editor that merges the powerful knowledge-management feel of **Obsidian** with the structural agility of **VS-Code**. Built for developers and teams who need a "second brain" that stays in sync across every device.

---

## 🚀 Key Features

- **Obsidian-Inspired Editor:** A sleek, minimal markdown interface focused on writing, linking, and organization.
- **Real-time Collaboration:** Powered by **Yjs** and **Hocuspocus (WebSockets)**—see your team's cursors and edits with zero latency.
- **VS-Code File System:** A robust tree-view interface to create, move, and manage files within collaborative projects.
- **Docker-Ready:** One-command setup including a **MongoDB Replica Set** (required for transaction support).
- **Live Preview:** Instant, high-fidelity rendering of markdown syntax as you type.
- **Secure Auth:** Integration with **Next-Auth** for protected, project-based workspaces.

---

## 🛠️ Tech Stack

| Category               | Technology                                   |
| :--------------------- | :------------------------------------------- |
| **Frontend Framework** | **Next.js (App Router)**                     |
| **Real-time Engine**   | **Yjs** + **Hocuspocus Server** (WebSockets) |
| **Database**           | **MongoDB** (Replica Set enabled)            |
| **Authentication**     | **Next-Auth**                                |
| **Infrastructure**     | **Docker Compose**                           |

---

## ⚙️ Quick Start (Docker - Recommended)

To avoid "it works on my machine" issues with MongoDB Replica Sets and WebSockets, use the containerized setup.

### 1. Clone & Prep

```bash
git clone [https://github.com/e2e2a/nextjs-markdown](https://github.com/e2e2a/nextjs-markdown)
cd nextjs-markdown
# Create your .env file based on the section below
```

### 2. 🔑 Environment Variables (.env)

```bash
cp .env.example .env
```

### 3. Launch the Infrastructure

The Docker setup automatically initializes the Database, the App, and the Hocuspocus WebSocket server.

```bash
    docker compose up -d --build
```

- **App**: [localhost:3000](http://localhost:3000/)
- **Mongo Express (GUI)**: [[localhost:8081](http://localhost:8081/)]
- **Hocuspocus WebSocket**: [[ws://localhost:1234](ws://localhost:1234)]

### 4. Seed initial Data

```bash
docker exec -it nextjs_app npm run seed
```

### 🏁 5. Access & Testing

Once the database is seeded, you can log in and start collaborating immediately.

1. **Open the App:** Navigate to [http://localhost:3000/login](http://localhost:3000/login)
2. **Use Test Credentials:**

| Account    | Email                | Password   |
| :--------- | :------------------- | :--------- |
| **User A** | `example1@gmail.com` | `password` |

## 🛠️ Local Installation (Manual Windows/macOS)

If you are not using Docker, you must have a local MongoDB instance with a Replica Set configured.

### 1. Install MongoDB Compass application

### 2. Install Dependencies:

```bash
npm install && npm run build
```

### 3. Environment Variables (.env)

```bash
cp .env.example .env
```

### 4. Start Next.js (Terminal 1):

```bash
npm run dev
```

- **App**: [localhost:3000](http://localhost:3000/)

### 5. Start Hocuspocus WebSocket Server (Terminal 2):

```bash
npm run y-server
```

### 6. Seed initial Data

```bash
npm run seed
```

### 🏁 5. Access & Testing

Once the database is seeded, you can log in and start collaborating immediately.

1. **Open the App:** Navigate to [http://localhost:3000/login](http://localhost:3000/login)
2. **Use Test Credentials:**

| Account    | Email                | Password   |
| :--------- | :------------------- | :--------- |
| **User A** | `example1@gmail.com` | `password` |

> [!TIP]
> **Test Real-time Sync:** Open the app in two different browser windows (or one in Incognito mode). Log in with both accounts to see live cursor tracking and instant Markdown syncing powered by **Yjs**.
