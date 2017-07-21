/**
 * Created by Administrator on 2017/7/20.
 */
var express = require('express');
var router = express.Router();
var MongoClient = require("mongodb").MongoClient;
/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('register', {link: "/register/addUser"});
});
router.post('/addUser', function (req, res, next) {
    // res.send(req.body);
    var userName = req.body.username,
        passWord = req.body.password;
    if (!userName || !passWord) {
        res.send("请输入完整信息");
        return;
    }
    // MongoClient.connect("mongodb://127.0.0.1:27017/expressDB", function (err, db) {
    //     var table = db.collection("users");
    //     table.save({username: userName, password: passWord}, function (err, log) {
    //         if (err) {
    //             res.send("注册失败");
    //         } else {
    //             res.send("注册成功");
    //         }
    //         db.close();
    //     });
    // });
    MongoClient.connect("mongodb://127.0.0.1:27017/expressDB", function (err, db) {
        var table = db.collection("users");
        table.find({username: userName}).toArray(function (err, result) {
            if (result.length) {
                res.send("该用户名已被注册");
            } else {
                table.save({username: userName, password: passWord}, function (err, log) {
                    if (err) {
                        res.send("注册失败");
                    } else {
                        res.redirect("/");
                    }
                });
            }
            db.close();
        });
    });
});
module.exports = router;