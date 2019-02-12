// route 개념

var express = require('express');
var router = express.Router();

/* GET home page. localhost:3000 */
router.get('/', function(req, res, next) {
  console.log(JSON.stringify(req.session));
  
  if( req.session.passport !== undefined ){
    if( req.session.passport.user !== undefined ){
      //로그인 한 사용자
      res.render('index', { title: 'MyBoard' , content: 'park-jihee Board' , session: req.session.passport});
    } else {
      //로그아웃 한 사용자
      res.render('index', { title: 'MyBoard' , content: 'park-jihee Board' , session:{}});
    }
  } else {
    //처음 방문한 사용자
    res.render('index', { title: 'MyBoard' , content: 'park-jihee Board' , session:{}});
  }
});

router.get('/apple', function(req, res, next) {
  res.render('index', { title: 'Apple' , content: 'content apple' });
});

router.get('/apple/orange', function(req, res, next) {
  res.render('index', { title: 'orange' , content: 'content orange' });
});

module.exports = router;
