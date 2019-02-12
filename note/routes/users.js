var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var crypto = require("crypto");
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var KakaoStrategy = require('passport-kakao').Strategy;

//DATABASE SETTING
var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '1234',
    database: 'note'
});

connection.connect();

passport.serializeUser(function (user, done){
    done(null, user);
});

passport.deserializeUser(function (user, done){
    console.log(user)
    done(null, done);
});

passport.use(new LocalStrategy({
    usernameField: 'id',
    passwordField: 'password',
    session: true,
    passReqToCallback: true
  }, function (req, id, password, name, done) {
    connection.query('select * from `user` where `id` = ?', id, function (err, result) {
      if (err) {
        console.log('err :' + err);
        return done(false, null);
      } else {
        if (result.length === 0) {
          console.log('해당 유저가 없습니다');
          return done(false, null);
        } else {
          var hashpass = crypto.createHash("sha512").update(password).digest("hex");
          if (hashpass != result[0].password) {
            console.log('패스워드가 일치하지 않습니다');
            return done(false, null);
          } else {
            console.log('로그인 성공');
            return done(null, {
              id: result[0].id,
              name: result[0].name,
              no: result[0].no
            });
          }
        }
      }
    })
  }));

router.get('/', function(req, res) {
    var sql = "select * from user;";
    var query = connection.query(sql, function(err, rows){

        if(err) { throw err; }

        if(req.session.passport !== undefined){
            if(req.session.passport.user !== undefined){
                
                // 로그인 한 사용자
                res.render( 'users', {
                    title: "MyBoard",
                    session: req.session.passport,
                    users: rows
                });

            } else {
                res.redirect('/');
            }
        } else {
            res.redirect('/');
        }
    });
});

router.get('/signup', function(req, res, next){
    if (req.session.passport !== undefined) {
        if (req.session.passport.user !== undefined) {
          //로그인 한 사용자
          res.redirect('/');
        } else {
          res.render('signup', {
            title: 'MyBoard',
            session: {}
          });
        }
    } else {
        res.render('signup', {
          title: 'MyBoard',
          session: {}
        });
    }
});

router.post('/signup', function(req, res) {
    var id = req.body.id;
    var password = req.body.password;
    var hashpass = crypto.createHash("sha512").update(password).digest("hex");
    var name = req.body.name;
    var email = req.body.email;
    var address = req.body.address;
    var datas = [id, hashpass, name, email, address]

    var sql = "insert into user (id, password, name, email, address) values (?, ?, ?, ?, ?)";
    var query = connection.query(sql, datas, function(err, rows){
        if(err) { throw err; }
        console.log("DATA INSERTED!");
        res.redirect('/');
    });
});

//login

router.get('/login', function(req, res, next){
    if (req.session.passport !== undefined) {
        if (req.session.passport.user !== undefined) {
          //로그인 한 사용자
          res.redirect('/');
        } else {
          res.render('login', {
            title: 'MyBoard',
            session: {} // 로그인을 하지 않았으므로 빈 객체를 보낸다
          });
        }
    } else {
      res.render('login', {
        title: 'MyBoard',
        session: {}
      });
    }
});

router.post('/login', passport.authenticate ('local',{
        failureRedirect: '/users/login',
        failureFlash: true
    }), // 인증실패시 401 리턴, {} -> 인증 스트레티지
    function (req, res){
      res.redirect('/');
    }
);

// logout

router.get('/logout', function (req, res) {
  if (req.session.passport !== undefined) {
    if (req.session.passport.user !== undefined) {
      //로그인 한 사용자
      req.logout();
      res.redirect('/');
    } else {
      //로그아웃 사용자
      res.redirect('/');
    }
  } else {
    res.redirect('/');
  }
});  

// kakao login

router.get('/kakao', passport.authenticate('kakao-login'));

router.get('/oauth/kakao/callback', passport.authenticate('kakao-login', {
    successRedirect: '/',
    failureRedirect: '/users/login'
  })
);

passport.use('kakao-login', new KakaoStrategy({
  clientID: '227f17ad122c326b8537731d19e7a2ae',
  clientSecret: 'zv7qnPLNncaB4leQyYGJeHZmOXJ6ie7r',
  callbackURL: 'http://localhost:3000/users/oauth/kakao/callback'
  },

  function (accessToken, refreshToken, profile, done){
    console.log('kakao login info');
    console.log('kakao login profile');
    return done(null, {
      id: 'kakao',
      name: profile.username,
      no: profile.id
    });
  }
));

module.exports = router;

/*
postman 연결

var users = [
    {id: 1, name: '사람1'},
    {id: 2, name: '사람2'},
    {id: 3, name: '사람3'},
    {id: 4, name: '사람4'},
    {id: 5, name: '사람5'},
    {id: 6, name: '사람6'}
]

router.get('/', (req, res) => res.json(users));
router.get('/:id', function(req, res) {
    var id = parseInt(req.params.id, 10);

    if(!id){
        return res.status(400).json({error:'Incorrect id'});
    }

    var user = users.filter(user => user.id === id[0]);

    if(!user){
        return res.status(404).json({error: 'Unknown user'});
    }
    
    return res.json(users);

});

router.delete('/:id', function(req, res) {
    var id = parseInt(req.params.id, 10);

    if(!id){
        return res.status(400).json({error:'Incorrect id'});
    }
    
    var userIdx = users.findIndex(user => user.id === id);

    if(userIdx === -1){
        return res.status(404).json({error: 'Unknown user'});
    }

    users.splice(userIdx, 1);

    return res.json(users);
});

*/
