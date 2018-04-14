var router = require("express").Router();
var DataModel = require("./model");
var util = require("../util/randomWord");

let productNumberEachPage = 7;
router.get('/', async (req, res) => {
    let products = await DataModel.Product.find({})
    .sort('-createTime')
    .limit(productNumberEachPage)
    .skip(0);

    let productsnum = await DataModel.Product.count({});

    let times = [];
    products.forEach(doc => times.push(util.getSpecificDate(doc.createTime)));

    res.render('products', {
        title: "产品页",
        user: req.session.user,
        error: {},
        products,
        times,
        productNumberEachPage,
        currentPage: 1,
        pagenum: Math.ceil(productsnum / productNumberEachPage)
    });
});

router.get('/:pageNum', async (req, res) => {
    let pageNum = req.params.pageNum;

    let products = await DataModel.Product.find({})
    .sort('-createTime')
    .limit(productNumberEachPage)
    .skip((pageNum - 1) * productNumberEachPage);

    let productsnum = await DataModel.Product.count({});

    let times = [];
    products.forEach(doc => times.push(util.getSpecificDate(doc.createTime)));

    res.render('products', {
        title: "产品页",
        user: req.session.user,
        error: {},
        products,
        times,
        productNumberEachPage,
        currentPage: pageNum,
        pagenum: Math.ceil(productsnum / productNumberEachPage)
    });
})

module.exports = router;