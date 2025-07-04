/* 上传文件相关接口 */

const uploadController = require("express").Router()
// token 生成和校验
const jwt = require("../common/utils/jwt")
const { customizedStorage, diskUploadFile, chunkFileUpload } = require("../middleware/upload")
const Result = require("../common/config/result")
const uploadService = require("../service/uploadService")
const { port } = require("../common/config/constant")
const multer = require("multer")
const axios = require("axios")

// 单独配置一些默认参数
axios.defaults.timeout = 10000      // 设置超时时间为10秒
axios.defaults.headers.post['Content-Type'] = 'application/json'        // 设置请求头为 json 格式

// 每个对路由 '/upload' 的请求都会经过这里
uploadController.all("/upload/*", jwt.verify(), (req, res, next) => {
    next()
})

// 上传文件接口（暂未使用）
uploadController.post("/upload/uploadFile", multer({ storage: customizedStorage }).single('file'), async (req, res, next) => {
    try {
        let apiRes = await uploadService.uploadFile(req.body, req)
        res.send(apiRes)
    } catch (err) {
        next(err)
    }

    // 接口之间互相调用
    // const response = await axios.post(`http://localhost:${port}/upload/uploadBigFile`, req.body)
})

// 上传单一文件接口
uploadController.post("/upload/uploadSingleFile", diskUploadFile.single('file'), async (req, res, next) => {
    try {
        res.send(Result.success({
            code: 0,
            data: '上传单一文件接口'
        }))
    } catch (err) {
        next(err)
    }
})

// 上传多个文件接口
uploadController.post("/upload/uploadMultipleFiles", diskUploadFile.array('file', 5), async (req, res, next) => {
    try {
        res.send(Result.success({
            code: 0,
            data: '上传多个文件接口'
        }))
    } catch (err) {
        next(err)
    }
})

// 分段上传文件接口
uploadController.post("/upload/uploadChunkFile", async (req, res, next) => {
    try {
        chunkFileUpload.single('file')(req, res, (err) => {
            if (err) {
                next(err)
            } else {
                res.send(Result.success({
                    code: 0,
                    data: '分段文件上传成功'
                }))
            }
        })
    } catch (err) {
        next(err)
    }
})

// 将分段上传的文件合并
uploadController.post("/upload/mergeChunkFile", chunkFileUpload.none(), async (req, res, next) => {
    try {
        let apiRes = await uploadService.mergeChunkFile(req.body, req)
        res.send(apiRes)
    } catch (err) {
        next(err)
    }
})

module.exports = uploadController