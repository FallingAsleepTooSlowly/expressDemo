/* 日志中间件 morgan 的配置和使用 */

import morgan from "morgan"
import fs from "fs"
import path from "path"
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// __dirname 指当前 js 文件的绝对路径
let accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })

export default morgan(
    // 设置记录内容为： 请求IP，方法，状态，路径，响应时间
    "请求IP：:remote-addr  方法：:method  状态：:status  路径：:url  响应时间：:response-time  ms",
    // 设置记录的路径和文件名
    { stream: accessLogStream }
)