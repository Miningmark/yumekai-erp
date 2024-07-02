const { createServer } = require("http");
const { Server } = require("socket.io");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const handler = nextApp.getRequestHandler();

nextApp.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer);

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

    socket.on("newBug", (data) => {
      console.log("newBug:", data);
      socket.broadcast.emit("loadNewBug", "new");
    });
  });

  const PORT = process.env.PORT || 3000;

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
});
