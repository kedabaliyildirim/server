const mongoose = require('mongoose')
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
            required:true
        },
        message: {
            type: String,
            required: true,
            maxlength: 300
        }
    }
})
const post = mongoose.model('post', postSchema)
module.exports = {
    post,
    postSchema
}