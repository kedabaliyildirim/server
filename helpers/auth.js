const session = require('express-session')
// const dataBase = require('../helpers/db.js')
const reqLogIn = async (req, res, next) => {
    const something = await req.session.user_id
    if (!something) {
        res.send('error')
    } else next()
}
module.exports = reqLogIn