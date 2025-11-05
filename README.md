# ChatRoom

## Description
ChatRoom is a real-time chat application built with WebSockets, enabling users to create and join dynamic chat rooms and exchange messages instantly.

## Key Features
*   **Real-time Messaging:** Instant message delivery between users in the same chat room.
*   **Room Creation:** Users can create new chat rooms with unique IDs.
*   **Room Joining:** Users can join existing chat rooms using their respective IDs.
*   **User Notifications:** Get notified when users enter or leave a chat room.
*   **Multiple Chat Rooms:** Supports multiple isolated chat rooms concurrently.

## Getting Started

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

1.  **Compile the TypeScript code:**
    ```bash
    npx tsc
    ```
2.  **Start the server:**
    ```bash
    node dist/index.js
    ```
    The server will start and listen for WebSocket connections on port `8080`.

## Code Overview

*   `src/index.ts`: This is the core server-side application file written in TypeScript. It utilizes the `ws` library to manage WebSocket connections. The file defines the logic for handling various client requests, including creating new chat rooms, allowing users to join rooms, broadcasting messages within a room, and managing user departures. It maintains two primary data structures: `SOCKETS` (a `Map` to store active WebSockets per `RoomID`) and `MESSAGES` (a `Map` to store chat history for each `RoomID`). The server processes requests of types `create`, `join`, `message`, and `leave` to facilitate real-time chat interactions.