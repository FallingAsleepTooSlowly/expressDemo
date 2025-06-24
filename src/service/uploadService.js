
class uploadService {
    // 上传文件
    async uploadFile (condition, req) {
        // 根据存储类型处理文件
        if (req.file.storageType === 'memory') {
            console.log("memorymemory===>", req.file)
            // 处理内存存储的文件，即大文件存储（此处大文件才会使用内存存储）
        } else {
            // 处理磁盘存储的文件，即小文件存储
            console.log("diskdisk===>", req.file)
        }
    }
}

module.exports = new uploadService()