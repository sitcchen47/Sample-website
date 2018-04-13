var express = require('express');
var router = express.Router();
var DataModel = require('./model');
var util = require("../util/randomWord");

// // isolate the different subrouter 分离不同的路由
// router.use(function(req, res, next) {
//     req.session.error = null;
//     next();
// });

/* GET users listing. */
let reviewNumberEachPage = 10;
router.get('/', async function(req, res, next) {
  let pagenum = 10;

  let reviews = await DataModel.Review.find({})
  .sort('-createTime')
  .limit(reviewNumberEachPage)
  .skip(0);

  let reviewsnum = await DataModel.Review.count({});
  let Messages = [];
  reviews.forEach(doc => Messages.push(util.getDif(doc.createTime)));

  res.render('reviews', { 
    title: "留言板", 
    user: req.session.user, 
    error: req.session.error ? req.session.error : {},
    Messages,
    reviews, 
    currentPage: 1,
    reviewNumberEachPage,
    pagenum: Math.ceil(reviewsnum / reviewNumberEachPage)
  });
});

router.get('/:pageNum', async (req, res) => {
  let pageNum = req.params.pageNum;
  let reviews = await DataModel.Review.find({})
  .sort('-createTime')
  .limit(reviewNumberEachPage)
  .skip((pageNum - 1) * reviewNumberEachPage);

  let reviewsnum = await DataModel.Review.count({});
  let Messages = [];
  reviews.forEach(doc => Messages.push(util.getDif(doc.createTime)));

  res.render('reviews', {
      title: "留言板", 
      user: req.session.user, 
      error: req.session.error ? req.session.error : {}, 
      reviews, 
      Messages, 
      reviewNumberEachPage,
      currentPage: pageNum, 
      pagenum: Math.ceil(reviewsnum / reviewNumberEachPage)
  });
})

router.post('/post', async (req, res) => {
  if (!req.session.user) {
      req.session.error = {
          message: "没有登录的用户没有权限留言",
          position: "alert"
      }       
      res.redirect('back');
      return;
  }
  const {body, confirmPic} = req.body;
  // console.log(req.session.confirmPic.toLowerCase(), confirmPic.toLowerCase());
  if (req.session.confirmPic.toLowerCase() === confirmPic.toLowerCase()) {
      let review;
      try {
          review = new DataModel.Review({
              body: body,
              createTime: new Date(),
              editTime: new Date(),
              author: req.session.user
          });
          await review.save();            
      } catch(e) {
          req.session.error = {
              message: e.errors['body'].message,
              position: 'body'
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

module.exports = router;
