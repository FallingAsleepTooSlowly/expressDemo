/* 自定义的中间件 */

const staticMiddleware = function (req, res, next) {
    console.log('req====>', req.url)
    next()
}

module.exports = {
    staticMiddleware
}