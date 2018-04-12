var router = require("express").Router();
var DataModel = require("./model");
var util = require('../util/randomWord');

router.get('/', async (req, res) => {
    let articleNumberEachPage = 10;
    let articles = await DataModel.Article.find({})
    .sort('-createTime')
    .limit(articleNumberEachPage)
    .skip(0);

    let Messages = [];
    articles.forEach(doc => Messages.push(util.getDif(doc.createTime)));
    res.render('articles', {title: "文章列表", user: req.session.user, error: req.session.error, articles, Messages });
});

router.post('/post', async (req, res) => {
    if (!req.session.user) {
        req.session.error = {
            message: "没有登录的用户没有权限发表文章",
            position: "alert"
        }       
        res.redirect('back');
    }
    const {title, body, confirmPic} = req.body;
    if (req.session.confirmPic.toLowerCase() === confirmPic.toLowerCase()) {
        let article;
        try {
            article = new DataModel.Article({
                title: title,
                body: body,
                liked: 1,
                createTime: new Date(),
                author: req.session.user
            });
            await article.save();            
        } catch(e) {
            req.session.error = {
                message: e.errors['title'].message,
                position: 'title'
            };           
        }
    } else {
        req.session.error = {
            message: "验证码错误",
            position: "confirmPic"
        }        
    }
    res.redirect('back');
});

router.get('/id/:id', async (req, res) => {
    req.session.error = null;

    let id = req.params.id;       
    let article = await DataModel.Article.findById(id);
    res.render('articleContent', {title: "文章内容", user: req.session.user, article});
});

module.exports = router;