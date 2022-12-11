const router = require('koa-router')()
const util = require('../utils/util')
const Menu = require('../models/userSchema')
router.prefix('/menu')

// 创建 编辑
router.post('/operate', async(ctx) => {
    const { _id, action, ...params } = ctx.request.body
    let res, info

    try {
        if (action == 'add') {
            res = Menu.create(params)
            info = '创建成功'
        } else if (action == 'edit') {
            params.updateTime = new Date()
            await Menu.findByIdAndUpdate(_id, params)
            info = '编辑成功'
        } else {
            await Menu.findByIdAndRemove(_id)
            await Menu.deleteMany({ parentId: { $all: [_id] } })
            info = '删除成功'
        }
        ctx.body = util.success({}, info)
    } catch (error) {

    }
})