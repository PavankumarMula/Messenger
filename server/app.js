require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");

const sequelize = require('./Dbconfig/database');

//importing the routes
const userRouter = require("./Routes/userRouter");
const chatRouter=require("./Routes/chatsRouter");

// importing the models
const userModel=require('./models/userModel');
const chatModel=require('./models/chatModel');


app.use(cors());
app.use(express.json());

app.use(userRouter);
app.use(chatRouter);

// Associations
userModel.hasMany(chatModel);
chatModel.belongsTo(userModel);

// syncking the db up to date
sequelize.sync()
.then((res)=>{
    app.listen(process.env.APP_PORT,()=>console.log('server is running...'))
})
.catch(err=>console.log(err));
