let users = [];

function addUser({ socketId, userName, roomName }) {
  // Tranform userName and roomName into one word.
  // Manav Verma => manavverma


  userName = userName.trim().toLowerCase();
  roomName = roomName.trim().toLowerCase();
  console.log("INCOMING : ", socketId, userName, roomName);

  const existingUser = users.find((user) => user.roomName === roomName && user.userName === userName);

  // if (!userName || !roomName) return { error: 'Username and roomName are required.' };
  if (existingUser) {
    return { error: 'Username is taken.' };
  }
  const newUser = { socketId, userName, roomName };
  console.log("newUser", newUser);
  users.push(newUser);
  // console.log("Users :", users)
  return { newUser };
}

const removeUser = (socketId) => {
  const index = users.findIndex((user) => user.socketId === socketId);

  if (index !== -1) return users.splice(index, 1)[0];
}

const getUser = (socketId) => users.find((user) => user.socketId === socketId);

const getUsersInRoom = (roomName) => users.filter((user) => user.roomName === roomName);

module.exports = { addUser, removeUser, getUser, getUsersInRoom };
