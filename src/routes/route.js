const express = require('express');
const router = express.Router();
const authorController = require("../controllers/authorController")
const blogController = require("../controllers/blogController")
const midwareController=require("../controllers/midwareController")
router.get("/test-me", function (req, res) {
    res.send("My first ever api!")
})

// Phase - 1

// create author
router.post("/createAuthor", authorController.createAuthor)

//  create blog
router.post("/createBlog", blogController.createBlog)

//  delete blog by query
router.delete("/deleteBlogByQuery",midwareController.Authorisation, blogController.deleteBlogByQuery)

// delete blog by path params
router.delete("/deleteblog/:blogId",midwareController.Authorisation, blogController.deleteBlogByPath)

//  update blog
//router.put("/updateBlog/:blogId" , blogController.updateBlog)
router.put("/updateBlog/:blogId",midwareController.Authorisation,blogController.updateBlog)



//  get blog
router.get("/getBlogs" , blogController.getBlogs)


// login
router.post("/authorLogin",midwareController.loginAuthor)



// authentication

//router.post("/authentication",midwareController.Authentication)


module.exports = router;