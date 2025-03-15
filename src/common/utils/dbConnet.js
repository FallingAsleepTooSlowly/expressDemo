/* 连接数据库 */

/* 只使用 mysql2 连接数据库 */
// const mysql = require("mysql2")
// const { MySQLConfig } = require("../config")

// const pool = mysql.createPool(MySQLConfig)    // 创建连接池

// module.exports = pool.promise()


/* 使用 mysql2 + knex 连接数据库 */
// 创建和使用 knex 实例
const { MySQLConfig } = require("../config")
const knex = require("knex")(MySQLConfig)

// 监听 'query' 事件
knex.on("query", (query) => {
    console.log("queryquery=====>", query.sql)
})

// 监听 'query-response' 事件，获取查询结果
knex.on("query", (response, query) => {
    console.log("query-response result length====>", response.length)
})

module.exports = knex