/* 上传文件相关接口 */

const uploadController = require("express").Router()
// token 生成和校验
const jwt = require("../common/utils/jwt")
// fs-extra 是 fs 的扩展
const fs = require("fs-extra")
const { checkFileSize } = require("../common/utils/middleKey")
const Result = require("../common/models/result")

// 每个对路由 '/upload' 的请求都会经过这里
uploadController.all("/upload/*", jwt.verify(), (req, res, next) => {
    console.log('is in upload')
    next()
})

// 上传大文件接口
uploadController.post("/upload/uploadFile", async (req, res, next) => {
    try {
        res.send(Result.success({
            code: 0,
            data: '校验接口'
        }))
    } catch (err) {
        next(err)
    }
    // 确保目录存在，如果目录结构不存在，它将由该函数创建
    // fs.ensureDirSync(tempPath)
    // fs.ensureDirSync(folderDefinePath(req.body.id))
})

module.exports = uploadController