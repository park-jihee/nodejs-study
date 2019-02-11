var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('users'); // 해당 url에는 users.ejs를 보여줘라
});

module.exports = router;
