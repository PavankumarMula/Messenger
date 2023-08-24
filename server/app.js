require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const sequelize = require("./Dbconfig/database");
app.use(cors({ origin: "*" }));

const io = require("socket.io")(8000, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("A user connected");

  // Listen for the "newMessage" event from the client
  socket.on("newMessage", ({ id, userName, message }) => {
    console.log("Well received message is ", { id, userName, message });
    
      // Emit the message to the client
      socket.broadcast.emit("messageReceived", { id, userName, message });
           
    
  });

  // ... other event listeners ...
});

//importing the routes
const userRouter = require("./Routes/userRouter");
const chatRouter = require("./Routes/chatsRouter");
const groupRouter = require("./Routes/groupRouter");

// importing the models
const userModel = require("./models/userModel");
const chatModel = require("./models/chatModel");
const groupModel = require("./models/groupModel");
const groupUser = require("./models/groupUserModel");

app.use(express.json());

app.use(userRouter);
app.use(chatRouter);
app.use(groupRouter);

// Associations
userModel.hasMany(chatModel);
chatModel.belongsTo(userModel);

groupModel.hasMany(chatModel);
chatModel.belongsTo(groupModel);

groupModel.belongsToMany(userModel, { through: "groupUser" });
userModel.belongsToMany(groupModel, { through: "groupUser" });

// syncking the db up to date
sequelize
  .sync()
  .then((res) => {
    app.listen(process.env.APP_PORT, () => console.log("server is running..."));
  })
  .catch((err) => console.log(err));

//SOCKET
io.on("connection", (socket) => {
  console.log("SOCKET CONNECTED", socket.id);
});
