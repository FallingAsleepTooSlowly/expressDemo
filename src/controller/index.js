/* 此文件用于导入所有的路由 */
import express from "express"
import userController from "./userController.js"
import filesController from "./filesController.js"

const router = express.Router()

// router.use("/user", userController)
router.use(userController)
router.use(filesController)

export default router