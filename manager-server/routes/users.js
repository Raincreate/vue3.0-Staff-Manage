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


module.exports = router