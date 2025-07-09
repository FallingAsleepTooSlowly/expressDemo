/* 连接数据库 */

/* 只使用 mysql2 连接数据库 */
import mysql from "mysql2"
import MySQLConfig from "../config/protoIndex.js"

const pool = mysql.createPool(MySQLConfig)    // 创建连接池

const protoDB = pool.promise()

export default protoDB