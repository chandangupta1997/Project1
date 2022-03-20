const blogsModel = require("../models/blogsModel");
const authorModel = require("../models/authorModel");

const { author } = require("./authorController");

// (2) ### POST /blogs

const blogs = async function (req, res) {
  try {
    let data = req.body;
    let authorId = data.authorId;
    const author_details = await authorModel.findById(authorId);
    if (!author_details) {
      res.status(400).send("Invalid");
    }
    req.body.isPublished = true;
    if (Object.keys(data).length != 0) {
      let savedData = await blogsModel.create(data);
      res.status(201).send({ msg: savedData });
    } else {
      res.status(400).send({ msg: "BAD REQUEST" });
    }
  } catch (err) {
    res.status(500).send({ status: false, Error: err });
  }
};

// (3)  ### GET /blogs

const getBlog = async function (req, res) {
  try {
    const a_id = req.query.authorId;
    const authorDetails = await authorModel.findById({ _id: a_id });
    if (!authorDetails) res.status(400).send({ msg: "author not found" });
    const c_details = req.query.category;
    const tags = req.query.tags;
    const subtag = req.query.subcategory;
    let blogCount = await blogsModel
      .find({ isDeleted: false, isPublished: true })
      .count();
    let findBlog = await blogsModel.find({
      isDeleted: false,
      isPublished: true,
      $or: [
        { authorId: a_id },
        { category: c_details },
        { tags: tags },
        { subcategory: subtag },
      ],
    });
    if (!findBlog) res.status(404).send({ status: false, msg: "not found" });
    res
      .status(200)
      .send({ status: true, count_blog: blogCount, msg: findBlog });
  } catch (err) {
    res.status(500).send({ status: false, Error: err });
  }
};

// (4) ### PUT/blogs/:blogId

const updateBlog = async function (req, res) {
  try {
    let id = req.params.blogId;
    let data = req.body;
    const updateData = await blogsModel.findById(id);
    if (updateData.isDeleted == true) {
      res.status(404).send({ status: false, msg: err.message });
    }
    data.publishedAt = new Date();
    data.isPublished = true;
    const dataMore = await blogsModel.findByIdAndUpdate(id, data, {
      new: true,
    });
    res.status(200).send({ status: true, msg: dataMore });
  } catch (err) {
    res.status(500).send({ status: false, msg: err.msg });
  }
};

// (5) ### DELETE /blogs/:blogId

const deleteBlog = async function (req, res) {
  try {
    let blogId = req.params.blogId;
    if (!blogId) {
      res
        .status(400)
        .send({ status: false, msg: "blogId is required, BAD REQUEST" });
    }
    let blogDetails = await blogsModel.findOne(
      { _id: blogId },
      { isDeleted: false }
    );
    if (!blogDetails) {
      res.status(404).send({ status: false, msg: "blog not exist" });
    } else {
      let blogDetails = await blogsModel.updateOne(
        { _id: blogId },
        { $set: { isDeleted: true, deletedAt: Date(), isPublished: false } }
      );
      res.status(200).send({ msg: "delected blog" });
      console.log(blogDetails);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ msg: error.message });
  }
};

// (6) ### ### DELETE /blogs?queryParams

const deleteByQueryParam = async function (req, res) {
  try {
    let authorIds = req.query.authorId;
    let categorys = req.query.category;
    let tag = req.query.tags;
    let subcategorys = req.query.subcategory;
    if (!authorIds && !categorys && !tag && !subcategorys) {
      res
        .status(400)
        .send({ status: false, msg: "quarys is required, BAD REQUEST" });
    }
    let authorDetails = await authorModel.findById({ _id: authorIds });
    if (!authorDetails) {
      res.status(404).send({ status: false, msg: "authorId not exist" });
    } else {
      let updatedDetails = await blogsModel.findOneAndUpdate(
        {
          $or: [
            { authodId: authorIds },
            { category: categorys },
            { tags: { $in: [tag] } },
            { subcategory: { $in: [subcategorys] } },
          ],
        },
        { isDeleted: true, deletedAt: Date() }
      );
      res.status(200).send({ msg: "blog deleted " });
      console.log(updatedDetails);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ msg: error.message });
  }
};

module.exports.blogs = blogs;
module.exports.getBlog = getBlog;
module.exports.updateBlog = updateBlog;
module.exports.deleteBlog = deleteBlog;
module.exports.deleteByQueryParam = deleteByQueryParam;
