const userDao = require("../dao/userDao")
const userInfoDto = require("../dto/userInfo.dto")
// token 生成和校验
const jwt = require("../common/utils/jwt")
const Result = require("../common/models/result")

class userService {
    
    async getUserList () {
        return await userDao.getUserList()
    }

    async getUserListByParams (condition, req) {
        return await userDao.getUserListByParams(condition)
    }

    // 登陆
    async login (condition, req) {
        // 校验数据。。。。。。
        // 校验验证码
        const captcha = condition.captcha
        if (!captcha) {
            return Result.success({
                code: 1,
                message: '请输入验证码'
            })
        } else if (!req.session.captcha) {
            return Result.success({
                code: 1,
                message: '验证码已过期'
            })
        }
        if (captcha.toLowerCase() !== req.session.captcha.toLowerCase()) {
            return Result.success({
                code: 1,
                message: '验证码错误',
            })
        }

        // 查询到的数据
        let info = await userDao.login(condition)
        // 封装类的数据
        let userInfo = null
        // 返回的数据
        let apiRes = null
        console.log('login info=====>', info)
        // ------------ 根据查询的数据返回
        if (info) {
            // let userInfo = new userInfoDto(info)
            userInfo = userInfoDto.UserInfoDto.fromDataBase(info)
            console.log('userInfo=====>', userInfo)
            // 生成 token
            let jwtToken = jwt.sign({name: userInfo.name, openid: userInfo.openid})
            apiRes = Result.success({
                code: 0,
                data: userInfo,
                token: jwtToken
            })
        } else {
            apiRes = Result.success({
                code: 1,
                message: '用户名或密码错误',
            })
        }
        return apiRes
    }
}

module.exports = new userService()