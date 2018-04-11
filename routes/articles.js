var router = require("express").Router();
var DataModel = require("./model");

router.get('/', async (req, res) => {
    let articles = await DataModel.Article.find({});
    
})
module.exports = router;