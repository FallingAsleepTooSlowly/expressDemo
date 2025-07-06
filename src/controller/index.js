/* 此文件用于导入所有的路由 */
const router = require("express").Router()

// router.use("/user", require("./userController"))
router.use(require("./userController"))
router.use(require("./filesController"))

module.exports = router