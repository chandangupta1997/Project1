const jwt = require("jsonwebtoken");
const blogsModel = require("../models/blogsModel");

// ### AUTHENTICATE:

const authenticate = function (req, res, next) {
  try {
    let token = req.headers["x-api-key"];
    if (!token)
      return res
        .status(401)
        .send({ status: false, msg: "token must be present" });
    // this verify the token that token is correct or not
    let decodedToken = jwt.verify(token, "secret-key");
    if (!decodedToken)
      return res.status(400).send({ status: false, msg: "token is invalid" });
    // req.user =  decodedToken.authorId

    next();
  } catch (err) {
    res.status(500).send({ status: false, Error: err });
  }
};

// ### AUTHORISE:

// ### AUTHORISING BLOG_ID:

const authorise = async function (req, res, next) {
  try {
    // comapre the logged in user's id and the id in request
    let token = req.headers["x-api-key"];
    let blogId = req.params.blogId;
    let blogDetails = await blogsModel.findById(blogId);
    let authorId = blogDetails.authorId;
    let decodedToken = jwt.verify(token, "secret-key");
    if (!decodedToken)
      return res.status(400).send({ status: false, msg: "token is invalid" });
    let decoded = decodedToken.userId;
    if (authorId != decoded)
      res.status(400).send({ status: false, msg: "anthentication denied" });
    next();
  } catch (err) {
    res.status(500).send({ status: false, Error: err });
  }
};

// ### AUTHORISING AUTHOR_ID:

const verifyAuthorId = async function (req, res, next) {
  try {
    let token = req.headers["x-api-key"];
    let authodid = req.query.authorId;
    let decodedToken = jwt.verify(token, "secret-key");
    if (!decodedToken)
      return res.status(400).send({ status: false, msg: "token is invalid" });
    let decoded = decodedToken.userId;
    if (authodid != decoded)
      res.status(400).send({ status: false, msg: "anthentication denied" });
    next();
  } catch (err) {
    res.status(500).send({ status: false, Error: err });
  }
};

module.exports.authenticate = authenticate;
module.exports.authorise = authorise;
module.exports.verifyAuthorId = verifyAuthorId;
