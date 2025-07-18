/* 此文件用于引用 */
import express from "express"
import cors from "cors"  // 引入cors模块
import Result from "./common/config/result.js"
import path from 'path'
import { staticMiddleware } from "./middleware/index.js"
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import morgan from "./common/utils/morgan.js"
import controller from "./controller/index.js"

// ------------------ 验证码相关
// svg-captcha 验证码插件依赖 session 存储验证码信息，session 的认证机制依赖 cookie
import session from "express-session"
import cookieParser from "cookie-parser"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()

app.use(cookieParser())
// 定义 cookie 解析器，位置需写在路由分配前
app.use(session({
    // 对 session id 相关的 cookie 进行签名
    secret: 'ganhuan',
    // 每次请求是否都重新设置 session cookie
    resave: true,
    // 是否保存未初始化的会话
    saveUninitialized: false,
    cookie: {
        // 设置 session 的有效时间，单位毫秒
        maxAge: 1000 * 60,
    },
    // 是否回滚
    rolling: true,
    // key 名，默认为 connect.id
    name: "session"
}))
// ------------------

// 配置 cors（允许跨域携带凭证，前端如果允许跨域后这里就不用配置了）
// app.use(cors({
//     // 你的前端地址
//     // origin: 'http://localhost:9999',
//     origin: 'http://192.168.132.242:9999',
//     // 是否允许携带 cookie（在此处和前端配置跨域允许请求中携带 cookie 后就能传输 session）
//     credentials: true   
// }))

/* 
*   express 开发初期，目的在于轻量级，从而舍弃了部分功能，而解析POST请求便被舍弃了，故而在4.x以前，一般使用body-parser来解析
*   但在 Express 4.x 以后的版本，body-parser 已经内置于 Express 框架中。
*/ 
/* 4.x 以前的版本使用 body-parser 解析 post 的写法 */
// import bodyParser from "body-parser"
// app.use(bodyParser.json(), bodyParser.urlencoded({ extended: true }))   // 解析 post

/* 内置 body-parser 解析 post 的写法 */
// 使用 express.json() 中间件来解析 JSON 格式的请求体
// 使用 express.urlencoded() 中间件来解析 URL 编码的请求体
app.use(express.json(), express.urlencoded({ extended: true }))   // 解析 post

// 使用日志中间件 morgan 记录请求日志，注意，日志中间件的导入需要在路由前，express 的设计是一层层往下走的，中间件的使用顺序在此比较重要
app.use(morgan)

// 路由分离
app.use("/", controller)

// 静态文件访问路径设置
app.use('/static', staticMiddleware, express.static(path.join(__dirname, '../files')))


// 全局错误处理中间件（需将错误抛出才捕获的到）
app.use((err, req, res, next) => {
    console.log('全局错误处理====>', err)
    res.send(Result.error({
        message: '服务器内部错误',
        reason: err.message
    }))
})

export default app