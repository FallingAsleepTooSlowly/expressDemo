/* 连接数据库 */

/* 只使用 mysql2 连接数据库 */
import mysql from "mysql2"
import MySQLConfig from "../config/protoIndex.js"

const pool = mysql.createPool(MySQLConfig)    // 创建连接池

const protoDB = pool.promise()

export default protoDB


/* 使用 mysql2 + knex 连接数据库 */
// 创建和使用 knex 实例
// import MySQLConfig from "../config/index.js"
// import knex from "knex"

// const db = knex(MySQLConfig)

// // 监听 'query' 事件
// db.on("query", (query) => {
//     console.log("queryquery=====>", query.sql)
// })

// // 监听 'query-response' 事件，获取查询结果
// db.on("query", (response, query) => {
//     console.log("query-response result length====>", response.length)
// })

// export default db