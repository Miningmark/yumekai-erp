const { createServer } = require("http");
const { Server } = require("socket.io");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

nextApp.prepare().then(() => {
  const server = createServer((req, res) => {
    handle(req, res);
  });

  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("newTask", (data) => {
      console.log("newTask:", data);
      socket.broadcast.emit("loadNewTasks", "new");
    });

    socket.on("newColumn", (data) => {
      console.log("newColumn:", data);
      socket.broadcast.emit("loadNewColumns", "new");
    });
  });

  const PORT = process.env.PORT || 3000;

  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`Server is listening on port ${PORT}`);
  });
});
