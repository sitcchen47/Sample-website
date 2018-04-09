const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/test"); // only use mongodb database test 
mongoose.Promise = Promise;

const User = mongoose.model("User", {
    name: {
        type: String,
        require: true,
        match: [/^([a-zA-Z]|[u4e00-u9fa5]|_)([a-zA-Z0-9]|[u4e00-u9fa5]|_)*$/, "包含中文，英文，数字，下划线，不能输入括号，不能以数字开头"],
        minlength: [4, "用户名长度不少于4个字符"],
        maxlength: [10, "用户名长度不大于10个字符"]
    },
    createTime: {
        type: Date,
        require: true
    },
    editTime: Date, 
    articles: [String] // Article _id
});

const Article = mongoose.model("Article", {
    title: {
        type: String,
        require: true,
        minlength: 1
    },
    body: String,
    createTime: Date,
    editTime: Date,
    author: String // User _id 
});

const Review = mongoose.model("Review", {
    body: String,
    createTime: Date,
    editTime: Date,
    author: String
});

/**
 * 产品图、产品名、产品价格、产品描述
 * 产品名、价格、描述需要正则验证, 长度也应有限制
 */
const Product = mongoose.model("Product", {
    name: {
        type: String,
        require: true,
        minlength: [1, "产品名长度至少为1"],
        maxlength: 10
    },
    picUrl: String,
    description: {
        type: String,
        require: true,
        match: [/^([a-zA-Z]|[u4e00-u9fa5]|_)([a-zA-Z0-9]|[u4e00-u9fa5]|_)*$/, "包含中文，英文，数字，下划线，不能输入括号，不能以数字开头"],
        minlength: [10, "产品描述不能少于10个字符"]
    },
    price: {
        type: String,
        require: true,
        match: [/[1-9]\d*/, "价格只能是数字且开头不能为0"]
    }
})
module.exports = {
    User,
    Article,
    Review,
    Product
};