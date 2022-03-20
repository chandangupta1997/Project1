const express = require("express");
const router = express.Router();
const authorController = require("../controllers/authorController");
const blogsController = require("../controllers/blogsController");
const middleWere = require("../middleWare/auth");

// PHASE 1:

// AUTHOR APIS
router.post("/createAuthor", authorController.author); // create author

// ### POST /blogs:
router.post("/createBlogs", middleWere.authenticate, blogsController.blogs); // create blog

// ### GET /blogs:
router.get("/getBlogs", middleWere.authenticate, blogsController.getBlog); // find blog by quary in authorid,catagory,subcatagory and tags

// ### PUT /blogs/:blogId:
router.put(
  "/blogs/:blogId",
  middleWere.authenticate,
  middleWere.authorise,
  blogsController.updateBlog
); // update blog by params by giving element in body

// ### DELETE /blogs/:blogId:
router.delete(
  "/blogs/:blogId",
  middleWere.authenticate,
  middleWere.authorise,
  blogsController.deleteBlog
); // delete blog by using blogid in params

// ### DELETE /blogs?queryParams:
router.delete(
  "/blogs",
  middleWere.authenticate,
  middleWere.verifyAuthorId,
  blogsController.deleteByQueryParam
); // delete blog by using quary

// PHASE (2):

// ### POST(/LOGIN):
router.post("/login", authorController.loginAuthor); // using post api to login

module.exports = router;
