let users = [];

function addUser(socketId, userName, roomName) {
  const newUser = {
    socketId: socketId,
    userName: userName,
    roomName: roomName
  }
  users.push(newUser);
  return newUser;
}

function removeUser(userId) {
  users.filter(user => user.userId !== userId)
}

module.exports = { addUser, removeUser };
