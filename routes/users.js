const User = require('../models/userSchema.js')
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt')
const {
  log
} = require('debug');
const router = express.Router();
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Express'
  });
});
router.use(cors())
router.post('/register', async (req, res) => {

  const {
    userName,
    password,
    email,
    userAge,
    chat,
    type
  } = req.body
  if (type === 'test') {
    const user = new User({
      userName,
      password,
      email,
      userAge,
      chat
    })
    let forceCheck = 0
    await user.save().then((data) => {
      req.session.user_id = user._id
      console.log(`this is user ID : ${user._id}`);
      res.send(data)
    }).catch((err) => {
      console.log(`this is an error ${err}`);
      res.send(err)
      forceCheck = 1
    }).then(() => {
      setTimeout(() => {
        if (forceCheck === 0) {

          User.findOneAndDelete({
            userName: userName
          }).then(() => console.log('deleted a user')).catch(err => console.log(err))
        } else {
          return
        }
      }, 6000);
    })
  } else {
    const user = new User({
      userName,
      password,
      email,
      userAge,
      chat
    })
    await user.save().then(() => {
      req.session.user_id = user._id
      console.log(`this is user ID : ${user._id}`);
      res.send(user._id)
    }).catch((err) => {
      console.log(`this is an error ${err}`);
      res.send('error')
    })
  }
});
router.post('/login', async (req, res) => {
  console.log('at login');
  const {
    userName,
    password,
  } = req.body
  const find = await User.findOne({
    userName
  })
  currUser = await find
  await bcrypt.compare(password, currUser.password).then((data) => {
    if (data) {
      req.session.user_id = currUser._id
      res.send(currUser._id)
    } else(
      res.send('error')
    )
  }).catch((err) => {
    console.log(err);
  })
})
router.post('/logout', (req, res) => {
  req.session.user_id = null
  res.redirect('/login')
})
module.exports = router;