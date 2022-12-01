// 链接数据库
const mongoose = require('mongoose')
const log4js = require('../utils/log4j')
const config = require('./index')


mongoose.connect(config.URL)
const db = mongoose.connection

db.on('error', () => {
    log4js.error('**数据库链接失败**')
})

db.on('open', () => {
    log4js.info('**数据库链接成功**')
})