const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/test"); // only use mongodb database test 
mongoose.Promise = Promise;

const User = mongoose.model("User", {
    name: {
        type: String,
        require: true,
        match: [/^([a-zA-Z]|[u4e00-u9fa5]|_)([a-zA-Z0-9]|[u4e00-u9fa5]|_)*$/, "包含中文，英文，数字，下划线，不能输入括号，不能以数字开头"],
        minlength: [3, "用户名长度不少于3个字符"],
        maxlength: [10, "用户名长度不大于10个字符"]
    },
    hashedPassword: {
        type: String,
        require: true
    },
    createTime: {
        type: Date,
        require: true
    },
    editTime: Date, 
    articles: [String], // Article _id
    reviews: [String] // review_id
});

const Article = mongoose.model("Article", {
    title: {
        type: String,
        require: true,
        minlength: [5, "标题不能少于5个字"],
        maxlength: [30, "标题不能多于30个字"]
    },
    body: String,
    liked: {
        type: Number,
        default: 0
    },
    createTime: Date,
    editTime: Date,
    author: String // user.name
});

const Review = mongoose.model("Review", {
    body: {
        type: String,
        require: true,
        minlength: [5, "留言不能少于5个字"],
        maxlength: [100, "留言不能多于100个字"]
    },
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
    picAddress: String,
    description: {
        type: String,
        require: true,
        // match: [//, "包含中文，英文，数字，下划线，不能输入括号，不能以数字开头"],
        minlength: [10, "产品描述不能少于10个字符"]
    },
    price: {
        type: String,
        require: true,
        match: [/[1-9]\d*/, "价格只能是数字且开头不能为0"]
    },
    createTime: {
        type: Date,
        require: true
    },
    editTime: Date
})
module.exports = {
    User,
    Article,
    Review,
    Product
};