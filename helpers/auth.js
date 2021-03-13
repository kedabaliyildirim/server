const session = require('express-session')

const reqLogIn = (req, res, next) => {
    console.log('AT reqLogIn');
    if (!req.session.user_id) {
        return res.redirect('/login')
    }
    next()
}
module.exports = reqLogIn