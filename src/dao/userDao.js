/* 用户相关 */

/* 只通过 mysql2 来使用数据库 */
const protoDB = require("../common/utils/protoDbConnet")
// const User = require("../class/crossUserClass")

class UserDao {
    // 登录
    async login (condition) {
        // let sql = "select * from user where name = ? AND password = ?"
        let sql = " SELECT u.*, JSON_ARRAYAGG(r.role) AS roles FROM user u JOIN roles r ON u.openid = r.user_id WHERE u.name = ? AND u.password = ? GROUP BY u.openid;"
        // mysql2 的 execute 参数分别为 execute(<SQL语句>, <参数数组（用 ? 当参数的占位符）>, <SQL语句执行后的回调函数>)
        const data = await protoDB.execute(
            sql,
            [condition.name, condition.password],
            function(err, results, fields) { return }
        )
        // 使用 data[0] 的原因，请查阅 mysql2 文档
        return data[0][0]
    }

    // 上传头像
    async uploadPortrait (condition) {
        const oldUserInfo = await this.getUserInfoByUserName(condition)
        let sql = "UPDATE user SET portrait = ? WHERE name = ?"
        const data = await protoDB.execute(sql, [condition.file, condition.name])
        return {
            updateResult: data[0],
            oldUserInfo
        }
    }

    // 根据用户名查询用户信息
    async getUserInfoByUserName (condition) {
        console.log('getUserInfoByUserNameDao====>', condition)
        let sql = " SELECT u.*, JSON_ARRAYAGG(r.role) AS roles FROM user u JOIN roles r ON u.openid = r.user_id WHERE u.name = ? GROUP BY u.openid;"
        const data = await protoDB.execute(
            sql,
            [condition.name],
            function(err, results, fields) { return }
        )
        return data[0][0]
    }

    // 多个类相互引用的例子
    async crossQuoteDemo () {
        const userSql = 'SELECT id, name, email FROM users'
        const orderSql = 'SELECT id, user_id AS userId, product, quantity, price FROM orders'
        const usersResults = await protoDB.execute(userSql)[0]
        const ordersResults = await protoDB.execute(orderSql)[0]

        return data[0];
    }
}

module.exports = new UserDao()


/* 通过 mysql2 和 knex 来使用数据库 */
// const db = require("../common/utils/dbConnet")

// class UserDao {
//     // 查询所有用户
//     async getUserList () {
//         return await db.select("*").from("user")
//     }

//     async getUserListByParams (condition) {
//         // knex.select('name')
//         // .from('users')
//         // .where('id', '>', 20)
//         // .andWhere('id', '<', 200)
//         // .limit(10)
//         // .offset(x)
//         // .then(function(rows) {
//         //     return _.pluck(rows, 'name');
//         // })
//         // .then(function(names) {
//         //    return knex.select('id')
//         //     .from('nicknames')
//         //     .whereIn('nickname', names);
//         // })
//         // .then(function(rows) {
//         //     console.log(rows);
//         // })
//         // .catch(function(error) {
//         //     console.error(error)
//         // })
//         let result = await db.select("*").where("name", "=", condition.name).from("user")
//         return result
//     }
// }

// module.exports = new UserDao()