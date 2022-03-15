const jwt = require("jsonwebtoken");
const authorModel=require("../models/authorModel")



const loginAuthor = async function (req, res) {




    try{
    let email = req.body.email;
    let password = req.body.password;
  
    let user = await authorModel.findOne({ email: email, password: password });
    if (!user) res.status(404).send({msg: "username or passowrd is incorrect or author not found"})





    let token = jwt.sign(
        {
          userId: user._id.toString(),  //payload
          batch: "thorium",
          organisation: "FUnctionUp",
        },
        "Chandan-Key"); //signature


    res.setHeader("x-auth-key",token)

    res.send({ status: true, data: token });


    }


    catch(error){
        res.status(500).send(error.message)
    }








    













}



module.exports.loginAuthor=loginAuthor
  




