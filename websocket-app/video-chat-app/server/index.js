import express from 'express';
import { Server, Socket } from 'socket.io';
import bodyParser from 'body-parser';
const app = express();
const io = new Server({
    cors:true
});

app.use(bodyParser.json());

const EmailToSocketMapping = new Map();  

io.on("connection", socket =>{
    socket.on("join-room",(data)=>{
        const { roomId , emailId } = data;
        console.log("User",emailId,"joined room:", roomId);
        
        socket.join(roomId);
        socket.emit("joined-room",{roomId})
        socket.broadcast.to(roomId).emit("user-joined",{emailId})
    })
})

app.listen(8001,console.log(`Server running at http://localhost:8001`));
io.listen(8000);

