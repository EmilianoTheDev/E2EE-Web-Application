# E2EE Web Application

A real-time encrypted messaging demo exploring browser-side encryption, shared room secrets, and Socket.IO chat rooms.

This is a portfolio/academic demo, not a production-ready E2EE messenger. It is useful for showing the shape of browser-side encryption and real-time room messaging, but it does not implement production key exchange, identity verification, account security, persistence, abuse controls, or a complete threat model.

## Screenshots

### Join Room

![Join screen](docs/screenshots/join.png)

### Chat Room

![Chat room](docs/screenshots/chat-room.png)

### Message Flow

![Message flow](docs/screenshots/message-flow.png)

## Project Structure

```text
.
├── client/        # Create React App frontend
├── server/        # Express + Socket.IO server
├── docs/          # Portfolio screenshots
├── scripts/       # Screenshot capture helper
├── .env.example   # Combined environment variable reference
└── vercel.json    # Vercel config for deploying the frontend
```

The frontend and backend are separate apps. The frontend builds to static files and is a good fit for Vercel. The backend is a long-running Socket.IO server and should be deployed separately on a host that supports persistent WebSocket connections.

## Requirements

- Node.js 18 or newer
- npm 10 or newer

## Environment Variables

Client, in `client/.env` or Vercel project settings:

```bash
REACT_APP_SERVER_URL=http://localhost:3001
```

Server, in `server/.env` or the server host settings:

```bash
PORT=3001
CLIENT_ORIGIN=http://localhost:3000
```

For production, set:

- `REACT_APP_SERVER_URL` to the public HTTPS URL of the Socket.IO server, such as `https://your-chat-server.onrender.com`.
- `CLIENT_ORIGIN` to the public Vercel frontend URL, such as `https://your-project.vercel.app`.

`CLIENT_ORIGIN` also accepts comma-separated origins for local plus deployed testing:

```bash
CLIENT_ORIGIN=http://localhost:3000,https://your-project.vercel.app
```

## Run Locally

Install and start the server:

```bash
cd server
npm install
cp .env.example .env
npm start
```

The server runs at `http://localhost:3001` by default.

In a second terminal, install and start the client:

```bash
cd client
npm install
cp .env.example .env
npm start
```

The client runs at `http://localhost:3000` by default.

## Build Locally

Build the React frontend:

```bash
cd client
npm run build
```

The compiled frontend is written to `client/build/`.

The Socket.IO server does not have a compile step. It runs with:

```bash
cd server
npm start
```

## Deploying

### Frontend on Vercel

This repository includes `vercel.json` for deploying the Create React App frontend from the repo root.

In Vercel:

- Import the repository.
- Keep the project root as the repository root.
- Add `REACT_APP_SERVER_URL` with the public URL of the deployed Socket.IO server.
- Deploy.

The Vercel config runs:

```bash
cd client && npm ci
cd client && npm run build
```

and serves `client/build`. The SPA rewrite in `vercel.json` keeps direct links like `/chat?name=...&room=...` working.

### Backend on Render, Railway, Fly.io, or Similar

Do not rely on Vercel serverless functions for this Socket.IO backend. Socket.IO needs a long-running process and reliable WebSocket support, while Vercel serverless functions are request/response oriented and not designed for persistent socket servers.

Deploy `server/` to a platform such as Render, Railway, Fly.io, or another Node host that supports WebSockets. Configure:

Render settings:

- Root Directory: `server`
- Build Command: `npm install`
- Start Command: `npm start`
- Environment Variable: `CLIENT_ORIGIN=https://your-project.vercel.app`

Server environment:

```bash
PORT=<provided by host>
CLIENT_ORIGIN=https://your-project.vercel.app
```

Then update the Vercel frontend environment variable:

```bash
REACT_APP_SERVER_URL=https://your-chat-server.example.com
```

## Available Scripts

Client:

- `npm start`: run the React development server.
- `npm run build`: build the production React bundle.
- `npm test`: run the Create React App test runner.

Server:

- `npm start`: run the Express + Socket.IO server.
- `npm run dev`: run the server with Nodemon.

## Security Limitations

- Demo-only shared secret: the room name is used to derive the message encryption key.
- No production key exchange: users do not authenticate each other or negotiate keys securely.
- No identity verification: a user name is only a room-local display value.
- In-memory server state: room membership is stored in process memory and disappears on restart.
- Metadata is not protected: the server still sees room names, socket connections, timing, and message sizes.
- No persistence or multi-instance coordination: scaling the server would require external state and a Socket.IO adapter.

Use this project as a portfolio demonstration of concepts, not as a secure messaging product.

## Updating Screenshots

The README screenshots live in `docs/screenshots/`.

To manually refresh them, open the app in two browser tabs or windows, join the same room with two different names, and send a message.

There is also a small Chrome DevTools capture script:

```bash
cd server
CLIENT_ORIGIN=http://localhost:3002 npm start
```

```bash
cd client
PORT=3002 BROWSER=none npm start
```

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless=new \
  --remote-debugging-port=9223 \
  --user-data-dir=/private/tmp/e2ee-chrome-profile \
  --disable-gpu \
  --no-first-run \
  --no-default-browser-check \
  about:blank
```

```bash
node scripts/capture-screenshots.mjs
```
