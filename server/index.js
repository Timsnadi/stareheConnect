const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  }
});

app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json());

// ── Existing routes ──────────────────────────────────────────────
app.use('/api/auth',          require('./routes/auth'));
app.use('/api/users',         require('./routes/users'));
app.use('/api/conversations', require('./routes/conversations'));
app.use('/api/messages',      require('./routes/messages'));

// ── New routes ───────────────────────────────────────────────────
app.use('/api/feed',          require('./routes/feed'));
app.use('/api/events',        require('./routes/events'));
app.use('/api/jobs',          require('./routes/jobs'));
app.use('/api/resources',     require('./routes/resources'));
app.use('/api/community',     require('./routes/community'));

// MongoDB Connection
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/stareheConnect';

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    console.log('Retrying in 5 seconds...');
    setTimeout(connectDB, 5000);
  }
};

connectDB();

// Socket.io Logic
const onlineUsers = new Map();

io.on('connection', (socket) => {
  socket.on('join', ({ userId }) => {
    socket.userId = userId;
    socket.join(userId);
    onlineUsers.set(userId, socket.id);
    console.log(`User ${userId} connected`);
    io.emit('online_users', Array.from(onlineUsers.keys()));
    io.emit('user_online', userId);
  });

  socket.on('send_message', (data) => {
    io.to(data.receiverId).emit('receive_message', data);
  });

  // Broadcast new feed posts to all connected clients
  socket.on('new_post', (post) => {
    socket.broadcast.emit('feed_post', post);
  });

  socket.on('typing', (data) => {
    socket.broadcast.emit('typing', data);
  });

  socket.on('stop_typing', (data) => {
    socket.broadcast.emit('stop_typing', data);
  });

  socket.on('disconnect', () => {
    if (socket.userId) {
      onlineUsers.delete(socket.userId);
      io.emit('user_offline', socket.userId);
      io.emit('online_users', Array.from(onlineUsers.keys()));
      console.log(`User ${socket.userId} disconnected`);
    }
  });
});

app.get('/', (req, res) => {
  res.send('StareheConnect Backend API is running');
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
