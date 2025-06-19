/* 自定义的中间件 */

// multer 用于将本地文件/图片上传到服务器指定目录
const multer = require("multer")
const Result = require("../models/result")
const path = require("path")

// 获取存储的绝对路径
function fullPath (type) {
    return './files/' + type
}

// 使用 diskStorage 磁盘存储引擎来控制文件的存储，有两个属性，属性值都是函数。destination 用来指定文件存储的路径；filename 用来指定文件的存储名称。
let storage = multer.diskStorage({
    // 设置存储路径
    /*
        参数：
            req: Express 请求对象（包含请求信息）
            file: 上传的文件对象（包含原始文件名、MIME 类型等）
            cb: 回调函数（必须调用以继续流程）
                成功时的写法：cb(null, <存储路径>)
                失败时的写法：cb(new Error('Invalid path'))
    */
    destination: (req, file, cb) => {
        console.log('destination file=====>', file)
        // 根据入参决定保存的路径
        cb(null, fullPath(req.body.type))
    },
    // 设置存储的文件名
    /*
        参数：
            req: Express 请求对象（包含请求信息）
            file: 上传的文件对象（包含原始文件名、MIME 类型等）
            cb: 回调函数（必须调用以继续流程）
                成功时的写法：cb(null, <存储文件名>)
                失败时的写法：cb(new Error('Invalid path'))
    */
    /*
        常用技巧：
            使用时间戳：Date.now()
            添加随机数：Math.random().toString(36).slice(2, 8)
            保留原始扩展名：path.extname(file.originalname)
    */
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

// 上传头像的自定义中间件
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
    // 普通写法
    let upload = multer({dest: './files/portrait'}).single("file")
    upload(req, res, (err) => {
        /*
            req.file 的属性有:
                fieldname: 表单中定义的文件字段名，如 HTML 表单是 <input type="file" name="avatar">，则值为 "avatar"
                originalname: 用户计算机上的原始文件名（包括扩展名），如果是中文会出现乱码，不要直接信任此值，可能包含恶意路径或特殊字符
                    文件名安全处理方法（移除路径部分，防止路径遍历攻击）： 
                    const safeFileName = req.file.originalname
                        .replace(/^.*[\\\/]/, '') // 移除路径
                        .replace(/[^\w\.\-]/g, '_'); // 替换特殊字符
                encoding: 文件编码类型，大多数文件为 "7bit"，二进制文件为 "binary"
                mimetype: 文件的 MIME 类型，如 "image/jpeg"、 "application/pdf"，此属性由客户端提供，需要验证（可通过文件内容真实校验）
                    MIME 类型验证：  
                    const allowedTypes = ['image/jpeg', 'image/png'];
                    if (!allowedTypes.includes(req.file.mimetype)) {
                        throw new Error('文件类型不支持');
                    }
                size: 文件大小，单位是字节，如 102400 表示 100KB
                    文件大小限制（在 Multer 配置中设置）：
                    const upload = multer({
                        limits: { fileSize: 1024 * 1024 } // 限制1MB
                    });
        */
        // 获取到文件的扩展名，如 .jpg
        let ext = path.extname(req.file.originalname)
        // 验证扩展名
        if (!['.png', '.jpg'].includes(ext)) {
            return cb(new Error('只允许图片文件'));
        }
        console.log('upload req.file=====>', req.file)
        return Result.success({
            code: 1,
            message: "错误！错误！"
        })
        // if (err) {
        //     return Result.success({
        //         code: 1,
        //         message: err
        //     })
        // } else {
        //     req.body.file = req.file.originalname
        //     next()
        // }
    })
}

module.exports = {
    uploadPortrait
}