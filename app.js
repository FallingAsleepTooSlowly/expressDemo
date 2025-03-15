/* 此文件用于启用 */
const app = require("./src")
const port = 9000

// 记录启动速度
// console.time(`Service http://localhost:${port} Start Time`);

app.listen(port, () => {
    // console.timeEnd(`Service http://localhost:${port} Start Time`);
    console.log(`listening on port ${port}`)
})