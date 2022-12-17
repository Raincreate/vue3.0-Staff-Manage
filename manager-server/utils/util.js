/**
 * 服务端公告函数的封装
 */

const log4js = require('./log4j')
const jwt = require('jsonwebtoken')

const CODE = {
    SUCCESS: 200,
    PARAM_ERROR: 10001, //参数发生错误
    USER_ACCOUNT_ERROR: 20001, // 账号或者密码错误
    USER_LOGIN_ERROR: 30001, // 用户未登录
    BUSINESS_ERROR: 40001, // 业务请求失败
    AUTH_ERROR: 50001, // 认证失败或者token过期
}

module.exports = {
    pager({ pageNum = 1, pageSize = 10 }) {
        pageNum *= 1
        pageSize *= 1
        const skipIndex = (pageNum - 1) * pageSize //为啥？

        return {
            page: {
                pageNum,
                pageSize
            },
            skipIndex
        }
    },
    // 成功
    success(data = '', msg = '', code = CODE.SUCCESS) {
        log4js.debug(data)
        return {
            code,
            data,
            msg
        }
    },
    // 失败
    fail(msg = '', code = CODE.BUSINESS_ERROR, data) {
        log4js.debug(msg)
        return {
            code,
            data,
            msg
        }
    },
    CODE,
    // 解密函数
    decoded(authorization) {
        if (authorization) {
            let token = authorization.split(' ')[1]
            return jwt.verify(token, 'tom')
        }
        return ''
    },
    // 递归树
    async getTree(rootList, id, list) {
        for (let i = 0; i < rootList.length; i++) {
            let item = rootList[i]
            if (String(item.parentId.slice().pop()) == String(id)) {
                list.push(item._doc)
            }
        }
        list.map(item => {
            item.children = []
            this.getTree(rootList, item._id, item.children)
            if (item.children.length == 0) {
                delete item.children;
            } else if (item.children.length > 0 && item.children[0].menuType == 2) {
                // 快速区分按钮和菜单，用于后期做菜单按钮权限控制
                item.action = item.children;
            }
        })
        return list;
    }
}