const userModel = require("../models/userModel");
const groupModel = require("../models/groupModel");
const messageModel = require("../models/chatModel");
const groupUserModel = require("../models/groupUserModel");
const sequelize = require("../Dbconfig/database");

//controller for sending all the users
exports.getAllUsers = async (req, res) => {
  // start the transaction
  const transaction = await sequelize.transaction();
  try {
    const allusers = await userModel.findAll({ attributes: ["id", "name"] });
    return res.status(200).json(allusers);
  } catch (error) {
    console.log(error);
    return res.status(401).json("internal server occured");
  }
};

// controller for creating a group
exports.createGroup = async (req, res) => {
  const transaction =await sequelize.transaction();
  const { groupName, selected, name } = req.body;
  // creating the group
  try {
    const group = await groupModel.create({
      groupName: groupName,
      createdBy: name,
    },{transaction});

    await transaction.commit(); 

    // find the Admin user
    const adminUser = await userModel.findOne({ where: { name: name } });
    // check whether user exist or not
    if (!adminUser) {
      return res.status(404).json("user not Found");
    }

    //  Associate the admin user with the group and set isAdmin to true
    await group.addUsers(adminUser, { through: { isAdmin: true } });

    // Extract user IDs from participants and find user objects
    const participantIds = selected.map((participant) => participant.value);
    const participantUsers = await userModel.findAll({
      where: {
        id: participantIds,
      },
    });

    //Associate participant users with the group
    await group.addUsers(participantUsers);

    console.log("Group created successfully:", group);
    return res.json({ success: true, group });
  } catch (error) {
    console.error("Error creating the group:", error);
    return res.json({ success: false, error });
  }
};

// function for sending the all the group names to the frontend
exports.groupNames = async (req, res) => {
  const userId = req.userId;
  try {
    // finding the all the groups
    const groups = await groupModel.findAll({
      include: [
        {
          model: userModel,
          where: {
            id: userId,
          },
        },
      ],
    });

    // destructuring the groups array by removing the timestamps
    const groupDetails = groups.map((group) => {
      return {
        groupId: group.groupId,
        groupName: group.groupName,
        admin: group.createdBy,
      };
    });

    // sending the group details to the front end
    return res.status(200).json(groupDetails);
  } catch (error) {
    console.log(error);
    return res.status(401).json("Internal Server");
  }
};

// function to get respective group data and its members
exports.groupChatPage = async (req, res) => {
  const groupId = req.params.id;

  try {
    const groupUsers = await groupModel.findByPk(groupId, {
      attributes: ["groupId", "createdBy", "groupName"],
      include: [
        {
          model: userModel,
          attributes: ["id", "name"],
          through: {
            attributes: ["isAdmin"],
          },
        },
      ],
    });
    if (!groupUsers) {
      return res.status(401).json("no users for this group");
    }

    return res.status(200).json(groupUsers);
  } catch (error) {
    console.log(error);
    return res.status(401).json("error occured during fetching group users");
  }
};


// controller for posting text in group
exports.postMsgInGroup = async (req, res) => {
  const transaction = await sequelize.transaction()
  try {
    const { input: userMessage, groupId } = req.body;
    const userId = req.userId;

    // Find the user
    const user = await userModel.findByPk(userId);

    // Get the associated group with the user (many-to-many relationship)
    const groups = await user.getGroups({ where: { groupId: groupId } });

    // Check whether user is in the group
    if (!groups.length) {
      return res.status(401).json("User is not in the group");
    }

    // Create the message in the chatModel
    const storeMsg = await messageModel.create({
      message: userMessage,
      groupGroupId: groupId,
      userId: userId,
      userName: user.name,
    },{transaction});
    
    await transaction.commit();

    const { id, message, userName } = storeMsg;
    
   

    return res.status(200).json({ id, userName, message });
  } catch (error) {
    console.error(error);
    return res.status(500).json("Error occurred while sending the message");
  }
};

// fetching the group realed messsages

exports.fetchGroupChats = async (req, res) => {
  const groupId = req.params.id;
  try {
    const chats = await messageModel.findAll({
      where: { groupGroupId: groupId },
      attributes: ["userName", "message", "id"],
    });

    // if there are no chats return
    if (!chats.length) {
      return res.status(404).json("there are no chats");
    }

    res.status(200).json(chats);
  } catch (error) {
    console.log(error);
    return res.status(401).json("internal error occured");
  }
};

// adding new User in group
// adding new User in group
exports.addUser = async (req, res) => {
  const groupId = req.params.id;

  try {
    // Find out whether the group exists or not
    const findGroup = await groupModel.findByPk(groupId);

    if (!findGroup) {
      return res.status(404).json({ error: "Group not found" });
    }

    // Find the users to be added to the group
    const requestedUsers = await Promise.all(
      req.body.selectedUsers.map(async (user) => {
        const foundUser = await userModel.findByPk(user.value);
        return foundUser;
      })
    );

    if (!requestedUsers || requestedUsers.length === 0) {
      return res.status(400).json({ error: "No users provided to add" });
    }

    // Add the users to the group
    await findGroup.addUsers(requestedUsers);

    return res.json({ message: "Users added to the group successfully" });
  } catch (error) {
    console.error("Error adding users to group:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};



// function control for removing user
exports.removeUser=async(req,res)=>{
  const groupId = req.params.id;

  try {
    // Find out whether the group exists or not
    const findGroup = await groupModel.findByPk(groupId);

    if (!findGroup) {
      return res.status(404).json({ error: "Group not found" });
    }

    // Find the users to be removed from  the group
    const requestedUsers = await Promise.all(
      req.body.selectedUsers.map(async (user) => {
        const foundUser = await userModel.findByPk(user.value);
        return foundUser;
      })
    );

    if (!requestedUsers || requestedUsers.length === 0) {
      return res.status(400).json({ error: "No users provided to add" });
    }

    // remove the users to the group
    await findGroup.removeUsers(requestedUsers);

    return res.json({ message: "Users removed from the group successfully" });
  } catch (error) {
    console.error("Error adding users to group:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
