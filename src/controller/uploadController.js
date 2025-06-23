/* 上传文件相关接口 */

const uploadController = require("express").Router()
// token 生成和校验
const jwt = require("../common/utils/jwt")
// fs-extra 是 fs 的扩展
const fs = require("fs-extra")
const { memoryUploadFile } = require("../common/utils/middleKey")
const Result = require("../common/models/result")
const { port } = require("../common/config/constant")
const axios = require("axios")

// 单独配置一些默认参数
axios.defaults.timeout = 10000      // 设置超时时间为10秒
axios.defaults.headers.post['Content-Type'] = 'application/json'        // 设置请求头为 json 格式

// 每个对路由 '/upload' 的请求都会经过这里
uploadController.all("/upload/*", jwt.verify(), (req, res, next) => {
    console.log('is in upload')
    next()
})

// 上传文件接口
uploadController.post("/upload/uploadFile", async (req, res, next) => {
    try {
        console.log('reqreqreqreq===>', req.file)
        // 文件大小超过 40 MB 时判断是大文件
        if (req.file.size > 41943040) {
            const response = await axios.post(`http://localhost:${port}/upload/uploadBigFile`, req.body)
            console.log("upload/uploadFile====>", response)
            res.send(Result.success({
                code: 0,
                data: '这是大文件'
            }))
        } else {
            res.send(Result.success({
                code: 0,
                data: '这是小文件'
            }))
        }
    } catch (err) {
        next(err)
    }
    // 确保目录存在，如果目录结构不存在，它将由该函数创建
    // fs.ensureDirSync(tempPath)
    // fs.ensureDirSync(folderDefinePath(req.body.id))
})

// 上传大文件接口
uploadController.post("/upload/uploadBigFile"), memoryUploadFile.single("file"), async (req, res, next) => {
    return {
        data: 33333
    }
}

module.exports = uploadController