const jwt = require("jsonwebtoken")
const BlogModel = require("../models/blogModel")

const authentication = async function (req, res, next) {
    try {
        let token = req.headers["x-api-key"];
        if (!token) return res.status(400).send({ status: false, msg: "login is required" })
        let decodedtoken = jwt.verify(token, "Secret-Key")
        if (!decodedtoken) return res.status(401).send({ status: false, msg: "token is invalid" })
        next();
    }
    catch (error) {
        console.log(error)
        return res.status(500).send({ msg: error.message })
    }
}

const authorisation = async function (req, res, next) {
    try {
        let token = req.headers["x-api-key"];
        let decodedtoken = jwt.verify(token, "Secret-Key")

        let toBeupdatedblogId = req.params.blogId
        if (toBeupdatedblogId) {
            let updatingAuthorId = await BlogModel.find({ _id: toBeupdatedblogId }).select({ authorId: 1, _id: 0 })
            let authorId = updatingAuthorId.map(x => x.authorId)
            console.log(authorId)
            let id = decodedtoken.userId
            if (id != authorId) return res.status(403).send({ status: false, msg: "You are not authorised to perform this task" })
        }
        else {
            let AuthorId = req.query.authorId
            toBeupdatedblogId = AuthorId
            let id = decodedtoken.userId
            if (id != AuthorId) return res.status(403).send({ status: false, msg: "You are not authorised to perform this task" })
        }
        next()
    }
    catch (error) {
        console.log(error)
        return res.status(500).send({ msg: error.message })
    }
}


module.exports.authorisation = authorisation
module.exports.authentication = authentication