const express = require("express");
const router = express.Router();
const  {userVerification}  =require('../middlewares/userAuth')

const {
  getAllUsers,
  createGroup,
  groupNames,
  groupChatPage,
  postMsgInGroup,
  fetchGroupChats,
  addUser,
  removeUser
} = require("../controllers/groupController");

// router for getting all the users
router.get("/allusers", getAllUsers);

// router for creating the group and group members
router.post("/creategroup", createGroup);

// router for sending all the groupnames
router.get("/groupnames",userVerification, groupNames);

// router for sending the group Info like members and Admin
router.get('/groupPage/:id',groupChatPage);

// router for posting message in groups
router.post('/sendmsgingroup',userVerification,postMsgInGroup);

//router for fetching the all the group related texts
router.get('/getGroupChats/:id',fetchGroupChats);

//router for adding new User
router.post('/adduser/:id',addUser);

//router for removing the user
router.post("/removeuser/:id",removeUser);

module.exports = router;
