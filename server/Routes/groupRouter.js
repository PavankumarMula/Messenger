const express=require('express');
const router=express.Router();

const {getAllUsers,createGroup}=require('../controllers/groupController');

router.get('/allusers',getAllUsers);
router.post('/creategroup',createGroup)



module.exports=router;