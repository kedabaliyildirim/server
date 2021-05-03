const mongoose = require('mongoose')
const commentSchema = mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    comment: {
        type: String,
        required: true
    }
})
const postSchema = mongoose.Schema({
    user: {
        userName: {
            type: String,
            required: true
        }
    },
    body: {
        title: {
            type: String,
            required: true,
            maxlength: 200
        },
        message: {
            type: String,
            required: true,
            maxlength: 1200
        }
    },
    child: [commentSchema]

}, {
    timestamps: true,
    typePojoToMixed: false
})
const comment = mongoose.model('comment', commentSchema)
const post = mongoose.model('post', postSchema)
module.exports = {
    post,
    comment,
    postSchema
}