const userDao = require("../dao/userDao")
const userInfoDto = require("../dto/userInfo.dto")

class userService {
    
    async getUserList () {
        return await userDao.getUserList()
    }

    async getUserListByParams (condition) {
        return await userDao.getUserListByParams(condition)
    }

    // 登陆
    async login (condition) {
        let info = await userDao.login(condition)
        console.log('login info=====>', info)
        info.roles = ['admin']
        info.portrait = 'xxxxxx'
        // let resInfo = new userInfoDto(info)
        let resInfo = userInfoDto.UserInfoDto.fromDataBase(info)
        console.log('resInfo=====>', resInfo)
        return resInfo
    }
}

module.exports = new userService()