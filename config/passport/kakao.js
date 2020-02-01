/**
 * 패스포트 설정 파일
 * 
 * 페이스북 인증 방식에 사용되는 패스포트 설정
 *
 * @date 2016-11-10
 * @author Mike
 */

var kakaoStrategy = require('passport-kakao').Strategy;
var config = require('../config');

		/*/var code = req.query.code;

		var options = {
			criteria: { 'kakao.id': profile.id},
			url: "https://kauth.kakao.com/oauth/token",
			method: 'POST',
			headers: {
				'User-Agent': 'Super Agent/0.0.1',
				'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
			},
			form: {
			  grant_type: "authorization_code",
			  client_id: config.kakao.clientID,
			  redirect_uri: config.kakao.callbackURL,
			  code: code
			}
		}*/



module.exports = function (app, passport) {
	return new kakaoStrategy({
		clientID: config.kakao.clientID,
		//clientSecret: config.kakao.clientSecret,
		callbackURL: config.kakao.callbackURL,
		}, 
		function (accessToken, refreshToken, profile, done) {
		console.dir(profile);
		console.log('★ passport의 kakao 호출됨 _var database.');
		var database = app.get('database');
		console.log('★ passport의 kakao 호출됨 _var database불러옴.');


		database.UserModel.findOne(
			{
				'kakao.id': profile.id,},	
			function(err, user) {
				if (err) {
				  return done(err)
				}
				if (!user) {
				  var user = new database.UserModel({
					nickname: '',
					name: profile.username,
					username: profile.id,
					email: profile.account_email,
					gender: profile.gender,
					age_range: profile.age_range,
					roles: ['authenticated'],
					provider: 'kakao',
					kakao: profile._json,
				  })
	   
				  user.save(function(err) {
					if (err) {
					  console.log(err)
					}
					return done(err, user)
				    })
				} else {
				  return done(err, user)
				}
			}
		)
		/*database.UserModel.findOne(options, function (err, user) {
			console.log('★ passport의 kakao 호출됨 _var database내부.');
			
	
			if (err) return done(err);
			console.log('★ passport의 kakao 호출됨 에러남.');
			if (!user) {
				console.log('★ passport의 kakao 호출됨 _!user.');
				var user = new database.UserModel({
					name : profile.username,
					username : profile.id,
					roles: ['authenticated'],
					provider: 'kakao',
					kakao: profile._json
				});
				console.log('★ passport의 kakao 호출됨 _user.save');
				user.save(function (err) {
					if (err) console.log(err);
					return done(err, user);
				});
			} else {
				return done(err, user);
				console.log('★ passport의 kakao 호출됨 없어서 에러남.');
			}
		});


	});
*/

		})
};





