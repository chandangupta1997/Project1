
const { count } = require("console")
const BlogModel = require("../models/blogModel")
const AuthorModel = require("../models/authorModel")


const isValid= function(value){
    if(typeof (value) === undefined || typeof (value) === null) {return false}
    if(typeof (value).trim().length==0) {return false}
    if(typeof (value) === "string" && (value).trim().length>0) {return true}
}


const createBlog = async function (req, res) {
    try {
        let data = req.body
        let id = req.body.authorId
        // checking if data is empty
        if (Object.keys(data) == 0)
            // returning 400 {bad request data is empty}
            return res.status(400).send({ status: false, msg: "Bad request. Content to post missing" })
        const {title , body , authorId, category}= data


        let idMatch = await AuthorModel.findById(id)
        // id match in author model, if not
        if (!idMatch)
            // returning error with 404 user input does not match
            return res.status(404).send({ status: false, msg: "No such author present in the database" })

        let savedData = await BlogModel.create(data)
        //creating entry in db with status 201 success!
        return res.status(201).send({ status: true, msg: savedData })
    }
    catch (error) {
        console.log(error)
        return res.status(500).send({ msg: error.message })
    }
}


const getAllBlogs = async function (req, res) {
    try {
        const data = req.query
        if (Object.keys(data) == 0) return res.status(400).send({ status: false, msg: "No input provided" })

        const blogs = await BlogModel.find({$and : [data, { isDeleted: false }, { isPublished: true }]}).populate("authorId")
        if (blogs.length == 0) return res.status(404).send({ status: false, msg: "No blogs Available." })
        return res.status(200).send({ status: true,count:blogs.length, data: blogs });
    }


    catch (error) {
        return res.status(500).send({ status: false, msg: error.message });
    }
}


const updateBlog = async function (req, res) {
    try {
        //Validate: The blogId is present in request path params or not.
        let blog_Id = req.params.blogId
        if (!blog_Id) return res.status(400).send({ status: false, msg: "Blog Id is required" })

        //Validate: The blogId is valid or not.
        let blog = await BlogModel.findById(blog_Id)
        if (!blog) return res.status(404).send({ status: false, msg: "Blog does not exists" })

        //Validate: If the blogId exists (must have isDeleted false)
        let is_Deleted = blog.isDeleted
        if (is_Deleted == true) return res.status(404).send({ status: false, msg: "Blog is already deleted" })

        //Updates a blog by changing the its title, body, adding tags, adding a subcategory.
        let Title = req.body.title
        let Body = req.body.body
        let Tags = req.body.tags
        let Subcategory = req.body.subcategory
        let updatedBlog = await BlogModel.findOneAndUpdate({ _id: blog_Id },
            {
                $set: {
                    title: Title, body: Body, isPublished: true, subcategory: Subcategory,
                    tags: Tags, publishedAt: new Date()
                }
            }, { new: true })
        //Sending the updated response
        return res.status(200).send({ status: true, data: updatedBlog })
    }
    catch (err) {
        console.log("This is the error :", err.message)
        return res.status(500).send({ status: false, msg: " Server Error", error: err.message })
    }
}



const deleted = async function (req, res) {
    try {
        //Validate: The blogId is present in request path params or not.
        let blog_Id = req.params.blogId
        if (!blog_Id) return res.status(400).send({ status: false, msg: "Blog Id is required" })

        //Validate: The blogId is valid or not.
        let blog = await BlogModel.findById(blog_Id)
        if (!blog) return res.status(404).send({ status: false, msg: "Blog does not exists" })

        //Validate: If the blogId is not deleted (must have isDeleted false)
        let is_Deleted = blog.isDeleted
        if (is_Deleted == true) return res.status(404).send({ status: false, msg: "Blog is already deleted" })

        //Delete a blog by changing the its isDeleted to true.
        let deletedBlog = await BlogModel.findOneAndUpdate({ _id: blog_Id },
            { $set: { isDeleted: true, deletedAt: new Date() } }, { new: true })
        //Sending the Deleted response after updating isDeleted : true
        return res.status(200).send({ status: true, data: deletedBlog })
    }
    catch (err) {
        console.log("This is the error :", err.message)
        return res.status(500).send({ status: false, msg: " Server Error", error: err.message })
    }
}

const Qdeleted = async function (req, res) {
    try {
        const data = req.query
        if (Object.keys(data) == 0) return res.status(400).send({ status: false, msg: "No input provided" })
        const deleteBYquery = await BlogModel.updateMany({ $and : [data , {isPublished : false} ]}, { isDeleted: true, deletedAt: new Date() }, { new: true })
        if (!deleteBYquery) return res.status(404).send({ status: false, msg: "no such blog found" })
        return res.status(200).send({ status: true, msg: deleteBYquery })
    }


    catch (error) {
        return res.status(500).send({ status: false, msg: error.message });
    }
};








module.exports.createBlog = createBlog
module.exports.updateBlog = updateBlog
module.exports.deleted = deleted
module.exports.getAllBlogs = getAllBlogs
module.exports.Qdeleted = Qdeleted