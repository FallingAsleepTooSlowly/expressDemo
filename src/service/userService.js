const userDao = require("../dao/userDao")

class userService {
    
    async getUserList () {
        return await userDao.getUserList()
    }

    async getUserListByParams (condition) {
        return await userDao.getUserListByParams(condition)
    }

    async login (condition) {
        return await userDao.login(condition)
    }
}

module.exports = new userService()