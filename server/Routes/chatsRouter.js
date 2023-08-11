const express = require('express');
const router=express.Router();

const {userVerification}=require('../middlewares/userAuth');
const {storeMessagesinDb,getAllMsgs}=require("../controllers/chatsController");

router.post('/sendMsg',userVerification,storeMessagesinDb);
router.get('/getAllMsgs',getAllMsgs);

module.exports=router;