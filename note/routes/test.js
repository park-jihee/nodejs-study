// route 개념
var express = require('express');
var router = express.Router();

// GET 
router.get('/', function(req, res, next) {
    var name = req.query.name;  //query = ?name=name //send = /name/number
    var number = req.query.number;
    res.render('test', {name: name, number: number}); //render
});

// POST
router.post('/', function(req, res, next) {
    var name = req.body.name; 
    var number = req.body.number;
    res.render('test', {name: name, number: number}); //render
});


module.exports = router;