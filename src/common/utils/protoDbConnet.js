/* 连接数据库 */

/* 只使用 mysql2 连接数据库 */
const mysql = require("mysql2")
const { MySQLConfig } = require("../config/protoIndex")

const pool = mysql.createPool(MySQLConfig)    // 创建连接池

module.exports = pool.promise()