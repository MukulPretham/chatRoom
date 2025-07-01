# Ghost Chat – WebSocket-Based Chat Room

A real-time chat application built using **WebSockets** where users can create or join rooms using a unique Room ID. Once all users leave a room, it is permanently destroyed. No messages are stored — offering complete privacy through temporary chat sessions.

## Features

- Real-time bi-directional communication with WebSockets
- Create or join chat rooms using custom Room IDs
- Rooms are destroyed when empty — no persistence
- Lightweight and privacy-focused
- Styled using Tailwind CSS for a clean UI

## WebSocket Implementation

The core of this project uses the native `ws` WebSocket library in Node.js:

- A WebSocket server runs on top of the Express server.
- Each client connects to the WebSocket server and joins a room.
- Messages are broadcast only to users in the same room.
- When all users leave a room, it is deleted from the server's memory.
- No messages are saved on the server — once disconnected, all chat history is gone.

This makes it ideal for temporary, anonymous conversations without any data retention.

## Tech Stack

- Node.js
- Express.js
- ws (WebSocket)
- Tailwind CSS
- HTML/CSS/JS

## Setup

```bash
git clone https://github.com/MukulPretham/chatRoom.git
cd chatRoom
npm install
node server.js
