const router = require('koa-router')()
const util = require('../utils/util')
const Menu = require('../models/menuSchema')
router.prefix('/menu')

router.get('/list', async(ctx) => {
    const { menuName, menuState } = ctx.request.query
    const params = {}
    if (menuName) params.menuName = menuName
    if (menuState) params.menuState = menuState
    const rootList = await Menu.find(params) || []
    const getMenuTrees = getMenuTree(rootList, null, [])
    ctx.body = util.success(getMenuTrees)
})

// 对菜单列表进行递归遍历
function getMenuTree(rootList, id, list) {
    for (let i = 0; i < rootList.length; i++) {
        let item = rootList[i]
        if (String(item.parentId.slice().pop()) == String(id)) {
            list.push(item._doc)
        }
    }
    list.map(item => {
        item.children = []
        getMenuTree(rootList, item._id, item.children)
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
    let res, info

    try {
        if (action == 'add') {
            res = await Menu.create(params)
            info = '创建成功le'
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

module.exports = router