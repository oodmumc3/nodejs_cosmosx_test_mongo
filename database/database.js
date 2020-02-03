/*
 * 데이터베이스 스키마 로딩
 * 기본 파일이며 개발자 수정 필요없음
 *
 * @date 2016-11-10
 * @author Mike
 */
var mongoose = require('mongoose');

// database 객체에 db, schema, model 모두 추가
const _MONGODB_MODEL = {};

// config에 정의된 스키마 및 모델 객체 생성
function createSchema(app, config) {
    var schemaLen = config.db_schemas.length;
    console.log('설정에 정의된 스키마의 수 : %d', schemaLen);

    for (var i = 0; i < schemaLen; i++) {
        var curItem = config.db_schemas[i];

        console.log(curItem.file);
        var curSchema = require(curItem.file).createSchema(mongoose);
        console.log('%s 모듈을 불러들인 후 스키마 정의함.', curItem.file);

        var curModel = mongoose.model(curItem.collection, curSchema);
        console.log('%s 컬렉션을 위해 모델 정의함.', curItem.collection);

        // database 객체에 속성으로 추가
        _MONGODB_MODEL[curItem.schemaName] = curSchema;
        _MONGODB_MODEL[curItem.modelName] = curModel;
        console.log('스키마 이름 [%s], 모델 이름 [%s] 이 database 객체의 속성으로 추가됨.', curItem.schemaName, curItem.modelName);
    }

    app.set('database', _MONGODB_MODEL);
}

//데이터베이스에 연결하고 응답 객체의 속성으로 db 객체 추가
function connect(app, config) {
    mongoose.Promise = global.Promise;  // mongoose의 Promise 객체는 global의 Promise 객체 사용하도록 함

    mongoose.set('useCreateIndex', true);
    mongoose.set('useUnifiedTopology', true);

    const database = mongoose.connection.openUri(config.db_url,{useNewUrlParser: true });
    database.on('error', console.error.bind(console, 'mongoose connection error.'));
    database.on('open', function () {
        console.log('데이터베이스에 연결되었습니다. : ' + config.db_url);

        createSchema(app, config);
    });
    database.on('disconnected', connect);
}

// 초기화를 위해 호출하는 함수
exports.init = function(app, config) {
	connect(app, config);
};

exports.getMongooseModel = (modelName) => {
    const model = _MONGODB_MODEL[modelName];
    if (!model) { throw Error(`No Exist ${modelName} Model`); }

    return model;
};
