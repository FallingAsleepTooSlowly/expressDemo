/* 此文件用于导入所有的路由 */
const router = require("express").Router()

router.use("/user", require("./userController"))

module.exports = router