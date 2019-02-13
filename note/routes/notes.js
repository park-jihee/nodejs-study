var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '1234',
  database: 'note'
});

connection.connect();

//글 쓰기 화면
router.get('/', function (req, res, next) {
    if (req.session.passport !== undefined) {
        if (req.session.passport.user !== undefined) {
            //로그인 한 사용자
            res.render('write', {
                title: 'MyBoard',
                session: req.session.passport
            });
        } else {
            res.redirect('/');
        }
    } else {
        res.redirect('/');
    }
});

// 글 상세 조회
router.get('/:no', function (req, res, next) {
    var noteNum = req.params.no;
    var sql = "SELECT b_no, b_title, b_content, b_writer, user.name as name, DATE_FORMAT((b_time), '%Y-%m-%d') as b_time FROM board LEFT JOIN user on board.b_writer = user.no where b_no = '"+ noteNum +"'order by b_time desc";
    var query = connection.query(sql, function (err, rows) {
        if (err) {
            throw err;
        }
        //글 조회 -> 결과가 1개 일때만
        if(rows.length == 1) {
            if (req.session.passport !== undefined) {
                if (req.session.passport.user !== undefined) {
                    //로그인 한 사용자
                    res.render('detail', {
                        title: 'MyBoard',
                        session: req.session.passport,
                        note: rows[0]
                    });
                } else {
                    res.render('detail', {
                        title: 'MyBoard',
                        session: {},
                        note: rows[0]
                    });
                }
            } else {
                res.render('detail', {
                    title: 'MyBoard',
                    session: {},
                    note: rows[0]
                });
            }        
        } else {
            console.log("error");
            res.redirect('/');
        }
    });
});

// 글 삽입
router.post('/', function(req, res) {
    var title = req.body.title;
    var content = req.body.content;
    var writer = req.session.passport.user.no;
    var datas = [writer, title, content];

    var sql = "insert into board ( b_writer, b_title, b_content ) values (?, ?, ?)";
    var query = connection.query(sql, datas, function(err, rows){
        if(err) { throw err; }
        console.log("DATA INSERTED!");
        res.redirect('/');
    });
});

// 글 수정
router.get('/update/:no', function (req, res, next) {
    var note_no = req.params.no;
    var sql = "select * from board where b_no = ?"
    var query = connection.query(sql, note_no, function (err, rows){
        if (req.session.passport !== undefined) {
            if (req.session.passport.user !== undefined) {
                //로그인 한 사용자
                res.render('update', {
                    title: 'MyBoard',
                    session: req.session.passport,
                    note: JSON.stringify(rows[0])
                });
            } else {
                res.redirect('/');
            }
        } else {
            res.redirect('/');
        }
    });
});

router.post('/update/:no', function(req, res) {
    var title = req.body.title;
    var content = req.body.content;
    var writer = req.params.no;
    var sql = "update board set b_title = '"+ title +"', b_content = '"+ content +"'where b_no = '" + writer + "';";
    var query = connection.query(sql, function(err, rows){
        if(err) { throw err; }
        console.log("DATA UPDATED!");
        res.redirect('/');
    });
});

// 글 삭제

router.post('/delete/:no', function(req, res, next){
    var no = req.params.no;
    var sql = "delete from board where b_no = '" + no + "';";
    var query = connection.query(sql, function (err, rows){
        if(err){ throw err; }
        res.redirect('/');
    });
});

module.exports = router;