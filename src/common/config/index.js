/* 数据库连接配置，初始化knex */
/* 使用 mysql2 + knex 的组合来连接数据库，也可以只使用 mysql2 */
/* mysql2 是 MySQL 的官方 Node.js 客户端，它允许你直接与 MySQL 数据库进行交互 */
/* knex 是一个SQL查询构建器，它提供了一个更高级的抽象层，让你可以用JavaScript代码来构建SQL查询，而不是直接编写SQL语句 */

// 使用 mysql2 + knex 时配置
// 安装依赖的命令为 npm install knex mysql2
const MySQLConfig = {
    client: "mysql2",
    connection: {
        host: "localhost",
        user: "root",
        password: "310627",
        database: "gh_demo",
    },
    pool: {
        // 连接池配置
        min: 0,
        max: 10,
    },
}
export default MySQLConfig