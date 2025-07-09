/* 自定义的中间件 */

import Result from "../common/config/result.js"
import { staticWhitelist } from "../common/config/constant.js"
import jwt from "jsonwebtoken"

// 直接通过静态路径访问时的校验中间件
export const staticMiddleware = function (req, res, next) {
    // 校验请求来源
    if (staticWhitelist(req.get('referer'))) {
        // 校验 token
        jwt.verify(req.query.token, 'danbao', function(err, decoded) {
            // 判断 token 是否失效
            if (err) {
                res.send(Result.error({
                    message: 'token失效'
                }))
            } else {
                next()
            }
        })
    } else {
        res.send(Result.error({
            message: '无法访问'
        }))
    }
}