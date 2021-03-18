const session = require('express-session')
// const dataBase = require('../helpers/db.js')
const reqLogIn = (req, res, next) => {
    if (!req.session.user_id) {
        res.send('error')
    } else next()
}
module.exports = reqLogIn