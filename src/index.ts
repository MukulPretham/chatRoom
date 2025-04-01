import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8080 });

type RoomID = string;

type Message = {
    sender: string,
    message: string
}

type Request = {
    type: string,
    roomID: string,
    name?: string,
    payload?: Message
}

// let RoomID: string = "";

let SOCKETS = new Map<RoomID, WebSocket[]>();
let MESSAGES = new Map<RoomID, Message[]>();


wss.on("connection", (socket) => {
    socket.send(JSON.stringify({type: "message", message: "Connected to Server"}));
    socket.on("open",()=>{
        console.log(wss.clients.size);
    })
    socket.on("message", (data) => {
        console.log(wss.clients.size);
        const req: Request = JSON.parse(data.toString());
        if (!req.type) {
            socket.send(JSON.stringify({ type: "error", message: `Invalid request` }));
            return;
        }
        else if (req.type == "create" && req.roomID) {
            if(SOCKETS.has(req.roomID)){
                socket.send(JSON.stringify({type: "error", message: "Room already exist"}));
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
            socket.send(JSON.stringify({type: "message", message: `Entered Room: ${req.roomID}`}));
            let updatedSockets: WebSocket[] | undefined = SOCKETS.get(req.roomID);
            updatedSockets?.push(socket);
            if(!updatedSockets){
                socket.send(JSON.stringify({type: "error", message: "Something went wrong"}));
                return;
            }
            SOCKETS.set(req.roomID, updatedSockets);
            let updatedMessages:Message[] | undefined = MESSAGES.get(req.roomID);
            updatedMessages?.push({sender: "server",message: `${req.name} entered the chat`});
            if(!updatedMessages){
                socket.send(JSON.stringify({type: "error", message: "Something went wrong"}));
                return;
            }
            MESSAGES.set(req.roomID,updatedMessages);
            let userNo: number | undefined = SOCKETS.get(req.roomID)?.length;
            SOCKETS.get(req.roomID)?.forEach((socket,index)=>{
                socket.send(JSON.stringify(MESSAGES.get(req.roomID)));
            })
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
            if(!SOCKETS.get(req.roomID)){
                socket.send(JSON.stringify({ type: "error", message: "The given roomID does not exist" }));
                return;
            }
            let updatedMessages = MESSAGES.get(req.roomID);
            updatedMessages?.push({sender: req.payload.sender,message: req.payload.message});
            if(!updatedMessages){
                socket.send(JSON.stringify({type: "error", message: "Something went wrong"}));
                return;
            }
            MESSAGES.set(req.roomID,updatedMessages);
            SOCKETS.get(req.roomID)?.forEach((socket,index)=>{
                socket.send(JSON.stringify(MESSAGES.get(req.roomID)));
            })
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
            if(!SOCKETS.get(req.roomID)){
                socket.send(JSON.stringify({ type: "error", message: "The given roomID does not exist" }));
                return;
            }
            let updatedMessages = MESSAGES.get(req.roomID);
            if(!updatedMessages){
                socket.send(JSON.stringify({type: "error", message: "Something went wromg"}));
                return;
            }
            updatedMessages?.push({sender: "server", message: `${req.name} left the chat`});
            
            let updatedSockets = SOCKETS.get(req.roomID)?.filter(entry => entry!==socket);
            if(!updatedSockets){
                socket.send(JSON.stringify({type: "error", message: "Something went wrong"}));
                return;
            }
            SOCKETS.set(req.roomID,updatedSockets)
            
            
            MESSAGES.set(req.roomID,updatedMessages);
            SOCKETS.get(req.roomID)?.forEach((socket,index)=>{
                socket.send(JSON.stringify(MESSAGES.get(req.roomID)));
            })
            console.log(`${req.roomID} has ${updatedSockets.length} members`)
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
    })
    socket.on('close',()=>{
        console.log(`after closing ${wss.clients.size}`);
        SOCKETS.forEach((entry, roomID)=>{
            if(entry.length === 0){
                console.log(`closed ${roomID}`);
                SOCKETS.delete(roomID);
                MESSAGES.delete(roomID);
                
                return;
            }
        })
    })
})