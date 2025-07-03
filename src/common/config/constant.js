/* 自定义的常量文件 */

// 静态文件访问白名单地址
function staticWhitelist (referer) {
    const list = [
        'http://localhost:9999/'
    ]
    // 直接从浏览器地址访问时没有 referer
    if (referer && list.includes(referer.toLowerCase())) {
        return true
    } else {
        return false
    }
}

module.exports = {
    // 端口号
    port: 9000,
    staticWhitelist
} 