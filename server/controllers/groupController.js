const userModel = require("../models/userModel");
const groupModel = require("../models/groupModel");
const groupUserModel = require("../models/groupUserModel");

//controller for sending all the users
exports.getAllUsers = async (req, res) => {
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
  const { groupName, selected, name } = req.body;
  // creating the group
  try {
    const group = await groupModel.create({
      groupName: groupName,
      createdBy: name,
    });

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
