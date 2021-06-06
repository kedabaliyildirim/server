const express = require('express');
const router = express.Router();
const {
    post,
    comment
} = require('../models/postSchema.js')

const User = require('../models/userSchema')
const cors = require('cors');
const socketApi = require('../helpers/socket')
const localUrl = 'http://localhost:8080'
const url = 'https://vue-test-47cc0.web.app'
const corsUrl = 'https://stormy-mountain-28848.herokuapp.com'
const netifyUrl = 'https://stoic-turing-035110.netlify.app'
router.use(cors({
    credentials: true,
    origin: {
        url,
        localUrl,
        corsUrl,
        netifyUrl
    }
}))
const getIo = ( postId, comment) => {
    const message = {
        postId: postId,
        body: {
            username: comment.userName,
            message: comment.comment,
            _id: comment._id
        }
    }
    socketApi.io.emit('updatePost', message)
}
router.post('/getcomments', (req, res) => {
    const {
        postId
    } = req.body
    if (postId !== 'undefined') {
        if (postId !== null) {
            post.findOne({
                _id: postId
            }, (err, data) => {
                res.send(data.child)
            })
        } else res.send('body_error')
    } else res.send('body_error')
})
router.post('/', (req, res) => {
    const {
        Comment,
        postId
    } = req.body
    if (Comment) {
        const userId = req.session.user_id
        User.findOne({
            _id: userId
        }, (err, usr) => {
            if (usr) {
                const comentPost = new comment({
                    userName: usr.userName,
                    comment: Comment
                })
                comentPost.save().then(() => {
                    post.findOneAndUpdate({
                        _id: postId
                    }, {
                        $addToSet: {
                            child: comentPost
                        }
                    }).then(() => {
                        getIo(postId, comentPost)
                        res.send('success')
                    })
                })
            } else res.send('error')
        })
    } else res.send('error')
})
router.post('/deletecomment', (req, res) => {
    const {
        commentId,
        postId
    } = req.body
    comment.findByIdAndDelete({
        _id: commentId
    }).then(() => {
        post.findByIdAndUpdate({
            _id: postId
        }, {
            $pull: {
                child: {
                    _id: commentId
                }
            }
        }).then(() => {
            res.send('success')
        }).catch((err) => {
            res.send(err)
        })
    })
})
router.get('/test', (req,res) => {
    const {postId} = req.body
    post.findOne({_id: postId}, (err,data) => {
        res.send(data)
    })
})

module.exports = router