/* 自定义上传相关的中间件 */
/*
    中间键抛出错误方法：
    const middleKey = (req, res, next) => {
        try {
            throw new Error("手动抛出错误");
        } catch (err) {
            next(err);
        }
    }
    
*/

// multer 用于将本地文件/图片上传到服务器指定目录
const multer = require("multer")
const Result = require("../common/config/result")
const path = require("path")
const fs = require("fs-extra")

// ------------------------------ 文件上传路径

// 分段存储的绝对路径
const tempPath = 'files/temp'

// ------------------------------ 普通文件上传方法

// 使用 diskStorage 磁盘存储引擎来控制文件的存储，有两个属性，属性值都是函数。destination 用来指定文件存储的路径；filename 用来指定文件的存储名称。
const theStorage = multer.diskStorage({
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
        // 决定保存的路径
        cb(null, path.join(global.ROOT_PATH, 'files/portrait'))
    },
    // 设置存储的文件名
    /*
        参数：
            req: Express 请求对象（包含请求信息）
            file: 上传的文件对象（包含 fieldname, originalname, mimetype, size）
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
        // 获取到文件的扩展名，如 .jpg
        const ext = path.extname(file.originalname)
        const name = req.body.name
        const fileName = name + '-' + Date.now() + ext
        req.body.file = fileName
        // 验证扩展名（防止上传恶意文件）
        if (!['.png', '.jpg', '.jpeg', '.gif', '.svg'].includes(ext.toLowerCase())) {
            return cb(new Error('只允许图片文件'));
        } else {
            // cb(null, `${name}-${Date.now()}${ext}`)
            cb(null, fileName)
        }
    }
})

// 上传头像的自定义中间件，使用storage 代替 dest 后，Multer 会将存储引擎由 DiskStorage (硬盘存储)切换为 MemoryStorage (内存存储)
// 使用 storage 可以对上传文件做更多的控制，这里的 storage 中我们使用 diskStorage，所以依旧是硬盘存储
const uploadPortrait = multer({ storage: theStorage })

// 上传头像的自定义中间件，不使用 diskStorage 的写法
function elseUploadPortrait (req, res, next) {
    /*
        multer(options).single(fieldname);
        single 代表只能上传一个文件，fieldname 为上传时文件的字段名称（下方使用时的字段名称）
        例：multer({dest: './ortrait'}).single("file");

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
        接收只有文本域的表单，即只处理非文件的数据，如果上传任何文件，会返回 “LIMIT_UNEXPECTED_FILE” 错误。

        上述使用方式中 options 的配置项有：
        dest 或 storage：在哪里存储文件（如果忽略该选项，文件会被保存在内存中，并且永远不会写入硬盘中）
        limits：限制上传数据的大小
        fileFilter：文件过滤器，控制哪些文件可以被接受
        preservePath：保存包含文件名的完整文件路径
    */ 
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

            常见问题：
            1. req.file 为 undefined，原因可能为：
                1）未添加 enctype="multipart/form-data" 到表单，解决方法：<form action="/upload" method="post" enctype="multipart/form-data">
                2）中间件使用错误，如用 upload.single() 处理多文件
                3）文件大小超过 Multer 的 limits 配置
            2. 如何获取上传后的文件：
                1）磁盘存储：使用 fs 模块操作 req.file.path
                2）内存存储：直接访问 req.file.buffer
            3. 如何删除上传的文件：
                const fs = require('fs');
                fs.unlink(req.file.path, (err) => {
                    if (err) console.error('删除文件失败', err);
                });
        */
        if (err) {
            try {
                throw new Error("文件不存在！");
            } catch (err) {
                next(err);
            }
        } else {
            req.body.file = req.file.originalname
            next()
        }
    })
}

// ------------------------------ 不同的存储方法（用户文件上传）

// 使用 memoryStorage 内存存储，避免直接写入磁盘
const memoryStorage = multer.memoryStorage()
const memoryUploadFile = multer({ storage: memoryStorage })

// 使用 diskStorage 磁盘存储，直接写入磁盘
const diskStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        // cb(new Error('Invalid path'))
        // 决定保存的路径
        cb(null, path.join(global.ROOT_PATH, 'files', req.body.id ))
    },
    filename: (req, file, cb) => {
        // 获取到文件的扩展名，如 .jpg
        const ext = path.extname(file.originalname)
        if (req.body.id) {
            const fileName = `${req.body.id}-${Date.now()}${ext}`
            req.body.file = fileName
            cb(null, fileName)
        } else {
            const fileName = `${Date.now()}${ext}`
            req.body.file = fileName
            cb(null, fileName)
        }
        // cb(null, `${name}-${Date.now()}${ext}`)
    }
})
const diskUploadFile = multer({ storage: diskStorage })

// ------------------------------ Multer 自定义存储引擎

