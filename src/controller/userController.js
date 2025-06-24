/* 用户信息相关接口 */

const userController = require("express").Router()
const userService = require("../service/userService")
// token 生成和校验
const jwt = require("../common/utils/jwt")
// const userclass = require("../class/userClass")
const Result = require("../common/config/result")
// 生成验证码
const svgCaptcha = require("svg-captcha")
// multer 用于将本地文件/图片上传到服务器指定目录
const multer = require("multer")
// 微信小程序数据解密方法（未使用或是已舍弃）
const WXBizDataCrypt = require("../common/utils/WXBizDataCrypt")
const { uploadPortrait } = require("../middleware/upload")
const md5 = require("md5-node")
const axios = require("axios")

// 单独配置一些默认参数
axios.defaults.timeout = 10000      // 设置超时时间为10秒
axios.defaults.headers.post['Content-Type'] = 'application/json'        // 设置请求头为 json 格式

// 每个对路由 '/user' 的请求都会经过这里
userController.all('/user/*', jwt.verify(), (req, res, next) => {
    next()
})

// 用户登陆接口
userController.post("/user/login", async (req, res, next) => {
    try {
        let apiRes = await userService.login(req.body, req)
        res.send(apiRes)
    } catch (err) {
        next(err)
    }
})

// 获取最新用户信息
userController.post("/user/getUserInfoByUserName", async (req, res, next) => {
    try {
        let apiRes = await userService.getUserInfoByUserName(req.body, req)
        res.send(apiRes)
    } catch (err) {
        next(err)
    }
})

// 上传头像接口
userController.post("/user/uploadPortrait", uploadPortrait.single("file"), async (req, res, next) => {
    console.log('/user/uploadPortrait=======>', req.file)
    // res.send(Result.success({
    //     code: 0,
    //     data: '错了错了！！'
    // }))
    try {
        let apiRes = await userService.uploadPortrait(req.body, req)
        res.send(apiRes)
    } catch (err) {
        next(err)
    }
})

// 校验 token 接口
// 在回调函数前加入校验 token 的方法
userController.get("/user/checkToken", jwt.verify(), async (req, res) => {
    res.send(Result.success({
        code: 0,
        data: '校验接口'
    }))
})

userController.get("/test", async (req, res) => {
    console.log('testtesttesttesttest')
    res.send(Result.success({
        code: 0,
        data: '校验接口成功！！！'
    }))
})

// 获取验证码
userController.get("/user/getSvg", async (req, res) => {
    const cap = svgCaptcha.create({
        // 是否翻转颜色
        inverse: false,
        // 字体大小
        fontSize: 36,
        // 噪声线条数
        noise: 3,
        // 宽度
        width: 120,
        // 高度
        height: 40,
        // 是否有背景色
        // color: false,
        // 忽略较难分辨的相似字符
        ignoreChars: 'o01il'
    })
    // session 存储验证码数值
    req.session.captcha = cap.text
    // 设置响应的类型
    res.type('svg')
    res.send(Result.success({
        code: 0,
        data: cap.data
    }))
})


/* -------------------- 接口示例 ------------------ */

// 解密微信小程序数据
userController.post("/decryptWxData", async (req, res) => {
    var pc = new WXBizDataCrypt(req.body.appId, req.body.sessionKey)
    var data = pc.decryptData(req.body.encryptedData , req.body.iv)
    res.send(Result.success(data))
})

// 获取微信小程序 openid
userController.post("/jscode2session", async (req, res) => {
    axios.get('https://api.weixin.qq.com/sns/jscode2session?appid=' + req.body.appID + '&secret=' + req.body.appSecret + '&js_code=' + req.body.code + '&grant_type=authorization_code')
        .then(response => {
            res.send(Result.success(response.data))
        })
        .catch(error => {
            res.send(Result.error(error))
        })
})

module.exports = userController