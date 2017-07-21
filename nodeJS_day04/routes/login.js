/**
 * Created by Administrator on 2017/7/20.
 */
var express = require('express');
var router = express.Router();
var MogonClient = require("mongodb").MongoClient;
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var fs = require("fs");

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('register', {link: '/login/checkUser'});
});
router.get('/logout', function (req, res, next) {
    req.session = null;
    res.redirect("/");
});


router.get('/addAvatar', function (req, res, next) {
    res.render("addAvatar");
});
router.post('/uploadAvatar', multipartMiddleware, function (req, res, next) {
    // res.render("addAvatar");
    console.log(req.files);
    var time = new Date().getTime();
    console.log(time);
    var avatarPath = req.files.avatar.path;
    var avatarName = req.files.avatar.name;

    var path = "/images/" + time + "_" + avatarName;
    fs.rename(avatarPath, "./public" + path, function (err) {
        if (!err) {
            console.log("ok");
            MogonClient.connect("mongodb://127.0.0.1:27017/expressDB", function (err, db) {
                var tables = db.collection("users");
                tables.update({username: req.session.username}, {
                    $set: {avatar: path}
                }, function (err) {
                    if (!err) {
                        req.session.avatar = path;
                        res.render('loginResult', {result: '上传成功'});
                    } else {
                        res.render('loginResult', {result: '上传失败'});
                        // res.send("上传失败");
                    }
                    db.close();
                });
            });
        } else {
            res.send("图片操作失败");
        }
    });
});

router.post('/checkUser', function (req, res, next) {
    var userName = req.body.username;
    var passWord = req.body.password;
    if (!userName || !passWord) {
        res.send("输入完整数据");
    }
    MogonClient.connect("mongodb://127.0.0.1:27017/expressDB", function (err, db) {
        var tables = db.collection("users");
        tables.find({username: userName, password: passWord}).toArray(function (err, result) {
            if (result.length) {
                req.session.login = true;
                req.session.username = result[0].username;
                req.session.avatar = result[0].avatar;
                res.render('loginResult', {result: '登陆成功'});
                // res.send("登陆成功");
            } else {
                res.render('loginResult', {result: '登陆失败'});
                // res.send("登录失败");
            }
        });
        db.close();
    });
});
module.exports = router;

