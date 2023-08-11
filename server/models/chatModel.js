const Sequelize=require('sequelize');

const database=require('../Dbconfig/database');

const chats=database.define('chats',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    message:{
        type:Sequelize.STRING,
        allowNull:false,
    },
    userName:{
        type:Sequelize.STRING,
        allowNull:false
    }
})
module.exports=chats;