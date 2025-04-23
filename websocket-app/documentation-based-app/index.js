import { Server } from "socket.io";
import express from 'express';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';


const app = express();
const server = createServer(app);
const io = new Server(server,{
  connectionStateRecovery:{}//state not recovering
});

const __dirname = dirname(fileURLToPath(import.meta.url));

app.get('/', (req, res) => {
    return res.sendFile(join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
    console.log('a user connected',socket.id);
 
    if (socket.recovered) {
        console.log('Client reconnected and state was recovered.');
      } else {
        console.log('New connection or unable to recover state.');
      }

    socket.on('chat message', (msg) => {
        console.log('message: ' + msg);
        io.volatile.emit('chat message',msg)
      });
    // socket.on('disconnect', () => {
    //   console.log('user disconnected');
    // });
 
  });

app.get('/', (req, res) => {
  res.send('<h1>Hello world</h1>');
});

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});
