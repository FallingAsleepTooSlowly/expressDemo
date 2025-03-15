class User {
    // 定义一个构造函数
    constructor ({openid, name}) {
        this.openid = openid
        this.name = name
    }
}

module.exports = new User()