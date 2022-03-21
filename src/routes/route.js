const express = require('express');
const router = express.Router();
const AuthorController= require("../controllers/authorController")
const BlogController= require("../controllers/blogController")
const {authorisation, authentication}= require("../middleware/mw")



router.post("/authors", AuthorController.createAuthor)


router.post("/blogs", authentication, BlogController.createBlog)

router.get("/blogs", authentication, BlogController.getAllBlogs)

router.put("/blogs/:blogId", authentication, authorisation, BlogController.updateBlog)

router.delete("/blogs/:blogId", authentication, authorisation, BlogController.deleted)

router.delete("/blogs", authentication, authorisation, BlogController.Qdeleted)

router.post("/login", AuthorController.login)



module.exports = router;