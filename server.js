const express = require('express')
const socket = require('socket.io')
const http = require('http')

// // specifying heroku's env.PORT
const PORT = process.env.PORT || 4848;

const app = express();

const server = http.createServer(app);

const io = socket(server);

const { addUser, removeUser } = require('./users');

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
})

let room = "";


io.on('connection', (socket) => {
  console.log("User Connected : ", socket.id);


  socket.on("joinRoom", function (data) {
    console.log("in Room : ", data.roomName);


    let Newuser = addUser(socket.id, data.userName, data.roomName)
    // io.to(Newuser.roomname).emit('send data', { userName: Newuser.userName, roomname: Newuser.roomname, id: socket.id })
    // io.to(socket.id).emit('send data', { id: socket.id, userName: Newuser.userName, roomname: Newuser.roomname });

    // Only send to sender
    socket.emit('sendData', { id: socket.id, userName: Newuser.userName, roomname: Newuser.roomname });
    thisRoom = Newuser.roomname;
    console.log("Newuser : ", Newuser);
    socket.join(Newuser.roomname);

  })

  // socket.on('room', function (room) {
  //   console.log("Room req : ", room)
  //   socket.join(room);

  //   io.to('dash').emit('message', 'what is going on, party people?');

  //   // this message will NOT go to the client defined above
  //   io.to('foobar').emit('message', 'anyone in this room yet?');

  // });

  // socket.on('disconnect', (reason) => {
  //   console.log('user disconnected : ', reason);
  // });
})


// const getApiAndEmit = socket => {
//   const response = new Date();
//   // Emitting a new message. Will be consumed by the client
//   socket.emit("FromAPI", response);
// };


server.listen(PORT, () => {
  console.log("Listening on : http://localhost:" + PORT);
})
