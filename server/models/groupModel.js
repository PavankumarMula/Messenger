const Sequelize=require('sequelize')
const database=require('../Dbconfig/database');

const groupModel=database.define('group',{
    groupId:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        allowNull:false,
        autoIncrement:true
    },

    groupName:{
        type:Sequelize.STRING,
        allowNull:false
    },

    createdBy:{
        type:Sequelize.STRING,
        allowNull:false
    }
})

module.exports=groupModel;