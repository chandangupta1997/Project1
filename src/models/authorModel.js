
const mongoose = require('mongoose');


const authorSchema = new mongoose.Schema({
    fname: {
        type: String,
        trim: true,
        required: "first name is required"
    },
    lname: {
        type: String,
        trim: true,
        required: "last name is required"
    },
    title: {
        type: String,
        enum: ["Mr", "Mrs", "Miss"]
    },
    email: {
        type: String,
        validate:{
            validator: function(v) {
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
            },
            message: "Please enter a valid email"
        },
        unique: true
    },
    password: {
        type: String,
        required: "password is required"
    }
}, { timestamps: true });

module.exports = mongoose.model('author', authorSchema) 