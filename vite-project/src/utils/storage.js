// localstorage的二次封装

import config from '../config'

export default {
    setItem(key, val) {
        const storage = this.getStorage()
        storage[key] = val
        window.localStorage.setItem(config.namespace, JSON.stringify(storage)) // JSON.stringify() 将 JavaScript 值转换为 JSON 字符串。
    },
    getItem(key) {
        return this.getStorage()[key]
    },
    getStorage() {
        return JSON.parse(window.localStorage.getItem(config.namespace) || "{}")
    },
    clearItem(key) {
        let storage = this.getStorage()
        delete storage[key]
        window.localStorage.setItem(config.namespace, JSON.stringify(storage))
    },
    clearAll() {
        window.localStorage.clear()
    }
}