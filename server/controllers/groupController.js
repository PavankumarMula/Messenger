const userModel = require("../models/userModel");
const groupModel = require("../models/groupModel");
const messageModel = require("../models/chatModel");
const groupUserModel = require("../models/groupUserModel");
const { json } = require("sequelize");
const sequelize = require("../Dbconfig/database");


//controller for sending all the users
exports.getAllUsers = async (req, res) => {
  const t = await sequelize.transaction(); // Start a transaction

  try {
    const allusers = await userModel.findAll({ attributes: ["id", "name"], transaction: t });
    
    await t.commit(); // Commit the transaction
    return res.status(200).json(allusers);
  } catch (error) {
    console.log(error);
    await t.rollback(); // Rollback the transaction in case of an error
    return res.status(401).json("Internal server error");
  }
};




// controller for creating a group
exports.createGroup = async (req, res) => {
  const { groupName, selected, name } = req.body;
  const t = await sequelize.transaction(); // Start a transaction

  try {
    const group = await groupModel.create({
      groupName: groupName,
      createdBy: name,
    }, { transaction: t });

    const adminUser = await userModel.findOne({ where: { name: name }, transaction: t });
    if (!adminUser) {
      await t.rollback(); // Rollback the transaction if the admin user is not found
      return res.status(404).json("User not found");
    }

    await group.addUsers(adminUser, { through: { isAdmin: true }, transaction: t });

    const participantIds = selected.map((participant) => participant.value);
    const participantUsers = await userModel.findAll({
      where: {
        id: {
          [Op.in]: participantIds,
        },
      },
      transaction: t,
    });

    await group.addUsers(participantUsers, { transaction: t });

    await t.commit(); // Commit the transaction
    console.log("Group created successfully:", group);
    return res.json({ success: true, group });
  } catch (error) {
    console.error("Error creating the group:", error);
    await t.rollback(); // Rollback the transaction in case of an error
    return res.json({ success: false, error });
  }
};


 

// function for sending the all the group names to the frontend
exports.groupNames = async (req, res) => {
  const userId = req.userId;
  const t = await sequelize.transaction(); // Start a transaction

  try {
    const groups = await groupModel.findAll({
      include: [
        {
          model: userModel,
          where: {
            id: userId,
          },
        },
      ],
      transaction: t,
    });

    const groupDetails = groups.map((group) => {
      return {
        groupId: group.groupId,
        groupName: group.groupName,
        admin: group.createdBy,
      };
    });

    await t.commit(); // Commit the transaction
    return res.status(200).json(groupDetails);
  } catch (error) {
    console.log(error);
    await t.rollback(); // Rollback the transaction in case of an error
    return res.status(401).json("Internal Server");
  }
};

// function to get the respective group chat
exports.groupChatPage = async (req, res) => {
  const groupId = req.params.id;
  const t = await sequelize.transaction(); // Start a transaction

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
      transaction: t,
    });

    await t.commit(); // Commit the transaction
    if (!groupUsers) {
      return res.status(401).json("no users for this group");
    }

    return res.status(200).json(groupUsers);
  } catch (error) {
    console.log(error);
    await t.rollback(); // Rollback the transaction in case of an error
    return res.status(401).json("error occurred during fetching group users");
  }
};




// controller for posting text in group
exports.postMsgInGroup = async (req, res) => {
  const t = await sequelize.transaction(); // Start a transaction

  try {
    const { input: userMessage, groupId } = req.body;
    const userId = req.userId;

    // Find the user
    const user = await userModel.findByPk(userId, { transaction: t });

    // Get the associated group with the user (many-to-many relationship)
    const groups = await user.getGroups({ where: { groupId: groupId }, transaction: t });

    // Check whether user is in the group
    if (!groups.length) {
      await t.rollback(); // Rollback the transaction
      return res.status(401).json("User is not in the group");
    }

    // Create the message in the chatModel
    const storeMsg = await messageModel.create({
      message: userMessage,
      groupGroupId: groupId,
      userId: userId,
      userName: user.name,
    }, { transaction: t });

    await t.commit(); // Commit the transaction

    const { id, message, userName } = storeMsg;

    return res.status(200).json({ id, userName, message });
  } catch (error) {
    console.error(error);
    await t.rollback(); // Rollback the transaction in case of an error
    return res.status(500).json("Error occurred while sending the message");
  }
};





// fetching the group related messages
exports.fetchGroupChats = async (req, res) => {
  const groupId = req.params.id;
  const t = await sequelize.transaction(); // Start a transaction

  try {
    const chats = await messageModel.findAll({
      where: { groupGroupId: groupId },
      attributes: ["userName", "message", "id"],
      transaction: t, // Include the transaction option
    });

    // Commit the transaction
    await t.commit();

    // if there are no chats return
    if (!chats.length) {
      return res.status(404).json("there are no chats");
    }

    res.status(200).json(chats);
  } catch (error) {
    console.log(error);
    await t.rollback(); // Rollback the transaction in case of an error
    return res.status(401).json("internal error occurred");
  }
};



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
