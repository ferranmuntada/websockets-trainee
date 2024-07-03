const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

const users = {};

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('register', (username) => {
    users[username] = socket.id;
    socket.username = username;
    console.log(`${username} registered with id ${socket.id}`);
  });

  socket.on('private message', ({recipient, message}) => {
    const recipientSocketId = users[recipient];
    if (recipientSocketId) {
      io.to(recipientSocketId).emit('private message', {
        sender: socket.username,
        message,
      });
    }
  });

  socket.on('disconnect', () => {
    delete users[socket.username];
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
