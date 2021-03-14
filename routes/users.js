const User = require('../models/userSchema.js')
const express = require('express');
const router = express.Router();
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Express'
  });
});
router.post('/register', async (req, res) => {
  const {
    userName,
    password,
    email,
    userAge,
    chat
  } = req.body
  const user = new User({
    userName,
    password,
    email,
    userAge,
    chat
  })
  await user.save().then(() => {
    req.session.user_id = user._id
    res.send('succes')
  }).catch((err) => {
    console.log(`this is an error ${err}`);
    res.send(err)
  })
});
router.post('/login', async (req, res) => {
  console.log('at login');
  const {
    userName,
    password,
  } = req.body
  const userAuth = await User.authUser(userName, password)
  if (userAuth) {
    req.session.user_id = userAuth._id
  } else(
    res.send({
      status: -1
    })
  )
})
router.post('/logout', (req, res) => {
  req.session.user_id = null
  res.redirect('/login')
})
module.exports = router;