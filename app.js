const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const documentRoutes = require('./routes/documentRoutes');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/collabEditor', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Routes
app.use('/document', documentRoutes);

// Socket.IO for real-time collaboration
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('join-document', (docId) => {
    socket.join(docId);
    console.log(`User joined document: ${docId}`);
  });

  socket.on('send-changes', (data) => {
    socket.broadcast.to(data.docId).emit('receive-changes', data.delta);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

module.exports = server;