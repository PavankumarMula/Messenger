const { json } = require("sequelize");
const chatModel = require("../models/chatModel");
const userModel = require("../models/userModel");

// function for storing current user sent mesages in data base
exports.storeMessagesinDb = async (req, res) => {
  const { userId, message, userName } = req;

  try {
    await chatModel.create({
      message: message,
      userId: userId,
      userName: userName,
    });
    return res.status(200).json("message sent");
  } catch (error) {
    console.log(error);
    return res.status(401).json("message deleivery failed");
  }
};

// function for getting all the mesages
exports.getAllMsgs = async (req, res) => {
  try {
    const allMessages = await chatModel.findAll({limit:10});

    // sending onlu necessary details to the front end
    const allChats = allMessages.map((obj) => {
      const { id, message, userId, userName } = obj;

      return { id, message, userId, userName };
    });
    return res.status(200).json(allChats);
  } catch (error) {
    console.log(error);
    return res.status(401).json("internal server error");
  }
};
