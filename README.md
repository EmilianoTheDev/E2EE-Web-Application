# E2EE Web Application

A small real-time chat application built with React, Express, and Socket.IO. The project was originally made to explore how browser clients can exchange messages through a server while keeping message content encrypted before it leaves the browser.

## Why We Made This

This app was built as a learning project for end-to-end encrypted messaging concepts:

- Practice building a full-stack JavaScript application with a React client and Node/Express server.
- Learn how Socket.IO rooms can support real-time chat between multiple users.
- Experiment with browser-native cryptography through the Web Crypto API.
- Demonstrate the difference between transporting messages through a server and letting the server read those messages.

The current encryption is a demo implementation that derives a shared room key from the room name. It is useful for showing the flow of encrypted client-to-client messages, but it is not production-grade key management.

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
├── client/   # React chat UI
├── server/   # Express + Socket.IO API
└── docs/
    └── screenshots/ # Add README screenshots here
```

## Requirements

- Node.js 18 or newer
- npm 10 or newer

This update was verified locally with Node `v23.10.0` and npm `10.9.2`.

## Run Locally

Install and start the server:

```bash
cd server
npm install
npm start
```

The server runs at `http://localhost:3001` by default.

In a second terminal, install and start the client:

```bash
cd client
npm install
npm start
```

The client runs at `http://localhost:3000` by default.

If port `3000` is already in use, start the client on another port and update the server CORS origin:

```bash
# terminal 1
cd server
CLIENT_ORIGIN=http://localhost:3002 npm start

# terminal 2
cd client
PORT=3002 npm start
```

## Build Locally

To make sure the React app can compile for production:

```bash
cd client
npm run build
```

The compiled output is written to `client/build/`.

## Environment Variables

Copy the examples if you want to customize ports or URLs:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

Client:

- `REACT_APP_SERVER_URL`: Socket.IO server URL. Defaults to `http://localhost:3001`.

Server:

- `PORT`: API/socket server port. Defaults to `3001`.
- `CLIENT_ORIGIN`: React app origin allowed by CORS. Defaults to `http://localhost:3000`.

## Updating Screenshots

The README screenshots live in `docs/screenshots/`:

- Join screen: `docs/screenshots/join.png`
- Chat room: `docs/screenshots/chat-room.png`
- Message flow: `docs/screenshots/message-flow.png`

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

## Available Scripts

Server:

- `npm start`: run the server with Node.
- `npm run dev`: run the server with Nodemon for local development.

Client:

- `npm start`: run the React dev server.
- `npm run build`: build the production React bundle.
- `npm test`: run Create React App tests.

## Notes

- The server relays Socket.IO events and tracks users in memory. Restarting the server clears room/user state.
- The encryption demo requires browser crypto support and works on localhost.
- Do not use the room name as a real production encryption secret. A production E2EE app needs authenticated key exchange, identity verification, secure key storage, and a stronger threat model.
