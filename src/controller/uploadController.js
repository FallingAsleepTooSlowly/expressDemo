/* 上传文件相关接口 */

const uploadController = require("express").Router()
// token 生成和校验
const jwt = require("../common/utils/jwt")
// fs-extra 是 fs 的扩展
const fs = require("fs-extra")
const path = require("path")
const { customizedStorage, diskUploadFile, chunkFileUpload, tempPath, folderDefinePath } = require("../middleware/upload")
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

// 上传文件接口
uploadController.post("/upload/uploadFile", multer({ storage: customizedStorage }).single('file'), async (req, res, next) => {
    try {
        let apiRes = await uploadService.uploadFile(req.body, req)
        res.send(apiRes)
    } catch (err) {
        next(err)
    }
    // 确保目录存在，如果目录结构不存在，它将由该函数创建
    // fs.ensureDirSync(tempPath)
    // fs.ensureDirSync(folderDefinePath(req.body.id))

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

// 合并分段上传的文件内
uploadController.post("/upload/mergeChunkFile", chunkFileUpload.none(), async (req, res, next) => {
    try {
        // 包含扩展的文件名，也是合并后的文件名
        let reqName = req.body.name
        // 获取到不包含扩展的文件名
        let fname = req.body.name.split('.')[0]
        // 获取到分段文件的路径，path.join() 用于合并成一个可使用的新路径，斜杠或改成需要的反斜杠？
        let chunkDir = path.join(tempPath, fname)

        // 获取指定目录里的文件，这里使用同步读取方法以防文件合并顺序混乱
        let chunks = fs.readdirSync(chunkDir)
        // 对数组的元素进行排序，然后再按顺序逐一处理，这里用的是文件夹默认的升序，即递增
        chunks.sort((a, b) => a - b).map(chunkName => {
            // 用于将数据添加到指定文件中
            fs.appendFileSync(
                // 指定的文件，即合并后的文件
                path.join(folderDefinePath(req.body.id), reqName),
                // 用于读取文件并返回其内容，这里是添加的数据，即每一块的文件
                fs.readFileSync(`${chunkDir}/${chunkName}`)
            )
        })

        // 合并完文件后删除临时文件夹
        fs.removeSync(chunkDir)
        res.send(Result.success({
            code: 0,
            data: '文件上传成功'
        }))
    } catch (err) {
        next(err)
    }
})

module.exports = uploadController