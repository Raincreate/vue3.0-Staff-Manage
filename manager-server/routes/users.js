const router = require('koa-router')()
const User = require('../models/userSchema')
const util = require('../utils/util')
const Counter = require('../models/counterSchema')
const Menu = require('../models/menuSchema')
const Role = require('../models/roleSchema')
const jwt = require('jsonwebtoken')
router.prefix('/users')
const md5 = require('md5')

// 登录
router.post('/login', async(ctx) => {

    try {
        const { userName, userPwd } = ctx.request.body
        const res = await User.findOne({ userName, userPwd }, 'userId userName userEmail state role deptId roleList')
            // const res = await User.findOne({ userName, userPwd:md5(userPwd) }, 'userId userName userEmail state role deptId roleList')

        if (res) {
            const data = res._doc
            const token = jwt.sign({
                data: data
            }, 'tom', { expiresIn: '1h' });
            data.token = token
            ctx.body = util.success(data)
        } else {
            ctx.body = util.fail('用户或密码不正确')
        }
    } catch (error) {
        ctx.body = util.fail(error.msg)
    }
})

// 请求
router.get('/list', async(ctx) => {
    const { userId, userName, state } = ctx.request.query
    const { page, skipIndex } = util.pager(ctx.request.query)

    const params = {}
    if (userId) params.userId = userId
    if (userName) params.userName = userName
    if (state && state != 0) params.state = state


    try {
        const query = User.find(params, { _id: 0, userPwd: 0 })
        const list = await query.skip(skipIndex).limit(page.pageSize)
        const total = await User.countDocuments(params)
        ctx.body = util.success({
            page: {
                ...page,
                total
            },
            list
        })
    } catch (error) {
        ctx.body = util.fail(`查询异常${error.stack}`)
    }
})

// 删除
router.post('/delete', async(ctx) => {
    const { userIds } = ctx.request.body
    const res = await User.updateMany({ userIds: { $in: userIds } }, { state: 2 })
    if (res.modifiedCount) {
        ctx.body = util.success(res, `共删除成功${res.modifiedCount}条`)
    } else {
        ctx.body = util.fail('删除失败')
    }
})

// 编辑
router.post('/operate', async(ctx) => {
    const { userName, userEmail, userId, mobile, job, state, roleList, deptId, action } = ctx.request.body

    if (action == 'add') {
        if (!userName || !userEmail || !deptId) {
            ctx.body = util.fail("参数错误", util.CODE.PARAM_ERROR)
            return
        }
        const res = await User.findOne({ $or: [{ userName }, { userEmail }] }, '_id userName userEmail')
        if (res) {
            ctx.body = util.fail(`监测到有重复的用户，信息如下${res.userName} - ${res.userEmail}`)
        } else {
            try {
                const doc = await Counter.findOneAndUpdate({ _id: 'userId' }, { $inc: { sequence_value: 1 } })
                const user = new User({
                    userId: doc.sequence_value,
                    userName,
                    userPwd: md5('123456'),
                    userEmail,
                    roleList,
                    role: 1,
                    state,
                    job,
                    deptId,
                    mobile,
                })
                user.save()
                ctx.body = util.success({}, '新增创建成功!')
            } catch (error) {
                util.fail(error, stack, '用户创建失败!')
            }
        }
    } else {
        if (!deptId) {
            ctx.body = util.fail('部门不能为空', util.CODE.PARAM_ERROR)
            return
        }
        try {
            const res = await User.findOneAndUpdate({ userId }, { mobile, job, state, roleList, deptId })
            ctx.body = util.success(res, '更新成功')
            return
        } catch (error) {
            ctx.body = util.fail('更新失败')
        }
    }
})

router.get('/all/list', async(ctx) => {
    try {
        const list = await User.find({}, "userId userName userEmail")
        ctx.body = util.success(list)
    } catch (error) {
        ctx.body = util.fail(error.stack)
    }
})

// 权限的处理
router.get('/getPremissonList', async(ctx) => {
    let authorization = ctx.request.headers.authorization
    let { data } = util.decoded(authorization)
    let menuList = await getMenuList(data.role, data.roleList)
    let actionList = await getActionList(JSON.parse(JSON.stringify(menuList)))
    ctx.body = util.success({ menuList, actionList })
})

async function getMenuList(userRole, roleKeys) {
    let rootList = []
    console.log('userRole:', userRole);
    // 管理员为userRole 0 
    if (userRole == 0) {
        rootList = await Menu.find({}) || []
    } else {
        let rootList = await Role.find({ _id: { $in: roleKeys } })
        let permissionList = []
        roleList.map(role => {
            let { checkedKeys, halfCheckedKeys } = role.permissionList
            console.log(checkedKeys, halfCheckedKeys);
            permissionList = permissionList.concat(...checkedKeys, ...halfCheckedKeys)

        })
        permissionList = [...new Set(permissionList)]
        rootList = await Menu.find({ _id: { $in: permissionList } })
    }
    return util.getTree(rootList, null, [])
}

function getActionList(list) {
    const actionList = []
    const deep = (arr) => {
        while (arr.length) {
            let item = arr.pop();
            if (item.action) {
                item.action.map(action => {
                    actionList.push(action.menuCode)
                })
            }
            if (item.children && !item.action) {
                deep(item.children);
            }
        }
    };
    deep(list)

    return actionList
}

module.exports = router