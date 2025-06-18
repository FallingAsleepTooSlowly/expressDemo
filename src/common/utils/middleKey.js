// multer 用于将本地文件/图片上传到服务器指定目录
const multer = require("multer")
const Result = require("../models/result")

// 上传文件的自定义中间件
function uploadPortrait (req, res, next) {
    /*
        multer(options).single(fieldname);
        single 代表只能上传一个文件，fieldname 为上传时文件的字段名称（下方使用时的字段名称）
        例：multer({dest: './portrait'}).single("file");

        multer(options).array(fieldname, [maxCount]);
        array 代表一次能上传多个文件，maxCount 为上传的最大数量
        例：multer({dest:"./attachment"}).array("photo",3);

        multer(options).fields(fields);
        适用于上传多个字段的情况。接受指定 fields 的混合文件。这些文件的信息保存在 req.files。fields 是一个对象数组，具有 name 和可选的 maxCount 属性。
        例：
        let fieldsList=[
            {name:"photo1"},
            {name:"photo2",maxCount:2}
        ]
        let upload = multer({dest:"attachment/"}).fields(fieldsList);

        multer({dest:"attachment/"}).any();
        接收一切上传的文件

        multer({dest:"attachment/"}).none();
        接收只有文本域的表单，如果上传任何文件，会返回 “LIMIT_UNEXPECTED_FILE” 错误。

        上述使用方式中 options 的配置项有：
        dest 或 storage：在哪里存储文件
        limits：限制上传数据的大小
        fileFilter：文件过滤器，控制哪些文件可以被接受
        preservePath：保存包含文件名的完整文件路径
    */ 
    let upload = multer({dest: './files/portrait'}).single("file")
    upload(req, res, (err) => {
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
    uploadPortrait
}