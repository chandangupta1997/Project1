const mongoose = require('mongoose');
const objId = mongoose.Schema.Types.ObjectId

const blogModel = new mongoose.Schema({
    title: {
        type: String,
        required: "title is required"
    },
    body: {
        type: mongoose.Schema.Types.Mixed,
        required: "body is required"
    },
    authorId: {
        type: objId,
        required: "author id is required",
        ref: "blogProject_author"
    },
    tags: { type: [String] },
    category: {
        type: [String],
        required: "category is required"
    },
    subcategory: { type: [String] },
    deletedAt: { type: Date },
    isDeleted: { type: Boolean, default: false },
    publishedAt: { type: Date },
    isPublished: { type: Boolean, default: false }
}, { timestamps: true });


module.exports = mongoose.model('blog', blogModel) // blogs