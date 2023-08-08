const express= require('express');

const dotenv=require('dotenv').config();

const app = express();

app.use(express.json());

app.listen(process.env.APP_PORT,()=>{
    console.log('server is running...')
})