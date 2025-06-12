/* 封装返回处理好的数据 */
class Result {
    // 定义一个构造函数
    constructor (data) {
        // this.code = data.code
        // this.message = data.message
        // this.data = data.data
        // this.token = data.token

        // 使用 lodash 的 pick 函数筛选想要的字段，再用 Object.assign 将对象中所有可枚举的自有属性复制出来
        var _ = require('lodash')
        const needFields = ['code', 'message', 'data', 'token', 'reason']
        Object.assign(this, _.pick(data, needFields))
    }
    // 成功
    static success (info) {
        return new Result({
            code: info.code || info.code === 0 ? info.code : 200,
            message: info.message ? info.message : "success",
            data: info.data,
            token: info.token
        })
    }
    // 异常
    static error (info) {
        return new Result({
            code: 500,
            message: info.message,
            data: null,
            reason: info.reason
        })
    }

    // 相关服务
    static Redis () {
        return new Result({
            code: 500,
            message: "Redis错误",
            data: null
        })
    }
    static Db () {
        return new Result({
            code: 500,
            message: "数据库错误",
            data: null
        })
    }
}

module.exports = Result