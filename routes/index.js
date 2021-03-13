<<<<<<< HEAD
var express = require('express');
var router = express.Router();
=======
const express = require('express');
const router = express.Router();
>>>>>>> 6d8f3883f7fd22b867455ad95651ae70141c7a38

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Express'
  });
});

module.exports = router;