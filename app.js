/* 此文件用于启用，启动方式为 nodemon app */
const app = require("./src")
const { port } = require("./src/common/config/constant")

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


app.listen(port, () => {
    // console.timeEnd(`Service http://localhost:${port} Start Time`);
    console.log(`listening on port ${port}`)
})