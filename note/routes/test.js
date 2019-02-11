var express = require('express');
var router = express.Router();

// GET
router.get('/', function(req, res, next) {
  var name = req.query.name;
  var number = req.query.number;
  res.render('test', {name: name, number, number});
});

//POST
router.post('/', function(req, res, next) {
    var name = req.body.name;
    var number = req.body.number;
    res.render('test', {name: name, number, number});
  });

module.exports = router;
