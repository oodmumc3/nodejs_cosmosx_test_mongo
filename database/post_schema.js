/**
 * 게시판을 위한 데이터베이스 스키마를 정의하는 모듈
 *
 * @date 2016-11-10
 * @author Mike
 */

exports.createSchema = function(mongoose) {
	var PostSchema = mongoose.Schema({
	    title: {type: String, trim: true, 'default':''},
	    contents: {type: String, trim: true, 'default':''},
		writer: {type: mongoose.Schema.ObjectId, ref: 'users6'},
		viewcount: {type: Number, default:0},
        password: {type: String, maxlength: 4},
        isUseComments: { type: Boolean, default: true },
        likes: [{type: mongoose.Schema.ObjectId, ref: 'users6'}],
        hates: [{type: mongoose.Schema.ObjectId, ref: 'users6'}],
        comments: [{
	    	contents: {type: String, trim:true, 'default': ''},
	    	writer: {type: mongoose.Schema.ObjectId, ref: 'users6'},
	    	created_at: {type: Date, 'default': Date.now}
	    }],
	    tags: {type: [], 'default': ''},
	    created_at: {type: Date, index: {unique: false}, 'default': Date.now},
	    updated_at: {type: Date, index: {unique: false}, 'default': Date.now}
	});
	
	// 필수 속성에 대한 'required' validation
	PostSchema.path('title').required(true, '글 제목을 입력하셔야 합니다.');
	PostSchema.path('contents').required(true, '글 내용을 입력하셔야 합니다.');
	
	// 스키마에 인스턴스 메소드 추가
	PostSchema.methods = {
		savePost: function(callback) {		// 글 저장
			var self = this;
			
			this.validate(function(err) {
				if (err) return callback(err);
				
				self.save(callback);
			});
		},
		addComment: function(user, comment, callback) {		// 댓글 추가
			this.comment.push({
				contents: comment.contents,
				writer: user._id
			});
			
			this.save(callback);
		},
		removeComment: function(id, callback) {		// 댓글 삭제
			var index = utils.indexOf(this.comments, {id: id});
			if (~index) {
				this.comments.splice(index, 1);
			} else {
				return callback('ID [' + id + '] 를 가진 댓글 객체를 찾을 수 없습니다.');
			}
			
			this.save(callback);
		}
	}
	
	PostSchema.statics = {
		// ID로 글 찾기
		load: function(id, callback) {
			this.findOne({_id: id})
				.populate('writer', 'name provider email')
				.populate('comments.writer')
				.exec(callback);
		},
		list: function(options, callback) {
			var criteria = options.criteria || {};
			
			this.find(criteria)
				.populate('writer', 'name provider email')
				.sort({'created_at': -1})
				.limit(Number(options.perPage))
				.skip(options.perPage * options.page)
				.exec(callback);
		},
		incrViewcount: function(id, callback) {
            var query = {_id: id};
            var update = {$inc: {viewcount:1}};
            var options = {upsert:true, 'new':true, setDefaultsOnInsert:true};
            
            this.findOneAndUpdate(query, update, options, callback);            
        }

	};

	return PostSchema;
};

