"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const wss = new ws_1.WebSocketServer({ port: 8080 });
let RoomID = "";
let Messages;
wss.on("connection", (socket) => {
    socket.on("message", (data) => {
        const req = JSON.parse(data.toString());
        if (!req.type) {
            socket.send(JSON.stringify({ type: "error", message: `Invalid request to room no:  ${RoomID}` }));
            return;
        }
        else if (req.type == "create" && req.roomID) {
            RoomID = req.roomID;
            Messages = [];
            console.log(`current room running : ${RoomID}`);
            socket.send(JSON.stringify({ type: "create", message: `Room created ID = ${RoomID} `, roomID: RoomID }));
            return;
        }
        else if (req.type == "join" && req.roomID == RoomID && req.name) {
            socket.send(JSON.stringify({ type: "join", message: `Joined in Room no : ${RoomID}` }));
            Messages.push({ sender: "server", message: `${req.name} joined the room` });
            for (const client of wss.clients) {
                if (client.readyState == client.OPEN) {
                    client.send(JSON.stringify(Messages));
                }
            }
            console.log(`Number of connections : ${wss.listenerCount.length}`);
            return;
        }
        else if (req.type == "message" && req.roomID == RoomID && req.payload && req.payload.message && req.payload.sender) {
            Messages.push(req.payload);
            console.log(req.payload.sender + "sent message");
            for (const client of wss.clients) {
                if (client.readyState == client.OPEN) {
                    client.send(JSON.stringify(Messages));
                }
            }
            return;
        }
        else if (req.type == "leave" && req.name) {
            Messages.push({ sender: "server", message: `${req.name} left chat` });
            for (const client of wss.clients) {
                if (client.readyState == client.OPEN) {
                    client.send(JSON.stringify(Messages));
                }
            }
        }
        else {
            socket.send(JSON.stringify({ type: "error", message: "Invalid request or roomID" }));
            return;
        }
    });
    // socket.on('close',(code,reason)=>{
    //     console.log(reason.toString());
    //     console.log(`Menbers: ${wss.clients.size}`);
    //     Messages.push({sender: "server",message:reason.toString()});
    //     socket.send(Messages);
    // })
});
