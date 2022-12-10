/**
 * 日期格式化公共函数封装
 */
export default {
    formateDate(date, rule) {
        let dates = rule || 'yyyy-MM-dd hh:mm:ss'
        if (/(y+)/.test(dates)) {
            dates = dates.replace(RegExp.$1, date.getFullYear())
        }

        const dateArr = {
            'M+': date.getMonth() + 1,
            'd+': date.getDate(),
            'h+': date.getHours(),
            'm+': date.getMinutes(),
            's+': date.getSeconds(),
        }

        for (let i in dateArr) {
            if (new RegExp(`(${i})`).test(dates)) {
                let val = dateArr[i] + ''
                dates = dates.replace(RegExp.$1, val)
            }
        }
        return dates
    }
}