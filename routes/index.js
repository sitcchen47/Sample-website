var express = require('express');
var router = express.Router();
var DataModel = require("./model");
var bcrypt = require("bcryptjs");

var util = require("../util/randomWord");
var PW = require("png-word");
var pw = new PW(PW.GRAY);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.locals.user = req.session.user;
  req.session.error = null;
  // 主页默认为产品页
  res.render('index', { title: 'Express'});
});

router.get('/reg', (req, res) => {
  let error = req.session.error;
  res.render('reg', {error});
});

router.get('/login', (req, res) => {
  let error = req.session.error && req.session.error.position === "alert" ? null : req.session.error ;
  res.render('login', {error});
});

router.get('/logout', (req, res) => {
  req.session.user = undefined;
  res.redirect("back");
});

router.post('/reg', async (req, res) => {
  const { username, password, confirm, confirmPic } = req.body;
  // validation must be passed and then continue to the next step
  let curUser = await DataModel.User.find({name: username});
  if (username === "管理员" || curUser[0]) {
    req.session.error = {
      message: "用户名已存在",
      position: "username"
    };
    res.redirect("back");
    return;
  }
 
  if (password === confirm && req.session.confirmPic.toLowerCase() === confirmPic.toLowerCase()) {
    // 把该User写入数据库中
    let salt = await bcrypt.genSalt(5);
    let hashedPassword = await bcrypt.hash(password, salt);
    console.log(hashedPassword);
    let newUser = new DataModel.User({
      name: username,
      hashedPassword: hashedPassword,
      createTime: new Date(),
      editTime: new Date(),
      articles: []
    });
    try {
      await newUser.save(); // 持久化到数据库中
    } catch (err) {
      // if the username is not valid
      req.session.error = {
        message: err.errors.name.message,
        position: "username"
      };
      res.redirect("back");
      return;
    }
    req.session.error = undefined;
    // req.session.user = newUser.name; // 不知道有啥用 先这么干
    res.redirect("/");
  } else if (password !== confirm){
    req.session.error = {
      message: "密码不一致",
      position: "confirm"
    };
    res.redirect("back");
  } else {
    req.session.error = {
      message: "验证码填写错误~",
      position: "confirmPic"
    };
    res.redirect("back");
  }

});

router.post("/login", async (req, res) => {
  const { loginname, password, confirmPic } = req.body;
  // validation must be passed and then continue to the next step
  let curUser;
  // admin account information
  let admin = {
    name: 'admincchen47',
    password: 'sitCC940630'
  };

  try {
    curUser = await DataModel.User.find({name: loginname}); // that will be an array
  } catch(e) {
    req.session.error = {
      message: "用户名不存在",
      position: "loginname"
    }
    res.redirect("back");
    return;
  } 
  if (curUser[0]) {
    if (confirmPic.toLowerCase() === req.session.confirmPic.toLowerCase()) {
      // 用户名存在且验证码正确
      // console.log(curUser[0]);
      let psdRes = await bcrypt.compare(password, curUser[0].hashedPassword);
      if (psdRes) {
        req.session.user = curUser[0].name;
        req.session.save(()=> {
          res.redirect("/");
        });
      } else {
        req.session.error = {
          message: "密码不对",
          position: "password"
        }
        res.redirect("back");
      }
    } else {
      req.session.error = {
        message: "验证码填写不正确",
        position: "confirmPic"
      }
      res.redirect("back");
    }
  } else if (loginname === admin.name && password === admin.password){
    res.locals.user = req.session.user = "管理员";
    res.render('/manage');
    // 管理员权限
  } else {
    req.session.error = {
      message: "用户名不存在",
      position: "loginname"
    }
    res.redirect("back");
  }
});

router.get('/random-confirm-pic', async (req, res) => {
  let str = util.createRandomWord();
  if (req.session) {
    req.session.confirmPic = str;    
  } else {
    console.log("There is somewhere wrong at '/random-confirm-pic' route");
  }
  pw.createReadStream(str).pipe(res);
});

module.exports = router;