// 自定义的存储引擎
const customizedStorage = {
    // 处理文件存储逻辑
    _handleFile(req, file, cb) {
        if (!req.body.id) {
            cb("未获取到用户id")
        }
        // 文件大小超过 40 MB 时判断是大文件
        const MAX_SIZE = 40 * 1024 * 1024
        console.log('file===>', file)
        
        multer.diskStorage({
            // 设置存储路径，只有路径的话可直接简写为 destination: 'uploads/'
            destination: (req, file, cb) => {
                const filePath = path.join(global.ROOT_PATH, req.body.id)
                // 确保目录存在，如果目录结构不存在，它将由该函数创建
                fs.ensureDirSync(filePath)
                // 决定保存的路径
                cb(null, filePath)
            },
            // 设置存储的文件名，只有文件名可直接简写为 filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
            filename: (req, file, cb) => {
                // 获取到文件的扩展名，如 .jpg
                const ext = path.extname(file.originalname)
                const id = req.body.id
                const fileName = id + '-' + Date.now() + ext
                req.body.file = fileName
                cb(null, fileName)
            }
        })._handleFile(req, file, cb)
    },
     // 可选方法用于删除已存储的文件，通常在处理过程中发生错误时由 Multer 自动调用
    _removeFile(req, file, cb) {
        // 进来时说明已报错，判断是否是磁盘文件
        if (file.path) {
            // 删除磁盘文件
            fs.unlink(file.path, cb); 
        } else {
            // 内存文件无需清理
            cb()
        }
    }
}

// ------------------------------ 大文件分段上传

/*
    fs.readdirSync(path, options) 方法用于同步读取给定目录的内容，并返回一个包含目录中所有文件名或对象的数组
        path: 必须读取内容的目录路径，可以是字符串、缓冲区或 URL
        options: 一个对象，可用于指定影响方法的可选参数。它具有两个可选参数： encoding: 指定返回文件名使用的编码，默认值为 "utf8"。 withFileTypes: 布尔值，指定是否将文件作为 fs.Dirent 对象返回，默认值为 false^2^

    sort() 方法用于对数组的元素进行排序，并返回数组，默认排序顺序是根据字符串 Unicode 码点，即字符编码的顺序
        升序：array.sort(function(a, b) { return a - b })
        降序：array.sort(function(a, b) { return b - a })
    fs.readdirSync(path, options) 方法用于同步读取给定目录的内容。该方法返回一个数组，其中包含目录中的所有文件名或对象。
        path: 必须从中读取内容的目录路径。它可以是字符串，缓冲区或URL
        options: 用于指定将影响方法的可选参数
            encoding: 指定的编码
            withFileTypes: 指定是否将文件作为fs.Dirent对象返回。默认值为“ false”
    fs.appendFileSync(filepath, data, options) 用于将数据同步添加到文件
        filepath: 字符串，用于指定文件路径
        data: 附加到文件的内容
        options(非必填): 指定的编码/模式/标志，如 'utf8' 或 {encoding:'utf8', flag:'r'})

    fs.readFileSync(path, options) 用于同步读取文件并返回其内容
        path: 读取的文件
        options(非必填): 指定的编码/模式/标志，如 'utf8' 或 {encoding:'utf8', flag:'r'})
*/

const chunkFileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        try {
            /*
                Buffer.from(text, inType).toString(outType);
                    text: 需要转换内容
                    inType: 指定数据源的编码类型，node 目前支持 ascii、utf8、utf16le、ucs2、base64、latin1、binary、hex
                    outType: 指定需要得到的编码类型
            */
            /*
                Buffer 实例一般用于表示编码字符的序列，比如 UTF-8 、 UCS2 、 Base64 、或十六进制编码的数据。 通过使用显式的字符编码，就可以在 Buffer 实例与普通的 JavaScript 字符串之间进行相互转换。
                latin1 是一种把 Buffer 编码成一字节编码的字符串的方式，下方为将 latin1 编码转换为 utf8 编码，确保不会出现中文乱码的情况
            */ 
           /*
                当请求中包含文件时，Express 通常使用`multipart/form-data`格式。处理这种格式的中间件（如`multer`）可能会在错误发生时直接中断连接，
                导致连接重置，而不是进入错误处理中间件，所以若 destination 或 filename 里报错的话，连接会重置，前端获取不到任何返回数据
           */
            // 解决中文乱码问题
            const fileOriginalname = Buffer.from(file.originalname, 'latin1').toString('utf-8');
            let [fname, index, ext] = fileOriginalname.split(".")
            // 临时保存路径
            const chunkAddress = path.join(global.ROOT_PATH, tempPath, fname )
            // 确保路径存在，不存在会自动创建
            fs.ensureDirSync(chunkAddress)
            cb(null, chunkAddress)
            // throw new Error('存储路径有问题')
        } catch (err) {
            cb(err)
        }
    },
    filename: (req, file, cb) => {
        try {
            const fileOriginalname = Buffer.from(file.originalname, 'latin1').toString('utf-8');
            let [fname, index, ext] = fileOriginalname.split(".")
            // 因为是分片文件，所以按照索引命名，且不添加扩展名，等合并后再添加扩展名
            const fileName = index
            cb(null, fileName)
            // cb(null, `${name}-${Date.now()}${ext}`)
        } catch (err) {
            cb(err)
        }
    }
})
const chunkFileUpload = multer({ storage: chunkFileStorage })


module.exports = {
    uploadPortrait,
    memoryUploadFile,
    diskUploadFile,
    customizedStorage,
    chunkFileUpload,
    tempPath
}