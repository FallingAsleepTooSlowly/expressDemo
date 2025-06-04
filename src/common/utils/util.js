const multer = require("multer")

// 上传文件的自定义中间件
function uploadFile (req, res, next) {
    let upload = multer({dest: './uploadFiles/'}).single("file")
    upload(req, res, (err) => {
        console.log('file=====>', req.file)
        if (err) {
            return Result.success({
                code: 1,
                message: err
            })
        } else {
            req.body.file = req.file.filename
            next()
        }
    })
}

module.exports = {
    uploadFile
}