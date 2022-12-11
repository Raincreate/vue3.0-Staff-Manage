const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const log4js = require('./utils/log4j')
const router = require('koa-router')()
const jwt = require('jsonwebtoken')
const util = require('./utils/util')
const koajwt = require('koa-jwt')
const users = require('./routes/users')
const menus = require('./routes/menus')

onerror(app)
require('./config/db')

// middlewares
app.use(bodyparser({
    enableTypes: ['json', 'form', 'text']
}))
app.use(json())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
    extension: 'pug'
}))

// logger
app.use(async(ctx, next) => {
    // 服务端希望能够看到前端请求过来的数据
    log4js.info(`get params:${JSON.stringify(ctx.request.query)}`)
    log4js.info(`post params:${JSON.stringify(ctx.request.body)}`)
    await next().catch((error) => {
            if (error.status == '401') {
                ctx.status = 200
                ctx.body = util.fail('Token认证失败le', util.CODE.AUTH_ERROR)
            } else {
                throw error
            }
        })
        // const ms = new Date() - start
        // console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// app.use(() => {
//     ctx.body('error - body')
// })
log4js.info('info output')

app.use(koajwt({ secret: 'tom' }).unless({
    path: [/^\/api\/users\/login/]
}))
router.prefix('/api')
router.get('/leave/count', (ctx) => {
        const token = ctx.request.headers.authorization.split(' ')[1]
        const payload = jwt.verify(token, 'tom')
        ctx.body = payload
    })
    // routes
    // app.use(index.routes(), index.allowedMethods())
router.use(users.routes(), users.allowedMethods())
router.use(menus.routes(), users.allowedMethods())
app.use(router.routes(), router.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
    log4js.error(`${err.stack}`)
});

module.exports = app