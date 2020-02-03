const FreeBoardService = require('../service/free_board_service');

// html-entities module is required in showpost.ejs
const main_listpost = async function(req, res) {
    const { boards, totalCnt, totalPage } =
        await FreeBoardService.findFreeBoardListWithPaging(1, 5, null, null);

    var context = {
        title: '글 목록',
        posts: boards,
        page: 1,
        pageCount: 5,
        perPage: 5,
        totalRecords: 5,
        size: 5
    };
    res.render('index', context);

};
module.exports.main_listpost = main_listpost;
