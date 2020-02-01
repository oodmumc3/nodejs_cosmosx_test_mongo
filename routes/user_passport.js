/**
 * 패스포트 라우팅 함수 정의
 *
 * @date 2016-11-10
 * @author Mike
 */
  
module.exports = function(router, passport) {
    console.log('user_passport 호출됨.');

    // 홈 화면
    router.route('/').get(function(req, res) {
        console.log('/ 패스 요청됨. __홈 화면조회시');
        console.log('req.user의 정보 __홈 화면조회시');
 
        // 인증 안된 경우
        if (!req.user) {
            console.log('사용자 인증 안된 상태임. __홈 화면조회시');
            res.render('index.ejs', {login_success:false});

        } else {
            console.log('사용자 인증된 상태임. __홈 화면조회시_else');
            console.dir(req.user.provider);
            if (Array.isArray(req.user)) {
                res.render('aaa.ejs', {user: req.user[0]._doc, login_success:true});
                console.dir(req.user);
                console.log('사용자 인증된 상태임. __홈 화면조회시_1111');
            } else  {
                res.render('aaa.ejs', {user: req.user, login_success:true});
                console.dir(req.user);
                console.log('사용자 인증된 상태임. __홈 화면조회시_2222');
            }
        }        
    });
    
    // 로그인 화면
    router.route('/login').get(function(req, res) {
        console.log('/login 패스 요청됨. __로그인 화면조회시');
        if (req.user) {
            console.log('사용자 인증 된 상태. __로그인 화면조회시_if');
            res.redirect('/');
        } else {
            console.log('사용자 인증 안된 상태. __로그인 화면조회시_else');
            res.render('login.ejs', {message: req.flash('loginMessage')});
        }
    });
     
    // 회원가입 화면
    router.route('/signup').get(function(req, res) {
        console.log('/signup 패스 요청됨. __사이트가입 화면조회시');
        res.render('signup.ejs', {message: req.flash('signupMessage')});
    }); 
    
    // 프로필 화면
    router.route('/profile').get(function(req, res) {
        console.log('/profile 패스 요청됨. __개인정보 화면조회시');

        // 인증된 경우, req.user 객체에 사용자 정보 있으며, 인증안된 경우 req.user는 false값임
        console.log('req.user 객체의 값 __개인정보 화면조회시');

        // 인증 안된 경우
        if (!req.user) {
            console.log('사용자 인증 안된 상태임. __개인정보 화면조회시');
            res.redirect('/');
        } else {
            console.log('사용자 인증된 상태임. __개인정보 화면조회시');

            if (Array.isArray(req.user)) {
                res.render('profile.ejs', {user: req.user[0]._doc, login_success:true});
                console.log('/profile 패스 요청됨. __개인정보 화면조회시_if arry');
                //res.render('profile.ejs', {login_success:true});
            } else  {
                res.render('profile.ejs', {user: req.user, login_success:true});
                console.log('/profile 패스 요청됨. __개인정보 화면조회시 없음arry');
                //res.render('profile.ejs', {login_success:true});
            }
        }   
    });
	
    // 로그아웃
    router.route('/logout').get(function(req, res) {
        console.log('/logout 패스 요청됨. __개인정보 화면조회시');
        req.logout();
        res.redirect('/');
        //res.render('aaa.ejs', {login_success:false});
    });


    // 로그인 인증
    router.route('/login').post(passport.authenticate('local-login', {  
        successRedirect : '/', 
        failureRedirect : '/login', 
        failureFlash : true 
    }));


    // 회원가입 인증
    router.route('/signup').post(passport.authenticate('local-signup', {
        successRedirect : '/', 
        failureRedirect : '/signup', 
        failureFlash : true 
    }));

    // 패스포트 - 페이스북 인증 라우팅 
    router.route('/auth/facebook').get(passport.authenticate('facebook', { 
        scope : 'email' 
    }));

    // 패스포트 - 페이스북 인증 콜백 라우팅
    router.route('/auth/facebook/callback').get(passport.authenticate('facebook', {
        successRedirect : '/profile',
        failureRedirect : '/'
    }));

    //라우팅 정보를 읽어들여 라우팅 설정
    //var router = express.Router();
    //var code = req.query.code;
    // 패스포트 - kakaotalk 인증 라우팅 
    router.route('/auth/kakao').get(passport.authenticate('kakao', {
    }));
    
    
    // 패스포트 - kakaotalk 인증 콜백 라우팅
    router.route('/auth/kakao/callback').get(passport.authenticate('kakao', {
    successRedirect : '/',
    failureRedirect : '/signup'
    }));
};