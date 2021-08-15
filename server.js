const utils = require('./utils');
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

const {
  addUser, removeUser, getUser, showUsers, getRooms,
} = require('./users');

app.get('/rooms', (req, res) => {
  const rooms = getRooms();
  console.log("rooms : ", rooms);
  res.send({ rooms: rooms });
})

io.on('connection', (socket) => {

  // console.log("User Connected : ", socket.id);
  socket.on(utils.MESSAGE_TYPES.JOIN_ROOM, function ({ userName, roomName }, callback) {

    const { error, newUser } = addUser({ socketId: socket.id, userName, roomName });
    console.log("error : ", error);
    console.log("newUser : ", newUser);
    // showUsers();

    if (error) {
      socket.emit(
        utils.MESSAGE_TYPES.ERROR, {
        text: error,
        type: utils.MESSAGE_CLASSES.RED_FLAG,
      }
      );
      return;
    }
    socket.join(newUser.roomName);
    socket.emit(
      utils.MESSAGE_TYPES.NOTIFICATION, {
      text: `You have joined the Room : ${newUser.roomName}`,
      type: utils.MESSAGE_CLASSES.GREEN_FLAG,
    }
    );
    socket.broadcast.to(newUser.roomName).emit(
      utils.MESSAGE_TYPES.NOTIFICATION, {
      text: `${newUser.userName} has joined the Room.`,
      type: utils.MESSAGE_CLASSES.GREEN_FLAG,
    }
    );
  })

  // Message Functionality #TBD
  // socket.on("sendMsg", (message, callback) => {
  //   const currUser = getUser(socket.id);
  //   io.to(currUser.roomName).emit('msg', { userName: currUser.userName, text: message })
  //   callback();
  // })

  socket.on(utils.MOUSE_EVENTS.CLIENT_DOWN, (payload) => {

    console.log("c_mouse_down payload RCVD : ", payload)
    const currUser = getUser(socket.id);
    io.to(currUser.roomName).emit(utils.MOUSE_EVENTS.SERVER_DOWN, payload);
  })

  socket.on(utils.MOUSE_EVENTS.CLIENT_MOVE, (payload) => {

    console.log("c_mouse_move payload RCVD : ", payload)
    const currUser = getUser(socket.id);
    io.to(currUser.roomName).emit(utils.MOUSE_EVENTS.SERVER_MOVE, payload);
  })

  socket.on('disconnect', (reason) => {

    console.log(reason, '=> Disconnected : ', socket.id);
    const leavingUser = removeUser(socket.id);
    // showUsers();
    console.log("Leaving User : ", leavingUser);
    if (leavingUser) {
      socket.broadcast.to(leavingUser.roomName).emit(
        utils.MESSAGE_TYPES.NOTIFICATION, {
        text: `${leavingUser.userName} has Left the Room.`,
        type: utils.MESSAGE_CLASSES.RED_FLAG,
      }
      );
    }
  });
})

server.listen(PORT, () => {
  console.log("Listening on : http://localhost:" + PORT);
})