const userController = require("express").Router()
const userService = require("../service/userService")
// token 生成和校验
const jwt = require("../common/utils/jwt")
// const userclass = require("../class/userClass")
const Result = require("../common/models/result")
// 生成验证码
const svgCaptcha = require("svg-captcha")
// multer 用于将本地文件/图片上传到服务器指定目录
const multer = require("multer")
// 微信小程序数据解密方法（未使用或是已舍弃）
const WXBizDataCrypt = require("../common/utils/WXBizDataCrypt")
const { uploadFile } = require("../common/utils/util")
const md5 = require("md5-node")
const axios = require("axios")

// 单独配置一些默认参数
axios.defaults.timeout = 10000      // 设置超时时间为10秒
axios.defaults.headers.post['Content-Type'] = 'application/json'        // 设置请求头为 json 格式

// 每个对路由 '/user' 的请求都会经过这里
userController.all('/user/*', (req, res, next) => {
    // console.log('is cross user!!!!!!')
    next()
})

// 用户登陆接口
userController.post("/user/login", async (req, res) => {
    var apiRes = await userService.login(req.body, req)
    res.send(apiRes)
    // var info = await userService.login(req.body)
    // if (info) {
    //     // 生成 token
    //     let jwtToken = jwt.sign({name: info.name, password: info.password})
    //     res.send(Result.success({
    //         code: 0,
    //         data: info,
    //         token: jwtToken
    //     }))
    // } else {
    //     res.send(Result.success({
    //         code: 1,
    //         message: '用户名或密码错误',
    //     }))
    // }
})

// 上传头像接口
userController.post("/user/uploadPortrait", uploadFile, async (req, res) => {
    console.log('uploadPortrait===>', req.body)
    res.send(Result.success({
        code: 0,
        message: '上传成功！'
    }))
})

// 校验 token 接口
// 在回调函数前加入校验 token 的方法
userController.get("/user/checkToken", jwt.verify(), async (req, res) => {
    res.send(Result.success({
        code: 0,
        data: '校验接口'
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
    console.log('????===>', req.session)
    // 设置响应的类型
    res.type('svg')
    res.send(Result.success({
        code: 0,
        data: cap.data
    }))
})


/* -------------------- 接口示例 ------------------ */
// get 接口例子
userController.get("/get", async (req, res) => {
    var info = await userService.getUserList()
    console.log('userclass===>', info)
    // res.send(Result.success(await userService.getUserList()))
    res.send(Result.success(info))
    // res.json(userclass)
})

// post 接口例子
userController.post("/post", async (req, res) => {
    // // req.body 是入参
    // res.send(Result.success(await req.body))
    var info = await userService.getUserListByParams(req.body)
    res.send(Result.success(info, '1234'))
})

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