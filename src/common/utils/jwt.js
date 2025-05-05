/* 使用 jsonwebtoken 生成 token */

const jwt = require('jsonwebtoken')
const Result = require("../models/result")

// sign 用于生成 token，666 用于加密的私钥可以自行定义
function sign(option) {
    // 参数：sign(<用于加密的信息>, <加密口令（解密时需要）>, <加密的参数>)
    return jwt.sign(option, 'danbao', {
        // 过期时间，当前设定过期时间在600秒之后
        expiresIn: 600
    })
}

// token 校验
let verify = (isAdmin) => (req, res, next) => {
    // 获取到前端传递过来的 token
    let token = req.headers.token
    // console.log('token====>', token)
    if (token) {
        // 参数：verify()
        jwt.verify(token, 'danbao', function(err, decoded) {
            // 判断 token 是否失效
            if (err) {
                res.send(Result.error('token失效'))
            } else {
                // // 判断当前接口是否需要管理员权限
                // if (isAdmin) {
                //     // 获取到解密后的信息，这里用来判断解密后的用户信息是否是管理员
                //     let { admin } = decoded
                //     if (admin) {
                //         next()
                //     } else {
                //         ctx.body = {
                //             status: 401,
                //             message: '你不是管理员，权限不够！'
                //         }
                //     }
                // } else {
                //     next()
                // }
                // console.log('decoded====>', decoded)
                next()
            }
        })
    } else {
        res.send(Result.error('请提供token'))
    }
}

module.exports = {
    sign,
    verify
}