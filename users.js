let users = [];

let roomParticipantMap = {};

function addUser({ socketId, userName, roomName }) {
  // Tranform userName and roomName into one word., e.g. :Manav Verma => manavverma

  userName = userName.trim().toLowerCase();
  roomName = roomName.trim().toLowerCase();
  console.log("INCOMING : ", socketId, userName, roomName);

  const existingUser = users.find((user) => user.roomName === roomName && user.userName === userName);

  // if (!userName || !roomName) return { error: 'Username and roomName are required.' };
  if (existingUser) {
    // Emit Error Message when Username is occupied
    return { error: 'Username is taken.' };
  }
  const newUser = { socketId, userName, roomName };
  console.log("newUser", newUser);
  users.push(newUser);
  addRoom(roomName);
  return { newUser };
}

const removeUser = (socketId) => {
  const index = users.findIndex((user) => user.socketId === socketId);

  if (index !== -1) {
    const { roomName } = users[index];
    removeRoom((roomName))
    return users.splice(index, 1)[0];
  }
}

const getUser = (socketId) => users.find((user) => user.socketId === socketId);

const getUsersInRoom = (roomName) => users.filter((user) => user.roomName === roomName);

const showUsers = () => {
  console.log("All Users : ")
  users.map((user) => {
    console.log(user);
    return user;
  });
}

const getRooms = () => Object.keys(roomParticipantMap);

const addRoom = (roomName) => {
  if (roomParticipantMap[roomName]) {
    roomParticipantMap[roomName] += 1;
  } else {
    roomParticipantMap[roomName] = 1;
  }
};

const removeRoom = (roomName) => {
  if (roomParticipantMap[roomName]) {
    if (roomParticipantMap[roomName] > 1) {
      roomParticipantMap[roomName] -= 1;
    } else {
      delete roomParticipantMap[roomName];
    }
  }
};

module.exports = {
  addUser, removeUser, getUser, getUsersInRoom, showUsers, getRooms,
};
