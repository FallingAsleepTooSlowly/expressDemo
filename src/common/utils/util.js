// 上传文件的自定义中间件
function jwtWhiteList (url) {
    const whiteList = [
        '/user/getSvg',
        '/user/login'
    ]
    if (whiteList.indexOf(url) > -1) {
        return true
    } else {
        return false
    }
}

module.exports = {
    jwtWhiteList
}