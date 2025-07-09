/* 上传文件相关数据库操作 */

// 通过 mysql2 来使用数据库
import protoDB from "../common/utils/protoDbConnet.js"

class filesDao {
    // 保存用户上传的文件
    async saveUserFiles (condition) {
        let sql = "INSERT INTO user_files (user_id, file_path, file_name) VALUES (?, ?, ?)"
        const [data] = await protoDB.execute(
            sql,
            [condition.id, condition.filePath, condition.fileName],
            function(err, results, fields) { return }
        )
        return data
    }
}

export default new filesDao()