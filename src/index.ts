import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({port: 8080});

let RoomID: string = "";
let Messages: any[];

wss.on("connection",(socket)=>{
    
    socket.on("message",(data)=>{
        const req = JSON.parse(data.toString());
        if(!req.type){
            socket.send(JSON.stringify({type: "error",message: `Invalid request to room no:  ${RoomID}`}));
            return;
        }
        else if(req.type == "create" && req.roomID){
            RoomID = req.roomID;
            Messages = [];
            console.log(`current room running : ${RoomID}`);
            socket.send(JSON.stringify({type: "create",message: `Room created ID = ${RoomID} `, roomID: RoomID }));
            return;
        }
        else if(req.type == "join" && req.roomID == RoomID){
            
            socket.send(JSON.stringify({type: "join" ,message: `Joined in Room no : ${RoomID}`}));
            console.log(`Number of connections : ${wss.listenerCount.length}`);
            return;
        }
        else if(req.type == "message"&& req.roomID == RoomID && req.payload && req.payload.message && req.payload.sender){
            Messages.push(req.payload);
            for (const client of wss.clients) {
                if(client.readyState == client.OPEN){
                    client.send(JSON.stringify(Messages));
                }          
            }
            return;
        }
        else{
            socket.send(JSON.stringify({type: "error", message: "Invalid request or roomID"}));
            return;
        }
        
    })
})