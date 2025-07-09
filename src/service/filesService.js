// fs-extra 是 fs 的扩展
import fs from "fs-extra"
import path from "path"
import Result from "../common/config/result.js"
import filesDao from "../dao/filesDao.js"

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

    // 上传单一文件
    async uploadSingleFile (condition, req) {
        // 将保存的文件记录存储在数据库中
        let info = await filesDao.saveUserFiles(condition)
        /*
            返回的 info 数据：
                ResultSetHeader {
                    fieldCount: 0,
                    affectedRows: 1,
                    insertId: 1,
                    info: '',
                    serverStatus: 2,
                    warningStatus: 0,
                    changedRows: 0
                }
        */
        if (info) {
            return Result.success({
                code: 0,
                message: '文件上传成功'
            })
        } else {
            return Result.success({
                code: 1,
                message: '文件上传失败'
            })
        }
    }


    // 将分段上传的文件合并
    async mergeChunkFile (condition, req) {
        // 包含扩展的文件名，也是合并后的文件名
        let reqName = req.body.fileName
        // 获取到不包含扩展的文件名
        let fname = req.body.fileName.split('.')[0]
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

        // 获取需要存储的文件路径
        condition.filePath = path.join(req.body.id, reqName)
        // 将保存的文件记录存储在数据库中
        let info = await filesDao.saveUserFiles(condition)
        /*
            返回的 info 数据：
                ResultSetHeader {
                    fieldCount: 0,
                    affectedRows: 1,
                    insertId: 1,
                    info: '',
                    serverStatus: 2,
                    warningStatus: 0,
                    changedRows: 0
                }
        */
        if (info) {
            return Result.success({
                code: 0,
                message: '文件上传成功'
            })
        } else {
            return Result.success({
                code: 1,
                message: '文件上传失败'
            })
        }
    }
}

export default new uploadService()