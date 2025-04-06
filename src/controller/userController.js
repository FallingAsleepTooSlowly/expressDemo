const userController = require("express").Router()
const userService = require("../service/userService")
// token 生成和校验
const jwt = require("../common/utils/jwt")
// const userclass = require("../class/userClass")
const Result = require("../common/models/result")
const WXBizDataCrypt = require("../common/utils/WXBizDataCrypt")

const axios = require("axios")
// 单独配置一些默认参数
axios.defaults.timeout = 10000      // 设置超时时间为10秒
axios.defaults.headers.post['Content-Type'] = 'application/json'        // 设置请求头为 json 格式

// 每个对路由 '/user' 的请求都会经过这里
userController.all('/user/*', (req, res, next) => {
    console.log('is cross user!!!!!!')
    next()
})

// 用户登陆接口
userController.post("/user/login", async (req, res) => {
    var info = await userService.login(req.body)
    if (info) {
        // 生成 token
        let jwtToken = jwt.sign({name: info.name, password: info.password})
        console.log("jwtToken====>", jwtToken)
        res.send(Result.success({
            code: 0,
            data: info,
            token: jwtToken
        }))
    } else {
        res.send(Result.success({
            code: 1,
            data: info
        }))
    }
})

// 校验 token 接口
// 在回调函数前加入校验 token 的方法
userController.get("/user/checkToken", jwt.verify(), async (req, res) => {
    // console.log('ctx===>', ctx)
    res.send(Result.success({
        code: 0,
        data: '校验接口'
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