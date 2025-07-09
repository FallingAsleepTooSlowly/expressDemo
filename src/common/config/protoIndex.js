/* 数据库连接配置，初始化knex */
/* 使用 mysql2 + knex 的组合来连接数据库，也可以只使用 mysql2 */
/* mysql2 是 MySQL 的官方 Node.js 客户端，它允许你直接与 MySQL 数据库进行交互 */
/* knex 是一个SQL查询构建器，它提供了一个更高级的抽象层，让你可以用JavaScript代码来构建SQL查询，而不是直接编写SQL语句 */

// 只使用 mysql2 时配置：
// 安装依赖的命令为 npm install mysql2
const MySQLConfig = {
    host: "localhost",
    user: "root",
    password: "310627",
    database: "gh_demo",
    // 是否等待所有连接都被处理。如果设置为true，则当连接池达到其最大容量时，新请求将被阻塞，直到有可用连接
    waitForConnections: true, 
    connectionLimit: 10, // 允许的最大连接数。如果超过这个数量，新的连接将被拒绝
    // 队列限制。如果设置为0，则没有限制，更多的请求将被添加到队列中，直到达到最大连接数
    queueLimit: 0, 
}

export default MySQLConfig