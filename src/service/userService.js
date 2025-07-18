import userDao from "../dao/userDao.js"
import { UserInfoDto } from "../dto/userInfo.dto.js"
// token 生成和校验
import { sign } from "../common/utils/jwt.js"
import Result from "../common/config/result.js"
import path from "path"
import fs from 'fs'

class userService {
    // 登陆
    async login (condition, req) {
        // 校验数据。。。。。。
        // 校验验证码
        console.log('req.session===>', req.session)
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
        // ------------ 根据查询的数据返回
        if (info) {
            // let userInfo = new userInfoDto(info)
            userInfo = UserInfoDto.fromDataBase(info)
            // 生成 token
            let jwtToken = sign({name: userInfo.name, openid: userInfo.openid})
            apiRes = Result.success({
                code: 0,
                data: userInfo,
                token: jwtToken
            })
        } else {
            apiRes = Result.success({
                code: 1,
                message: '用户名或密码错误'
            })
        }
        return apiRes
    }

    // 获取最新用户信息
    async getUserInfoByUserName(condition, req) {
        // 查询到的数据
        let info = await userDao.getUserInfoByUserName(condition)
        if (info) {
            return Result.success({
                code: 0,
                data: UserInfoDto.fromDataBase(info)
            })
        } else {
            return Result.success({
                code: 1,
                message: '用户信息查询失败'
            })
        }
    }

    // 上传头像
    async uploadPortrait (condition, req) {
        let info = await userDao.uploadPortrait(condition)
        if (info.updateResult) {
            const oldFile = path.join(global.ROOT_PATH_FILES, 'portrait', info.oldUserInfo.portrait )
            // fs.unlink(<要删除的文件路径>, <失败后的回调函数>)
            fs.unlink(oldFile, (err) => {
                if (err) console.error('删除文件失败', err);
            })
            return Result.success({
                code: 0,
                message: '上传成功！'
            })
        } else {
            return Result.success({
                code: 0,
                message: '上传失败！'
            })
        }
    }
}

export default new userService()