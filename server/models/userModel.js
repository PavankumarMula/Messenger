const Sequelize=require('sequelize');

const DB = require("../Dbconfig/database");

const User = DB.define('users',{
    id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
    },

    name:{
        type:Sequelize.STRING,
        allowNull:false
    },

    email:{
        type:Sequelize.STRING,
        allowNull:false
    },
    
    password:{
        type:Sequelize.STRING,
        allowNull:false
    }, 
    phone:{
        type:Sequelize.INTEGER,
        allowNull:false
    }
})

module.exports=User;