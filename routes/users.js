const express = require('express');
const router = express.Router();
const User = require('../models/userSchema.js')
const bcrypt = require('bcrypt')
const cors = require('cors');
const reqLogIn = require('../helpers/auth.js') 
// const localUrl = 'http://localhost:8080'
const url = 'https://vue-test-47cc0.web.app'
router.use(cors({
  credentials: true,
  origin: {
    url,
    // localUrl
  }
}))
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
          }).then(() => console.log('deleted a user')).catch(err => console.log(`this is register err ${err}`))
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
  const currUser = await find
  await bcrypt.compare(password, currUser.password).then(async (data) => {
    if (data) {
      console.log(`this is login data ${data}`);
      await req.session.save(() => {
        req.session.isLogged = true
        req.session.user_id = currUser._id
        console.log(`Setted req.session id to ${req.session.user_id}`);
        res.send(currUser._id)
      })
    } else (
      await req.session.save(() => {
        req.session.isLogged = false
      }) 
      )
    }).catch((err) => {
    res.send('error')
    console.log(`this is login err : ${err}`);
  })
})
router.post('/logout', (req, res) => {
  console.log(`this is logout`);
  console.log(`this is logout reqss: ${req.session.user_id}`);
  req.session.user_id = null
  res.send('success')
})
router.post('/checkauth', async (req, res) => {
  await req.session.reload(() => {
    console.log(`this ise req.session of checkAuth : ${req.session}`);
    if (req.session.isLogged) {
      res.send('success')
    } else {
      res.send('error')
    }
})
})
module.exports = router;