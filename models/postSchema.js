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
    statisticData: {
        type: Number,
        required:false,
    },
    creationDate:{
        type: Date,
        required:false
    },
    child: [commentSchema]

}, {
    timestamps: true,
    typePojoToMixed: false
})
try {
    postSchema.pre('save', function(next) {
        if(!this.isModified('creationDate')) {
            return next()
        }
        let newDate =  new Date();
        let dd = String(newDate.getDate()).padStart(2,'0');
        let mm = String(newDate.getMonth() + 1).padStart(2, '0');
        let yyyy = newDate.getFullYear();
    
        this.creationDate = dd + '/' + mm + '/' + yyyy;
        next();
    })
} catch (error) {
    console.log(err);
}
const comment = mongoose.model('comment', commentSchema)
const post = mongoose.model('post', postSchema)
module.exports = {
    post,
    comment,
    postSchema
}