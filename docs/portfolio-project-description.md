# Portfolio Project Description

## Short Summary

A real-time encrypted messaging demo that grew out of a university group project on browser-side cryptography, shared room secrets, and Socket.IO chat rooms. The revived version presents the project as a polished portfolio piece with clearer documentation, deployment guidance, and an honest security model.

## Key Technologies

- React
- Create React App
- Express
- Node.js
- Socket.IO
- Web Crypto API
- AES-GCM
- PBKDF2
- Vercel frontend deployment
- Render-style Node backend deployment

## Engineering Challenges

- Coordinating real-time room membership and message delivery with Socket.IO.
- Encrypting messages in the browser before sending them through the server.
- Serializing encrypted payloads and initialization vectors so they could be relayed as chat messages.
- Separating static frontend deployment from a long-running WebSocket backend.
- Explaining security tradeoffs without overstating what the demo provides.

## What I Learned

This project taught me that secure messaging is much more than choosing a strong encryption primitive. Web Crypto and AES-GCM can protect message payloads in a browser demo, but production E2EE requires authenticated key exchange, identity verification, key rotation, metadata awareness, and careful UX around trust.

Reviving the project also reinforced the importance of deployment clarity. A static React app can deploy cleanly to Vercel, while Socket.IO needs a persistent Node host such as Render, Railway, or Fly.io.

## Links

- GitHub: `<GitHub repo URL>`
- Live Demo: `<Live demo URL>`
- Original Academic Paper: `<Paper URL or repository docs/e2ee-paper.pdf>`
