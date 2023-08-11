const chatModel = require("../models/chatModel");

// function for storing current user sent mesages in data base
exports.storeMessagesinDb = async (req, res) => {
  const { userId, message, userName } = req;
  try {
    await chatModel.create({
      message: message,
      userId: userId,
    });
    return res.status(200).json("message sent");
  } catch (error) {
    console.log(error);
    return res.status(401).json("message deleivery failed");
  }
};


// function for getting all the mesages 
exports.getAllMsgs = async (req,res)=>{
    try {
        const allMessages =await chatModel.findAll();
        console.log(allMessages);
        return;
    } 
    
    catch (error) {
      console.log(error);
    }
}