require("dotenv").config();

const express = require("express");
const app = express();
const path = require("path");
const http = require("http");
const cors = require("cors");

const socketio = require("socket.io");
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: "*", // Allow all origins for simplicity; adjust as needed for production
    methods: ["GET", "POST"],
  },
});

app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));

app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

io.on("connection", function (socket) {
  socket.on("send-location", function (data) {
    io.emit("receive-location", { id: socket.id, ...data });
  });
  socket.on("disconnect", function () {
    io.emit("user-disconnect", socket.id);
  });
});

app.get('/', (req, res) => {
  res.render('index', { port: process.env.PORT || 3000 });
});

app.get('/privacy', (req, res) => {
  res.render('privacy', { port: process.env.PORT || 3000 });
});

app.get('/opt-out', (req, res) => {
  res.render('opt-out');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`WebSocket server is running on ws://localhost:${PORT}/`);
});

module.exports = app;
