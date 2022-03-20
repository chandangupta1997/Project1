const authorModel = require("../models/authorModel");
const jwt = require("jsonwebtoken");

// (1) ### Author APIs /authors:

const author = async function (req, res) {
  try {
    let data = req.body;
    if (Object.keys(data).length != 0) {
      let savedData = await authorModel.create(data);
      res.status(201).send({ msg: savedData });
    } else {
      res.status(400).send({ msg: "BAD REQUEST" });
    }
  } catch (err) {
    res.status(500).send({ status: false, Error: err });
  }
};

// PHASE(2):

// GENERATING TOKEN FOR THE EMAILID AND PASSWORD:

// (7) ### POST(/LOGIN):

const loginAuthor = async function (req, res) {
  try {
    let userName = req.body.email;
    let password = req.body.password;

    let user = await authorModel.findOne({
      email: userName,
      password: password,
    });
    if (!user)
      return res.status(400).send({
        status: false,
        msg: " EmailId or the password is not corerct ",
      });
    let token = jwt.sign(
      {
        userId: user._id.toString(),
      },
      "secret-key"
    );
    res.setHeader("x-api-key", token);
    res.status(200).send({ status: true, data: token });
  } catch (err) {
    res.status(500).send({ status: false, Error: err });
  }
};

module.exports.author = author;
module.exports.loginAuthor = loginAuthor;
