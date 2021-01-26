const express = require('express')
const socket = require('socket.io')
const http = require('http')

const PORT = process.env.PORT || 5000;

const cors = require('cors');

const app = express();

// CORS
app.use(cors());

const server = http.createServer(app);

const io = socket(server
  , {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"]
    }
  }
);

const { addUser, removeUser, getUser, getUsersInRoom } = require('./users');

io.on('connection', (socket) => {

  // console.log("User Connected : ", socket.id);
  socket.on("joinRoom", function ({ userName, roomName }, callback) {

    const { error, newUser } = addUser({ socketId: socket.id, userName, roomName });

    if (error) {
      // Error Case
      return callback(error);
    }
    socket.join(newUser.roomName);
    socket.emit("selfWelcome", { text: `Welcome to the Room : ${newUser.roomName}` });
    socket.broadcast.to(newUser.roomName).emit("userNotification", { text: `${newUser.userName} has joined the Room.` });
    // callback();
  })

  socket.on("sendMsg", (message, callback) => {

    const currUser = getUser(socket.id);
    io.to(currUser.roomName).emit('msg', { userName: currUser.userName, text: message })
    callback();

  })

  socket.on('disconnect', (reason) => {
    const leavingUser = getUser(socket.id);
    socket.broadcast.to(leavingUser.roomName).emit("userNotification", { text: `${leavingUser.userName} has Left the Room.` });
    console.log('user disconnected : ', socket.id);
  });
})

server.listen(PORT, () => {
  console.log("Listening on : http://127.0.0.1:" + PORT);
})