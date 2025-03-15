class User {
    // 定义一个构造函数
    constructor (id, name, email, orders = []) {
        this.id = id
        this.name = name
        this.email = email
        this.orders = orders       // 初始化为空数组，稍后将填充订单
    }
}

module.exports = User