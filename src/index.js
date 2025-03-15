/* 此文件用于引用 */
const express = require("express")
const app = require("express")()
const cors = require("cors")  // 引入cors模块

app.use(cors())  // 注入cors模块解决跨域

/* 
*   express 开发初期，目的在于轻量级，从而舍弃了部分功能，而解析POST请求便被舍弃了，故而在4.x以前，一般使用body-parser来解析
*   但在 Express 4.x 以后的版本，body-parser 已经内置于 Express 框架中。
*/ 
/* 4.x 以前的版本使用 body-parser 解析 post 的写法 */
// const bodyParser = require("body-parser")
// app.use(bodyParser.json(), bodyParser.urlencoded({ extended: true }))   // 解析 post

/* 内置 body-parser 解析 post 的写法 */
// 使用 express.json() 中间件来解析 JSON 格式的请求体
// 使用 express.urlencoded() 中间件来解析 URL 编码的请求体
app.use(express.json(), express.urlencoded({ extended: true }))   // 解析 post

// 使用日志中间件 morgan 记录请求日志，注意，日志中间件的导入需要在路由前，express 的设计是一层层往下走的，中间件的使用顺序在此比较重要
app.use(require("./common/utils/morgan"))

// app.get('/', (req, res) => {
//     res.send('222222')
// })

// 路由分离
app.use("/", require("./controller"))

module.exports = app