/* 此文件用于启用，启动方式为 nodemon app */
const app = require("./src")
const Result = require("./src/common/models/result")
const port = 9000

// 记录启动速度
// console.time(`Service http://localhost:${port} Start Time`);

// 处理未捕获的 Promise 拒绝
process.on('unhandledRejection', (reason, promise) => {
    console.error('未处理的 Promise 拒绝:', reason);
    // throw new Error('ererererrerererereer')
    next()
})
// 处理未捕获的异常
process.on('uncaughtException', (err) => {
    console.error('未捕获的异常:', err);
    // process.exit() 用来以参数的退出状态同步终止进程
    // process.exit(500)
})


// 全局错误处理中间件（需将错误抛出才捕获的到）
app.use((err, req, res, next) => {
    console.error("捕获到错误:", err.stack);
    //   res.status(500).send("服务器内部错误");
    res.send(Result.error({
        message: '服务器内部错误'
    }))
})

app.listen(port, () => {
    // console.timeEnd(`Service http://localhost:${port} Start Time`);
    console.log(`listening on port ${port}`)
})