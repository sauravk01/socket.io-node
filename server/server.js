//for creating socket.io admin-ui to identify the usecases
const { instrument } = require("@socket.io/admin-ui");
// creating server side socket.io points with cors
const io = require("socket.io")(3000, {
  cors: {
    origin: ["https://admin.socket.io", "http://localhost:8080"],
  },
});

// creating user namespace
const userIo = io.of("/user");
userIo.on("connection", (socket) => {
  // socket.username is available from below # comment
  console.log("connected to user namespace with username " + socket.username);
});

//#### using middleware in usernamespace to identifying whether token is available or not
userIo.use((socket, next) => {
  if (socket.handshake.auth.token) {
    socket.username = getUsernameFromToken(socket.handshake.auth.token);
    next();
  } else {
    //   sending error if no token found
    next(new Error("please send token"));
  }
});
function getUsernameFromToken(token) {
  return token;
}

// connecting with each socket with request for connection
io.on("connection", (socket) => {
  //each socket has unique id while connecting to socket.io
  console.log(socket.id);
  //sending message to individual or group
  //note: single socket user can also be act as the room
  socket.on("send-message", (message, room) => {
    if (room === "") {
      //   socket.emit allows you to emit custom events on the server and client.
      socket.broadcast.emit("receive-message", message);
    } else {
      //   socket.emit allows you to emit custom events on the server and client.
      socket.to(room).emit("receive-message", message);
    }
  });

  //   This event handler is called when the client receives an incoming socket notification that matches the specified event name (e.g. 'welcome'). This happens when the server broadcasts a message to this socket directly, or to a room of which it is a member. To broadcast a socket notification, you need to either use the blueprint API or write some server-side code
  socket.on("join-room", (room, cb) => {
    socket.join(room);
    cb(`joined ${room}`);
  });
});
//socket.io admin where every information are send from socket.io but auth in not required in this case
instrument(io, {
  auth: false,
});
