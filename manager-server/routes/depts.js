const router = require('koa-router')()
const util = require('../utils/util')
const Dept = require('../models/deptSchema')
router.prefix('/dept')

// 部门
router.get('/list', async(ctx) => {
    const { deptName } = ctx.request.query
    const params = {}
    if (deptName) params.deptName = deptName
    const rootList = await Dept.find(params) || []
    console.log('Dept.find(params):', params);

    if (deptName) {
        ctx.body = util.success(rootList)
    } else {
        const getMenuTrees = getDeptTree(rootList, null, [])
        ctx.body = util.success(getMenuTrees)
    }
})

// 对菜单列表进行递归遍历
function getDeptTree(rootList, id, list) {
    for (let i = 0; i < rootList.length; i++) {
        let item = rootList[i]
        if (String(item.parentId.slice().pop()) == String(id)) {
            list.push(item._doc)
        }
    }
    list.map(item => {
        item.children = []
        getDeptTree(rootList, item._id, item.children)
        if (item.children.length == 0) {
            delete item.children;
        } else if (item.children.length > 0 && item.children[0].menuType == 2) {
            // 快速区分按钮和菜单，用于后期做菜单按钮权限控制
            item.action = item.children;
        }
    })
    return list;
}

// 创建 编辑
router.post('/operate', async(ctx) => {
    const { _id, action, ...params } = ctx.request.body
    let info

    try {
        if (action == 'create') {
            await Dept.create(params)
            info = '创建成功le'
        } else if (action == 'edit') {
            params.updateTime = new Date()
            await Dept.findByIdAndUpdate(_id, params)
            info = '编辑成功'
        } else {
            await Dept.findByIdAndRemove(_id)
            await Dept.deleteMany({ parentId: { $all: [_id] } })
            info = '删除成功'
        }
        ctx.body = util.success({}, info)
    } catch (error) {
        ctx.body = util.fail({}, error.stack)
    }
})

module.exports = router