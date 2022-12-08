/**
 * 日期格式化公共函数封装
 */
export default {
    formateDate(date, rule) {
        let dates = rule || 'yyyy-MM-dd hh:mm:ss'
        if (/(y+)/.test(date)) {
            dates = dates.replace(RegExp.$1, date.getFullYear())
        }
    }
}