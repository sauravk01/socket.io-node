import { io } from "socket.io-client";

const joinRoomButton = document.getElementById("room-button");
const messageInput = document.getElementById("message-input");
const roomInput = document.getElementById("room-input");
const form = document.getElementById("form");

const socket = io("http://localhost:3000");
const userSocket = io("http://localhost:3000/user", {
  auth: { token: "Test" },
});
//if error found in response
userSocket.on("connect_error", (error) => {
  displayMessage(error);
});
// if new socket userid connected it displays the message
socket.on("connect", () => {
  displayMessage(`You connected with Id:${socket.id}`);
});
// displays the recieve message from server side socket.io
socket.on("receive-message", (message) => {
  displayMessage(message);
});

form.addEventListener("submit", (e) => {
  // sending data to backend and reendering the components
  e.preventDefault();
  const message = messageInput.value;
  const room = roomInput.value;
  if (message === "") return;
  //displaying on send user screen
  displayMessage(message);
  //   socket.emit allows you to emit custom events on the server and client.
  socket.emit("send-message", message, room);

  messageInput.value = "";
});

//joining the room or creating the room and sending the data to it
joinRoomButton.addEventListener("click", () => {
  const room = roomInput.value;
  //   socket.emit allows you to emit custom events on the server and client.
  socket.emit("join-room", room, (message) => {
    displayMessage(message);
  });
});
// function for displaying the message in screen
function displayMessage(message) {
  const div = document.createElement("div");
  div.textContent = message;
  document.getElementById("message-container").append(div);
}
