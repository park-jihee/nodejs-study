var express = require('express');
var router = express.Router();

/* GET home page. */
// localhost:3000/ 생략
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' , content: 'router express'});
});

// localhost:3000/router
router.get('/router', function(req, res, next) {
  res.render('index', { title: 'Router' , content: 'router Router'});
});

module.exports = router;
