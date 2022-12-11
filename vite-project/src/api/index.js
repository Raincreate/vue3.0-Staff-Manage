import request from '../utils/request'

export default {
    login(params) {
        return request({
            url: '/users/login',
            method: 'post',
            data: params,
            mock: false
        })
    },
    noticeCount() {
        return request({
            url: '/leave/count',
            method: 'get',
            data: {},
            mock: true
        })
    },
    MenuList() {
        return request({
            url: '/menu/list',
            method: 'get',
            data: {},
            mock: true
        })
    },
    userList(params) {
        return request({
            url: '/users/list',
            method: 'get',
            data: params,
            mock: false
        })
    },
    // 删除
    userDelete(params) {
        return request({
            url: '/users/delete',
            method: 'post',
            data: params,
            mock: false
        })
    },
    getRoleLists() {
        return request({
            url: '/roles/allList',
            method: 'get',
            mock: true
        })
    },
    getDeptList() {
        return request({
            url: '/dept/list',
            method: 'get',
            mock: true
        })
    },
    userSubmit(params) {
        return request({
            url: '/users/operate',
            method: 'post',
            mock: false,
            data: params
        })
    },
    menuSubmit(params) {
        return request({
            url: '/menu/operate',
            method: 'post',
            mock: true,
            data: params
        })
    },
    // 获取角色列表
    roleList() {
        return request({
            url: '/roles/list',
            method: 'get',
            mock: true,
            // data: {}
        })
    }
}