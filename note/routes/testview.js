// route 개념

var express = require('express');
var router = express.Router();

/* GET home page. localhost:3000 */

// localhost/testview가 생략
router.get('/', function(req, res, next) {
  res.render('index', { title: 'TestView', content: 'content TestView' });
});

module.exports = router;