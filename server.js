const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  console.log("New client connected");

  // generating unique name for room
  const roomName = "room_" + socket.id;

  // join room
  socket.join(roomName);

  // emit a message to the user with the room name
  socket.emit("room_created", roomName);

  // listen for "join_room" events
  socket.on("join_room", (requestedRoom) => {
    // check if room exists
    if (io.sockets.adapter.room.has(requestedRoom)) {
      socket.join(requestedRoom);
      socket.emit("joined_room", requestedRoom);
    } else {
      socket.emit("room_not_found", requestedRoom);
    }
  });
});

server.listen(4000, () => console.log("Listening on port 4000"));
