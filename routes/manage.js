var router = require('express').Router();

router.get('/', async (req, res) => {
    if (req.session.user !== "管理员") {
        res.render('error', {message: "你没有后台管理权限啊~"});
    }
})
module.exports = router;