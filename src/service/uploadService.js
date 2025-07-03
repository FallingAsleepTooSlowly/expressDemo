// fs-extra 是 fs 的扩展
const fs = require("fs-extra")
const path = require("path")
const Result = require("../common/config/result")

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

    // 将分段上传的文件合并
    async mergeChunkFile (condition, req) {
        // 包含扩展的文件名，也是合并后的文件名
        let reqName = req.body.name
        // 获取到不包含扩展的文件名
        let fname = req.body.name.split('.')[0]
        // 获取到分段文件的路径，path.join() 用于合并成一个可使用的新路径，斜杠或改成需要的反斜杠？
        let chunkDir = path.join(global.ROOT_PATH_TEMP, fname)

        // 获取指定目录里的文件，这里使用同步读取方法以防文件合并顺序混乱
        let chunks = fs.readdirSync(chunkDir)
        // 对数组的元素进行排序，然后再按顺序逐一处理，这里用的是文件夹默认的升序，即递增
        chunks.sort((a, b) => a - b).map(chunkName => {
            // 用于将数据添加到指定文件中
            fs.appendFileSync(
                // 指定的文件，即合并后的文件
                path.join(global.ROOT_PATH_FILES, req.body.id, reqName),
                // 用于读取文件并返回其内容，这里是添加的数据，即每一块的文件
                fs.readFileSync(`${chunkDir}/${chunkName}`)
            )
        })

        // 合并完文件后删除临时文件夹
        fs.removeSync(chunkDir)
        return Result.success({
            code: 0,
            data: '文件上传成功'
        })
    }
}

module.exports = new uploadService()