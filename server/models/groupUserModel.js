const Sequelize = require("sequelize");
const database = require("../Dbconfig/database");


const groupUser = database.define("groupUser", {
    groupUser_id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  isAdmin: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
});

module.exports=groupUser;
