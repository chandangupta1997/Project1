const blogModel = require("../models/blogModel")
const authorModel = require("../models/authorModel")

const createBlog = async function (req, res) {
    try {
        const data = req.body
        const id = req.body.authorId

        if (!Object.keys(data).length > 0) return res.send({ error: "Please enter data" })

        const findAuthor = await authorModel.find({ _id: id })

        if (!findAuthor.length > 0) return res.status(400).send("error : Please enter valid authorId")

        const createdBlog = await blogModel.create(data)
        res.status(201).send({ Blog: createdBlog })
    }
    catch (err) {
        console.log(err)
        res.status(500).send({ msg: err.message })
    }
}

/*const getBlogs=async function(req,res){


    try{
        

    
    let liveBlogs= await blogModel.find({isDeleted:false},{isPublsihed:true}).populate("authorID")

    res.status(200).send({"data":liveBlogs})

    if(!liveBlogs) res.status(404).send("no blogs are found ")

    


    }


    catch(error){
        res.status(500).send({msg:error.msg})
    }





}
*/




const getBlogs = async function( req , res ) {
    try{
        const data = req.query
        if(!data)  return res.status(400).send({error : "please enter data in query "})


    


        const blogs = await blogModel.find(data, { isDeleted : false } , {isPublished : true} ).populate("authorId")

        if( !blogs )   return res.status(404).send({error : "no data found"})

        res.status(200).send({data : blogs})
    }
    catch (error) {
        console.log(error)
        res.status(500).send({ msg: error.message })
    }
}


//Filter blogs list by applying filters. Query param can have any combination of below filters
/*const getBlogsByFilter=async function(req,res){

    const data =req.query

    let filter1 =req.query.author_id   // By author Id
    let filter2 =req.query.category // category
    let filter3 =req.query.tags  // list of blog with specific tag 
    let filter4 =req.query.subcategory //list of blog with specific sub category 


    if(!req.query) res.send("enter data in query param ")


    let filteredBlog= await blogModel.find($in[{filter1},{filter2},{filter3},{filter4}])

    //let filteredBlog= await blogModel.find(data,{filter1},{filter2},{filter3},{filter4})

    if(!filteredBlog) res.status(404).send("there is no such blog ")




}*/

const updateBlog=async function(req,res){

    try{

    let data=req.body  //(Assuming tag and subcategory received in body is need to be added)
    if(!data)res.send("enter data to update ")
    let id =req.params.blogId //we need blog id to update a partiular 
    if(!id)res.send("blogId must be present in request param ")

    let xyz= await blogModel.findById(id) 


    if(req.user!=xyz.auhtorId){return res.status(401).send("you are not authorized ")}




     // we used updateMany because we need to update many 
    let updatedBlog=await blogModel.findOneAndUpdate({_id:id},{$set:data},{new:true})

    if(!updatedBlog) res.status(404).send({msg:"we are not  able to update it "})

    res.status(200).send({msg:updatedBlog})
    }


    catch(error){


        res.status(500).send(error.message)

    }
}




const deleteBlogByPath = async function (req, res) {
    try {
        let blogId = req.params.blogId;

        if (!blogId) return res.status(400).send({ error: "blogId should be present in params" });
        let blog = await blogModel.findById(blogId);

        if (!blog) {
            return res.status(404).send("No such blog exists");
        }
        let deletedBlog = await blogModel.findOneAndUpdate({ _id: blogId }, { isDeleted: true }, { new: true });
        res.send({ status: "Deleted", data: deletedBlog });

    }
    catch (err) {
        console.log(err)
        res.status(500).send({ msg: err.message })
    }
}





const deleteBlogByQuery = async function (req, res) {
    try {
        let authorIds = req.query.authorId
        let categorys = req.query.category
        let tag = req.query.tags
        let subcategorys = req.query.subcategory
        if (!authorIds && !categorys && !tag && !subcategorys) {
          res.status(400).send({ status: false, msg: "quarys is required, BAD REQUEST" })
        }
        let authorDetails = await authorModel.findById({ _id: authorIds })
        if (!authorDetails) {
          res.status(404).send({ status: false, msg: "authorId not exist" })
        } else {
          let updatedDetails = await blogModel.findOneAndUpdate({$or: [ { authodId: authorIds },{ category: categorys }, { tags: { $in: [tag] } }, { subcategory: { $in: [subcategorys]}}]},{ isDeleted: true})
          res.status(201).send({mag:"blog deleted "})
          req.body.isDeletedAt = new Date()
          console.log(updatedDetails)
        }  
    }
    catch (err) {
        console.log(err)
        res.status(500).send({ msg: err.message })
    }
}



module.exports.createBlog = createBlog
module.exports.deleteBlogByQuery = deleteBlogByQuery
module.exports.deleteBlogByPath = deleteBlogByPath
module.exports.updateBlog = updateBlog
module.exports.getBlogs = getBlogs
//module.exports.getBlogsbyfilter=getBlogsByFilter