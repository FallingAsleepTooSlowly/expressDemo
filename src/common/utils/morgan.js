/* 日志中间件 morgan 的配置和使用 */

const morgan = require("morgan")
const fs = require("fs")
const path = require("path")

// __dirname 指当前 js 文件的绝对路径
let accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })

module.exports = morgan(
    // 设置记录内容为： 请求IP，方法，状态，路径，响应时间
    "请求IP：:remote-addr  方法：:method  状态：:status  路径：:url  响应时间：:response-time  ms",
    // 设置记录的路径和文件名
    { stream: accessLogStream }
)