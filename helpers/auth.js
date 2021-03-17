const session = require('express-session')
// const dataBase = require('../helpers/db.js')
const reqLogIn = (req, res, next) => {

    const something = dataBase.find()
    console.log(`this is something ${something}`);
    // console.log('gekgoekpogskpogkspogkposekgposekgpo');
}
module.exports = reqLogIn