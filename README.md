# NexusChat: Scalable WebSocket Communication Hub

## Description
This project implements a real-time chat application backend using WebSockets, built with TypeScript. It supports multiple independent chat rooms, allowing users to create, join, send messages, and leave these rooms dynamically. The server manages active connections and chat history for each room.

## Key Features
*   **Real-time Messaging:** Utilizes WebSockets for instant, bidirectional communication between clients and the server.
*   **Multiple Chat Rooms:** Supports the creation and management of numerous isolated chat rooms.
*   **Dynamic Room Management:** Rooms are created on demand and automatically closed when all participants have left.
*   **Message Broadcasting:** Messages sent within a room are broadcasted to all active participants in that specific room.
*   **Server-Side State Management:** Maintains chat history and active client connections for each room on the server.
*   **User Notifications:** Informs participants when a user joins or leaves a room.

## Architecture
The application employs a client-server architecture centered around a robust WebSocket server.

*   **WebSocket Server (`ws`):** The core of the application is a `WebSocketServer` instance listening on port `8080`. This server is responsible for handling all incoming WebSocket connections and managing real-time data exchange.

*   **Data Structures for State Management:**
    *   `SOCKETS`: A `Map<RoomID, WebSocket[]>` that stores the active `WebSocket` connections for each `RoomID`. This map is crucial for tracking which clients are currently present in which chat rooms, enabling targeted message broadcasting.
    *   `MESSAGES`: A `Map<RoomID, Message[]>` that holds the complete chat history for each `RoomID`. Each `Message` object contains the `sender` and the `message` content. This ensures that new participants can receive past messages and the conversation context is maintained.

*   **Request Handling:** The server processes various client requests, each defined by a `Request` interface with a `type` field:
    *   `"create"`: A client requests to create a new chat room. The server initializes empty entries in `SOCKETS` and `MESSAGES` for the new `roomID`.
    *   `"join"`: A client requests to join an existing room. The client's `WebSocket` is added to the corresponding `SOCKETS` array, and a server-generated "user joined" message is added to `MESSAGES`. The current chat history is then sent to the newly joined client.
    *   `"message"`: A client sends a message to their current room. The message is appended to the `MESSAGES` history for that `roomID`, and the updated history is broadcasted to all clients in that room.
    *   `"leave"`: A client requests to leave a room. The client's `WebSocket` is removed from the `SOCKETS` array, a "user left" message is added to `MESSAGES`, and the updated history is broadcasted. If a room becomes empty after a client leaves, both its `SOCKETS` and `MESSAGES` entries are removed, effectively closing the room.

*   **Error Handling:** The server includes basic error handling to respond to invalid requests or attempts to interact with non-existent rooms.

## Getting Started

### Prerequisites
*   Node.js (LTS recommended)
*   npm or yarn

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/MukulPretham/chatRoom.git
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd chatRoom
    ```
3.  **Install dependencies:**
    ```bash
    npm install
    ```

### Running the Server

1.  **Build the TypeScript project:**
    ```bash
    npm run build
    ```
    This command compiles the TypeScript code from `src/index.ts` into JavaScript, typically into a `dist/` directory.

2.  **Start the WebSocket server:**
    ```bash
    npm start
    ```
    The server will start and listen for WebSocket connections on port `8080`.

## Code Overview

*   `src/index.ts`: This is the primary server-side application file. It contains the complete implementation of the WebSocket server, including connection handling, message parsing, room management logic (create, join, message, leave), and state management using `SOCKETS` and `MESSAGES` maps. It defines the data types for `RoomID`, `Message`, and `Request` used throughout the application.
