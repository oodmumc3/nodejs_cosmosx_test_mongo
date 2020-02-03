const FreeBoardService = require('../service/free_board_service');

exports.index = async (req, res) => {
    const perPage = req.query.perPage || 2;
    const page = req.query.page || 1;

    let { searchType, searchTerm } = req.query;
    if (!searchTerm) {
        searchTerm = searchType = null;
    } else if (searchTerm && !['title', 'contents', 'writer'].includes(searchType)) {
        // 검색 조건이 title, contents중 하나라도 일치하지 않으면 기본으로 title로 지정한다.
        searchType = 'title';
    }

    const { boards, totalCnt, totalPage } =
        await FreeBoardService.findFreeBoardListWithPaging(page, perPage, searchType, searchTerm);

    res.render('free_board/index.ejs', {
        boards,
        totalCnt,
        totalPage,
        searchTerm,
        searchType,
        currentPage: page
    });
};

exports.write = (req, res) => {
    res.render('free_board/write.ejs', { board: {} });
};

exports.save = async (req, res) => {
    const title = req.body.title;
    const contents = req.body.contents;
    const password = !req.isAuthenticated() ? req.body.password : null;

    try {
        const id = await FreeBoardService.save(title, contents, password, req.user);
        res.redirect(`/free_board/view/${id}`);
    } catch (e) {
        console.error(e);
        res.redirect('/free_board/index');
    }
};

exports.view = async (req, res) => {
    const boardId = req.params.id;
    if (!boardId) { return res.redirect('/free_board/index'); }

    const board = await FreeBoardService.findOneById(boardId);
    board.isOwner = false;
    if (!board.isUnKnownWriter && req.isAuthenticated()) {
        // mongoose의 _id는 .equals로 비교해야함.
        board.isOwner = board.userId.equals(req.user._id);
    }

    res.render('free_board/view.ejs', { board, errorMsg: req.flash('errorMsg') });
};

exports.update = async (req, res) => {
    const {id, title, contents, passwordChk} = req.body;

    // 수정할 게시판 정보가 있는지 확인하고 없으면 게시판 목록으로 이동시킨다.
    const board = await FreeBoardService.findOneById(id);
    if (!board) { return res.redirect('/free_board/index'); }
    if (board.isUnKnownWriter && board.password !== passwordChk) {
        req.flash('errorMsg', '글 비밀번호가 일치하지 않습니다.');
        return res.redirect(`/free_board/view/${id}`);
    } else if (!board.isUnKnownWriter) {
        if (!req.isAuthenticated() || !board.userId.equals(req.user._id)) {
            req.flash('errorMsg', '비정상적인 접근입니다.');
            return res.redirect(`/free_board/view/${id}`);
        }
    }

    try {
        await FreeBoardService.updateById(id, title, contents);
    } catch (e) {
        console.error(`free board update error :; ${e}`);
        return res.redirect('/free_board/index');
    }

    res.redirect(`/free_board/view/${id}`);
};

exports.updateForm = async (req, res) => {
    const boardId = req.params.id;

    const board = await FreeBoardService.findOneById(boardId);
    if (!board) { return res.redirect('/free_board/index'); }

    res.render('free_board/write.ejs', { board });
};

exports.delete = async (req, res) => {
    const boardId = req.params.id;

    const board = await FreeBoardService.findOneById(boardId);
    if (!board) { return res.redirect('/free_board/index'); }

    const password = req.body.password || '';
    if (board.isUnKnownWriter && board.password !== password) {
        req.flash('errorMsg', '삭제 비밀번호가 일치하지 않습니다.');
        return res.redirect(`/free_board/view/${boardId}`);
    } else if (!board.isUnKnownWriter) {
        if (!req.isAuthenticated() || !board.userId.equals(req.user._id)) {
            req.flash('errorMsg', '비정상적인 접근입니다.');
            return res.redirect(`/free_board/view/${boardId}`);
        }
    }

    await FreeBoardService.deleteOneById(boardId);
    res.redirect('/free_board/index');
};
