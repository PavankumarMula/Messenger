const userModel = require("../models/userModel");
const sequelize = require("../Dbconfig/database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
      const hashedPassword = await bcrypt.hash(password, salt);
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

// function for generating a jwt token upon user login sucess
const generateJwt = (id, name) => {
  return jwt.sign(
    { userId: id, userName: name },
    process.env.LOGIN_PASSWORD_TOKENKEY
  );
};

// function for LOGIN
exports.loginUser = async (req, res) => {
  const { mail, password } = req.body;
  console.log(mail);
  try {
    // check if mail is present or not
    const allMails = await userModel.findAll({ attributes: ["email"] });
    const isMailPresent = allMails.some((user) => user.email === mail);
    if (isMailPresent) {
      // get user by mail
      const user = await userModel.findOne({ where: { email: mail } });

      // compare incoming password and decrypted password from db
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (isPasswordValid) {
        // if password is valid generate jwt token
        const token = generateJwt(user.id, user.name);
        return res
          .status(200)
          .json({ message: "you logged in", name: user.name, token });
      } else {
        return res.status(200).json("password is incorrect");
      }
    } else {
      return res.status(200).json("mail does not exist");
    }
  } catch (error) {
    return res.status(500).json("internal error occured");
  }
};
