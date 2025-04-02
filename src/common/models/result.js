/* 封装返回处理好的数据 */
class Result {
    // 定义一个构造函数
    constructor (code, message, data, token) {
        this.code = code
        this.message = message
        this.data = data
        this.token = token
    }
    // 成功
    static success (data, token) {
        return new Result(200, "success", data, token)
    }
    // 异常
    static error (message) {
        return new Result(500, message, null)
    }

    // 相关服务
    static Redis () {
        return new Result(500, "Redis错误", null)
    }
    static Db () {
        return new Result(500, "数据库错误", null)
    }
}

module.exports = Result