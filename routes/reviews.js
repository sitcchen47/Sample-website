var express = require('express');
var router = express.Router();
var DataModel = require('./model');

/* GET users listing. */
router.get('/', async function(req, res, next) {
  let reviews = await DataModel.Review.find({});
  res.locals.user = req.session.user;

  res.render('reviews', { reviews });
});

router.post('/post', async (req, res) => {
  
});

module.exports = router;
