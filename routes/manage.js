var router = require('express').Router();
var DataModel = require("./model");
var util = require("../util/randomWord");
var fs = require("fs-extra");

var multer = require("multer");
var path = require("path");

var upload = multer({
    dest: path.join(__dirname, "../public/images"),
});

router.get('/', async (req, res) => {
    if (req.session.user !== "管理员") {
        res.render('error', {message: "你没有后台管理权限啊~"});
    } else {
        let products = await DataModel.Product.find();
        
        let times = [];
        products.forEach(doc => times.push(util.getSpecificDate(doc.createTime)));

        res.render('manage', {
            title: "后台管理系统",
            user: req.session.user,
            error: req.session.error ? req.session.error : {},
            products: products,
            times: times
        }); 
    }
});

router.get('/delete/:id', async (req, res) => {
    let picfilename = req.params.id;
    console.log(picfilename);
    let product = await DataModel.Product.remove({picAddress: picfilename});
    console.log(product);
    try { 
        await fs.unlink(path.join(__dirname, `../public/images/${picfilename}`));
    } catch (e) {
        console.log(e);
    }
    res.redirect("/manage");
});

router.post('/upload', upload.single('picture'), async (req, res) => {
    let {name, price, description} = req.body;
    
    // first validate 
    if (!req.file) {
        req.session.error = {
            ["picture"]: {
                message: "上传图片不能为空",
                position: "picture"
            }            
        };
        res.redirect('/manage');
        return;
    }

    let products = await DataModel.Product.find({name: name});
    if (products.length === 0) {
        // create
        let product = new DataModel.Product({
            name: name,
            picAddress: req.file.filename,
            price: price,
            description: description,
            createTime: new Date(),
            editTime: new Date()
        });
        try {
            await product.save();
        } catch(e) {
            req.session.error = e.errors;
            console.log(req.session.error);
        }
        res.redirect("/manage");
    } else {
        // update
        let product = products[0];
        product.name = name;
        product.picAddress = req.file.filename;
        product.price = price;
        product.description = description;
        product.editTime = new Date();

        try {
            await product.save();
        } catch(e) {
            req.session.error = e.errors;  
        }
        res.redirect("/manage");
    }
});


module.exports = router;