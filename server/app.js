require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");

const sequelize = require('./Dbconfig/database');
const userRouter = require("./Routes/userRouter");


app.use(cors());
app.use(express.json());

app.use(userRouter);

sequelize.sync()
.then((res)=>{
    app.listen(process.env.APP_PORT,()=>console.log('server is running...'))
})
.catch(err=>console.log(err));
