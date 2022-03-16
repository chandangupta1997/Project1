const jwt = require("jsonwebtoken");
const authorModel=require("../models/authorModel")



const loginAuthor = async function (req, res,next) {
try{
    let email = req.body.email;
    let password = req.body.password;
  
    let author = await authorModel.findOne({ email: email, password: password });
    if (!author) res.status(404).send({msg: "username or passowrd is incorrect or author not found"})





    let token = jwt.sign(
        {
          authorid: author._id.toString(),  //payload
          batch: "thorium",
          organisation: "FUnctionUp",
        },
        "Chandan-Key"); //signature


    res.setHeader("x-auth-key",token)

    res.send({ status: true, data: token });

    next()


    }


    catch(error){
        res.status(500).send(error.message)
    }


}




const Authentication= async  function(req,res){


    try{

    let token = req.header["x-auth-key"]
    if (!token) token = req.headers["x-Auth-Token"];
    if(!token) res.send("sorry we are unable to recognize you  please login again ")



    let decodedToken= jwt.verify(token,"Chandan-Key")

    if(!decodedToken) 
  
    return res.send({ status: false, msg: "token is invalid" });

    console.log(decodedToken)


    }

    catch(error)
    {res.status(500).send(error.message)}

}



    










module.exports.loginAuthor=loginAuthor
module.exports.Authentication=Authentication





  




