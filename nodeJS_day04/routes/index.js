var express = require('express');
var router = express.Router();
var MongoClient = require("mongodb").MongoClient;
var pageSize = 10;
var pageNum = 1;
/* GET home page. */
router.get('/', function (req, res, next) {
    var page = req.query.page ? req.query.page : 1;
    MongoClient.connect("mongodb://127.0.0.1:27017/expressDB", function (err, db) {
        var tables = db.collection("comment");
        tables.find().limit(pageSize).skip((page - 1) * 10).toArray(function (err, result) {
            tables.find().count(function (err, totalNum) {
                pageNum = Math.ceil(totalNum / pageSize);
                res.render('index', {
                    result: result,
                    pagenum: pageNum,
                    login: req.session.login,
                    userName: req.session.username,
                    avatar: req.session.avatar
                });
                db.close();
            });

        });
    });


});

module.exports = router;
