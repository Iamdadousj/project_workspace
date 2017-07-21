/**
 * Created by Administrator on 2017/7/20.
 */
var express = require('express');
var router = express.Router();
var MongoClient = require("mongodb").MongoClient;
/* GET home page. */
router.get('/', function (req, res, next) {
    // res.send("开始评论");
    res.render('comment');
});
router.get('/addComment', function (req, res, next) {
    var content = req.query.content;
    if (!content) {
        res.send("评论内容不能为空");
        return;
    }
    MongoClient.connect("mongodb://127.0.0.1:27017/expressDB", function (err, db) {
        var tables = db.collection("comment");
        tables.save({content: content}, function (err, log) {
            // !err && res.send("留言成功");
            !err && res.render('loginResult', {result: '评论成功'});
        });
        db.close();
    });
});

module.exports = router;
