require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");

const sequelize = require("./Dbconfig/database");

//importing the routes
const userRouter = require("./Routes/userRouter");
const chatRouter = require("./Routes/chatsRouter");
const groupRouter = require("./Routes/groupRouter");

// importing the models
const userModel = require("./models/userModel");
const chatModel = require("./models/chatModel");
const groupModel= require("./models/groupModel");
const groupUser =require("./models/groupUserModel");

app.use(cors());
app.use(express.json());

app.use(userRouter);
app.use(chatRouter);
app.use(groupRouter);

// Associations
userModel.hasMany(chatModel);
chatModel.belongsTo(userModel);

groupModel.hasMany(chatModel);
chatModel.belongsTo(groupModel);

groupModel.belongsToMany(userModel,{ through: 'groupUser' });
userModel.belongsToMany(groupModel,{through:'groupUser'});


// syncking the db up to date
sequelize
  .sync()
  .then((res) => {
    app.listen(process.env.APP_PORT, () => console.log("server is running..."));
  })
  .catch((err) => console.log(err));
