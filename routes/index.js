/*
 * 게시판을 위한 라우팅 함수 정의
 *
 * @date 2016-11-10
 * @author Mike
 */

// html-entities module is required in showpost.ejs
var Entities = require('html-entities').AllHtmlEntities;


var main_listpost = function(req, res) {
    var paramPage = req.body.page || req.query.page;
    var paramPerPage = req.body.perPage || req.query.perPage;
	
    console.log('요청 파라미터 : ' + paramPage + ', ' + paramPerPage);
    
	var database = req.app.get('database');

    // 데이터베이스 객체가 초기화된 경우
    var options = {
        page: paramPage,
        perPage: paramPerPage
    }

    database.PostModel.list(options, function(err, results) {
        if (err) {
            console.error('게시판 글 목록 조회 중 에러 발생 : ' + err.stack);

            res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
            res.write('<h2>게시판 글 목록 조회 중 에러 발생</h2>');
            res.write('<p>' + err.stack + '</p>');
            res.end();

            return;
        }

        if (results) {
            // 전체 문서 객체 수 확인
            database.PostModel.count().exec(function(err, count) {
                // 뷰 템플레이트를 이용하여 렌더링한 후 전송
                var context = {
                    title: '글 목록',
                    posts: results,
                    page: parseInt(paramPage),
                    pageCount: Math.ceil(count / paramPerPage),
                    perPage: paramPerPage,
                    totalRecords: count,
                    size: paramPerPage
                };

                // https://stackoverflow.com/questions/15403791/whats-the-difference-between-app-render-and-res-render-in-express-js
                res.render('index', context);
            });

        } else {
            res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
            res.write('<h2>글 목록 조회  실패</h2>');
            res.end();
        }
    });
};



module.exports.main_listpost = main_listpost;
