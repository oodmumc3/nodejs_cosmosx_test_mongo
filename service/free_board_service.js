const Database = require('../database/database');

async function countWithWriterSearch (searchType, searchTerm) {
    const UserModel = Database.getMongooseModel('UserModel');
    const writerIds = await UserModel.find({ name: { $regex: '.*' + searchTerm + '.*' } }, '_id');

    if (!writerIds || writerIds.length === 0) { return 0; }

    const PostModel = Database.getMongooseModel('PostModel');
    return await PostModel.countDocuments({ writer: { $in: writerIds } });
}

async function countWithSearch (searchType, searchTerm) {
    const PostModel = Database.getMongooseModel('PostModel');
    const condition = {};
    if (searchType) {
        condition[searchType] = { $regex: '.*' + searchTerm + '.*' };
    }

    return await PostModel.countDocuments(condition);
}

async function findAllWithPagingAndWriterSearch (offset, perPage, searchType, searchTerm) {
    const UserModel = Database.getMongooseModel('UserModel');
    const writerIds = await UserModel.find({ name: { $regex: '.*' + searchTerm + '.*' } }, '_id');

    if (!writerIds || writerIds.length === 0) { return []; }

    const PostModel = Database.getMongooseModel('PostModel');
    return await PostModel.find({ writer: { $in: writerIds } }, '_id title viewcount created_at')
        .populate('writer')
        .skip(offset)
        .limit(perPage)
        .sort({ created_at: -1 });
}

async function findAllWithPagingAndSearch (offset, perPage, searchType, searchTerm) {
    const PostModel = Database.getMongooseModel('PostModel');
    const condition = {};
    if (searchType === 'title' || searchType === 'contents') {
        condition[searchType] = { $regex: '.*' + searchTerm + '.*' };
    }

    return await PostModel.find(condition, '_id title viewcount created_at')
        .populate('writer')
        .skip(offset)
        .limit(perPage)
        .sort({ created_at: -1 });
}

exports.save = async (title, contents, password, loginUser) => {

    const PostModel = Database.getMongooseModel('PostModel');
    const post = new PostModel();
    post.title = title;
    post.contents = contents;
    if (password) {
        post.password = password;
    } else if (loginUser) {
        post.writer = loginUser._id;
    }

    const res = await post.save();
    return res._id;
};

exports.findOneById = async (id) => {
    const PostModel = Database.getMongooseModel('PostModel');
    const post = await PostModel.findById(id).populate('writer');

    return {
        id: post._id,
        title: post.title,
        contents: post.contents,
        password: post.password,
        isUnKnownWriter: !post.writer,
        username: post.writer ? post.writer.name : '[비회원]',
        userId: post.writer ? post.writer._id : null,
        createdAt: post.created_at
    };
};

exports.findFreeBoardListWithPaging = async (page, perPage, searchType, searchTerm) => {
    // DB 검색 시작위치를 계산한다.
    const offset = page > 1 ? perPage * (page - 1) : 0;

    let totalCnt, boards;
    if (searchType === 'writer') {
        totalCnt = await countWithWriterSearch(searchType, searchTerm);
        boards = await findAllWithPagingAndWriterSearch(offset, perPage, searchType, searchTerm);
    } else {
        totalCnt = await countWithSearch(searchType, searchTerm);
        boards = await findAllWithPagingAndSearch(offset, perPage, searchType, searchTerm);
    }

    let startBoardNum = totalCnt - (page - 1) * perPage;
    for (const board of boards) {
        board.num = startBoardNum--;
        board.username = board.writer ? board.writer.name : '[비회원]';
    }

    return {
        boards,
        totalCnt,
        totalPage: Math.ceil(totalCnt / perPage)
    };
};

exports.updateById = async (id, title, contents) => {
    const PostModel = Database.getMongooseModel('PostModel');

    const post = await PostModel.findById(id);
    post.title = title;
    post.contents = contents;
    await post.save();

    return id;
};

exports.deleteOneById = async (id) => {
    const PostModel = Database.getMongooseModel('PostModel');
    await PostModel.findByIdAndDelete(id);
};


