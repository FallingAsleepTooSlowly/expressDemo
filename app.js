/* 此文件用于启用，启动方式为 nodemon app */
import app from "./src/index.js"
import { port } from "./src/common/config/constant.js"
import path from "path"
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// 记录启动速度
// console.time(`Service http://localhost:${port} Start Time`);

// ------------------ 备用报错处理方案
// 处理未捕获的 Promise 拒绝
process.on('unhandledRejection', (reason, promise) => {
    console.error('未处理的 Promise 拒绝:', reason);
})
// 处理未捕获的异常
process.on('uncaughtException', (err) => {
    console.error('未捕获的异常:', err);
    // process.exit() 用来以参数的退出状态同步终止进程
    // process.exit(500)
})
// ------------------

// 将根目录直接添加在全局变量中
global.ROOT_PATH = path.resolve(__dirname)
// 将带 files 文件夹的目录添加在全局变量中
global.ROOT_PATH_FILES = path.resolve(__dirname, 'files')
// 将临时文件夹的目录添加在全局变量中
global.ROOT_PATH_TEMP = path.resolve(__dirname, 'files/temp')


app.listen(port, () => {
    // console.timeEnd(`Service http://localhost:${port} Start Time`);
    console.log(`listening on port ${port}`)
})