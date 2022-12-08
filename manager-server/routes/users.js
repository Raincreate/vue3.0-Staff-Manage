const router = require('koa-router')()
const User = require('../models/userSchema')
const utils = require('../utils/util')
const jwt = require('jsonwebtoken')
router.prefix('/users')

router.post('/login', async(ctx) => {
    const { userName, userPwd } = ctx.request.body
    const res = await User.findOne({ userName, userPwd }, 'userId userName userEmail state role deptId roleList')
    const data = res._doc
    const token = jwt.sign({
        data: data
    }, 'tom', { expiresIn: '1h' });
    try {
        if (res) {
            data.token = token
            ctx.body = utils.success(data)
        } else {
            ctx.body = utils.fail('用户或密码不正确')
        }
    } catch (error) {
        ctx.body = utils.fail(error.msg)
    }
})

router.get('/list', async(ctx) => {
    const { userId, userName, state } = ctx.request.query
    const { page, skipIndex } = utils.pager(ctx.request.query)

    const params = {}
    if (userId) params.userId = userId
    if (userName) params.userName = userName
    if (state && state != 0) params.state = state


    try {
        const query = User.find(params, { _id: 0, userPwd: 0 })
        const list = await query.skip(skipIndex).limit(page.pageSize)
        const total = await User.countDocuments(params)
        ctx.body = utils.success({
            page: {
                ...page,
                total
            },
            list
        })
    } catch (error) {
        ctx.body = utils.fail(`查询异常${error.stack}`)
    }
})


module.exports = router