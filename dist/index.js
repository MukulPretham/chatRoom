"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const wss = new ws_1.WebSocketServer({ port: 8080 });
// let RoomID: string = "";
let SOCKETS = new Map();
let MESSAGES = new Map();
wss.on("connection", (socket) => {
    socket.send(JSON.stringify({ type: "message", message: "Connected to Server" }));
    socket.on("open", () => {
        console.log(wss.clients.size);
    });
    socket.on("message", (data) => {
        var _a, _b, _c, _d, _e;
        console.log(wss.clients.size);
        const req = JSON.parse(data.toString());
        if (!req.type) {
            socket.send(JSON.stringify({ type: "error", message: `Invalid request` }));
            return;
        }
        else if (req.type == "create" && req.roomID) {
            if (SOCKETS.has(req.roomID)) {
                socket.send(JSON.stringify({ type: "error", message: "Room already exist" }));
                return;
            }
            SOCKETS.set(req.roomID, []);
            MESSAGES.set(req.roomID, []);
            console.log(`room no : ${req.roomID} created `);
            socket.send(JSON.stringify({ type: "create", message: `Room created by the ID ${req.roomID} ` }));
            return;
            // RoomID = req.roomID;
            // Messages = [];
            // console.log(`current room running : ${RoomID}`);
            // socket.send(JSON.stringify({type: "create",message: `Room created ID = ${RoomID} `, roomID: RoomID }));
            // return;
        }
        else if (req.type == "join" && req.roomID && req.name) {
            if (!SOCKETS.get(req.roomID)) {
                socket.send(JSON.stringify({ type: "error", message: "The given roomID does not exist" }));
                return;
            }
            socket.send(JSON.stringify({ type: "message", message: `Entered Room: ${req.roomID}` }));
            let updatedSockets = SOCKETS.get(req.roomID);
            updatedSockets === null || updatedSockets === void 0 ? void 0 : updatedSockets.push(socket);
            if (!updatedSockets) {
                socket.send(JSON.stringify({ type: "error", message: "Something went wrong" }));
                return;
            }
            SOCKETS.set(req.roomID, updatedSockets);
            let updatedMessages = MESSAGES.get(req.roomID);
            updatedMessages === null || updatedMessages === void 0 ? void 0 : updatedMessages.push({ sender: "server", message: `${req.name} entered the chat` });
            if (!updatedMessages) {
                socket.send(JSON.stringify({ type: "error", message: "Something went wrong" }));
                return;
            }
            MESSAGES.set(req.roomID, updatedMessages);
            let userNo = (_a = SOCKETS.get(req.roomID)) === null || _a === void 0 ? void 0 : _a.length;
            (_b = SOCKETS.get(req.roomID)) === null || _b === void 0 ? void 0 : _b.forEach((socket, index) => {
                socket.send(JSON.stringify(MESSAGES.get(req.roomID)));
            });
            // socket.send(JSON.stringify({ type: "join", message: `joined are User No: ${userNo}` }));
            // socket.send(JSON.stringify({type: "join" ,message: `Joined in Room no : ${RoomID}`}));
            // Messages.push({sender: "server", message: `${req.name} joined the room`});
            // for (const client of wss.clients) {
            //     if(client.readyState == client.OPEN){
            //         client.send(JSON.stringify(Messages));
            //     }          
            // }
            // console.log(`Number of connections : ${wss.listenerCount.length}`);
            // return;
        }
        else if (req.type == "message" && req.roomID && req.payload && req.payload.message && req.payload.sender) {
            if (!SOCKETS.get(req.roomID)) {
                socket.send(JSON.stringify({ type: "error", message: "The given roomID does not exist" }));
                return;
            }
            let updatedMessages = MESSAGES.get(req.roomID);
            updatedMessages === null || updatedMessages === void 0 ? void 0 : updatedMessages.push({ sender: req.payload.sender, message: req.payload.message });
            if (!updatedMessages) {
                socket.send(JSON.stringify({ type: "error", message: "Something went wrong" }));
                return;
            }
            MESSAGES.set(req.roomID, updatedMessages);
            (_c = SOCKETS.get(req.roomID)) === null || _c === void 0 ? void 0 : _c.forEach((socket, index) => {
                socket.send(JSON.stringify(MESSAGES.get(req.roomID)));
            });
            // Messages.push(req.payload);
            // console.log(req.payload.sender + "sent message")
            // for (const client of wss.clients) {
            //     if (client.readyState == client.OPEN) {
            //         client.send(JSON.stringify(Messages));
            //     }
            // }
            // return;
        }
        else if (req.type == "leave" && req.name && req.roomID) {
            socket.close();
            if (!SOCKETS.get(req.roomID)) {
                socket.send(JSON.stringify({ type: "error", message: "The given roomID does not exist" }));
                return;
            }
            let updatedMessages = MESSAGES.get(req.roomID);
            if (!updatedMessages) {
                socket.send(JSON.stringify({ type: "error", message: "Something went wromg" }));
                return;
            }
            updatedMessages === null || updatedMessages === void 0 ? void 0 : updatedMessages.push({ sender: "server", message: `${req.name} left the chat` });
            let updatedSockets = (_d = SOCKETS.get(req.roomID)) === null || _d === void 0 ? void 0 : _d.filter(entry => entry !== socket);
            if (!updatedSockets) {
                socket.send(JSON.stringify({ type: "error", message: "Something went wrong" }));
                return;
            }
            SOCKETS.set(req.roomID, updatedSockets);
            MESSAGES.set(req.roomID, updatedMessages);
            (_e = SOCKETS.get(req.roomID)) === null || _e === void 0 ? void 0 : _e.forEach((socket, index) => {
                socket.send(JSON.stringify(MESSAGES.get(req.roomID)));
            });
            console.log(`${req.roomID} has ${updatedSockets.length} members`);
            // Messages.push({ sender: "server", message: `${req.name} left chat` });
            // for (const client of wss.clients) {
            //     if (client.readyState == client.OPEN) {
            //         client.send(JSON.stringify(Messages));
            //     }
            // }
        }
        else {
            socket.send(JSON.stringify({ type: "error", message: "Invalid request or roomID" }));
            return;
        }
    });
    socket.on('close', () => {
        console.log(`after closing ${wss.clients.size}`);
        SOCKETS.forEach((entry, roomID) => {
            if (entry.length === 0) {
                console.log(`closed ${roomID}`);
                SOCKETS.delete(roomID);
                MESSAGES.delete(roomID);
                return;
            }
        });
    });
});
