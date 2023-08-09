const userModel = require("../models/userModel");
const sequelize = require("../Dbconfig/database");
const bcrypt = require("bcrypt");

// function for adding new user into database
exports.signupUser = async (req, res) => {
  const t = await sequelize.transaction();
  const { name, mail, password, phone } = req.body;
  try {
    // chech mail alredy exists or not
    const getAllMails = await userModel.findAll({
      attributes: ["email"],
    });
    const isMailPresent = getAllMails.some(
      (userMail) => userMail.email === mail
    );

    if (isMailPresent) {
      t.rollback();
      return res.status(200).json("mail already exists");
    } else {
      //bcrypt the password before commiting into db
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password,salt);
     // create a row in user table
      await userModel.create(
        {
          name: name,
          email: mail,
          password: hashedPassword,
          phone: phone,
        },
        { transaction: t }
      );
    }
    t.commit();
    return res.status(200).json("user Added Sucessfully");
  } catch (error) {
    t.rollback();
    return res.status(500).json("internal error");
  }
};
