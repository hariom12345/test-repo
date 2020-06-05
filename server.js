require('dotenv').config();
//console.log(process.env);
const express = require('express');
const app = express();
const cors = require('cors');
const path  = require('path')
const http = require('http').createServer(app);
const socketIO = require('socket.io');
const io  = socketIO(http);

const port = process.env.PORT || 3000 ;

app.use(express.json())
// Point static path to dist
app.use(express.static(path.join(__dirname, 'dist')));
app.use(cors())
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});
var clients = {};
io.on('connection', (socket,i) => {
  console.log("Socket connected")
      socket.on('room', function(room){
        console.log("Room joined")  
        clients[socket.id] = socket.id;
        socket.join(room)
        socket.on('new-message', (message) => {
          console.log(clients);
          io.sockets.in(room).emit('new-message',message);
          });


          socket.on('disconnect', function () { 
         //   console.log("inner");
         //   console.log("Disconneted")
           // Emits a status message to the connected room when a socket client is disconnected
            io.sockets.in(room).emit('room-diconnected','room-diconnectd'); 
            socket.leave(room);
            delete clients[socket.id]; 
            console.log(clients);
          })  
      })
      
      socket.on('disconnect', function (data) { 
       // console.log("bahar");
        delete clients[socket.id];
        console.log(clients);
        console.log("Disconneted")  // Emits a status message to the connected room when a socket client is disconnected
      })  
});

app.listen(port,() => {
    console.log(`started on port: ${port}`);
});
