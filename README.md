# ChatRoom WebSocket Server

This project implements a simple real-time chat server using WebSockets. It allows users to create and join chat rooms, send messages, and see when other users join or leave a room. The server manages active rooms, connected clients, and message history for each room.

## Key Features

*   **Real-time Communication:** Utilizes WebSockets for instant message delivery.
*   **Room Management:** Users can create unique chat rooms.
*   **Join/Leave Functionality:** Users can join existing rooms and are notified when others enter or exit.
*   **Message Broadcasting:** Messages sent in a room are broadcasted to all connected clients within that room.
*   **Server-side State Management:** Maintains separate lists of connected sockets and message history for each room.

## Getting Started

### Prerequisites

*   Node.js (with npm or yarn)

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/MukulPretham/chatRoom.git
    cd chatRoom
    ```
2.  Install dependencies:
    ```bash
    npm install
    # or
    yarn install
    ```

### Running the Server

To start the WebSocket server, run the following command:```bash
npm run start
# or
yarn start
```
The server will listen for WebSocket connections on port `8080`.

## Code Overview

*   **`src/index.ts`**: This is the main server file. It sets up a WebSocket server, handles new client connections, and processes different types of requests (create room, join room, send message, leave room). It uses `Map` objects to store active `SOCKETS` (WebSocket connections per room) and `MESSAGES` (message history per room).