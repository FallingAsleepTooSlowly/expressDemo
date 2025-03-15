// 引用了 user 类的订单类
class Order {
    constructer (id, userId, product, quantity, price, user = null) {
        this.id = id
        this.userId = userId
        this.product = product
        this.quantity = quantity
        this.price = price
        this.user = user           // 初始化为 null，稍后将填充用户信息
    }

    setUser (user) {
        this.user = user
    }
}

module.exports = Order