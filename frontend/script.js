var socket = io();

$(function () {

  socket.on('connect', function () {

    console.log("client side connected!");

    socket.emit("joinRoom", { userName: userName, roomName: room });

    socket.on('sendData', function (data) {
      let myId = data.id;
      console.log("myId : ", myId);
    })
  });



  // socket.on('connect', function () {
  //   // Connected, let's sign-up for to receive messages for this room
  //   socket.emit('room', 'dash');
  // });

  // socket.on('message', function (data) {
  //   console.log('Incoming message:', data);
  // });


})