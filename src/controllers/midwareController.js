const jwt = require("jsonwebtoken");
const authorModel = require("../models/authorModel");
const blogModel = require("../models/blogModel");

const loginAuthor = async function (req, res, next) {
  try {
    let email = req.body.email;
    let password = req.body.password;

    let author = await authorModel.findOne({
      email: email,
      password: password,
    });
    if (!author)
      res
        .status(404)
        .send({ msg: "username or passowrd is incorrect or author not found" });

    let token = jwt.sign(
      {
        authorid: author._id.toString(), //payload
        batch: "thorium",
        organisation: "FUnctionUp",
      },
      "Chandan-Key"
    ); //signature

    res.setHeader("x-auth-key", token);

    res.send({ status: true, data: token });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const Authentication = async function (req, res, next) {
  try {
    let token = req.headers["x-auth-key"];
    //if (!token) token = req.headers["x-Auth-Key"];
    if (!token) res.status(400).send("token must be present ");

    let decodedToken = jwt.verify(token, "Chandan-Key");

    if (!decodedToken) {
      return res.status(400).send({ status: false, msg: "token is invalid" });
    }
    console.log(decodedToken);

    req.user = decodedToken.authorid; 





    next();
  } catch (error) {
    res.status(500).send(error.message);
  }
};

/*const Authorisation = async function (req, res, next) {
  try {
    let token = req.headers["x-auth-key"];
    if (!token) token = req.headers["x-Auth-Key"];
    if (!token) res.status(400).send("token must be present ");

    let decodedToken = jwt.verify(token, "Chandan-Key");

    if (!decodedToken)
      return res.send({ status: false, msg: "token is invalid" });
    console.log(decodedToken);

    let blogId = req.params.blogId;
    let blogDetails = await blogModel.find({ _id: blogId }); //find by id//use find one
    if (!blogDetails) return res.send("check param no such blog ");
    let authorDetails = blogDetails.authorId;
    if (!authorDetails) res.send("no author for this blog ");

    if (!authorDetails == decodedToken.author_id)
      res
        .status(400)
        .send({ msg: " sorry you are not auhtorised to do that " });

    next();
  } catch (error) {
    res.status(500).send(error.message);
  }
};*/


const authorisation = async function (req, res, next) {
  try {
      let token = req.headers["x-api-key"];
      let decodedtoken = jwt.verify(token, "secuiretyKeyToCheckToken")

      let blogId = req.params.blogId
      if (!blogId) blogId = req.query._id

      if (blogId) {
          let authorId = await blogModel.find({ _id: blogId }).select({ authorId: 1, _id: 0 })
          authorId = authorId.map(x => x.authorId)

          if (decodedtoken.authorId != authorId) return res.status(403).send({ status: false, msg: "You haven't right to perform this task" })
      }

      else {
          let authorId = req.query.authorId
          if ( !authorId )  return res.status(400).send({error : "Please, enter authorId or blogId"})
          if (decodedtoken.authorId != authorId) return res.status(403).send({ status: false, msg: "You haven't right to perform this task" })
      }
      next()
  }
  catch (error) {
      console.log(error)
      res.status(500).send({ msg: error.message })
  }
}

module.exports.loginAuthor = loginAuthor;
module.exports.Authentication = Authentication;
module.exports.Authorisation = Authorisation;
module.exports.authorisation=authorisation
