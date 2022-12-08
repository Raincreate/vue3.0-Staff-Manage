import request from '../utils/request'

export default {
    login(params) {
        return request({
            url: '/users/login',
            method: 'post',
            data: params,
            // mock: true
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
    userDelete(params) {
        return request({
            url: '/users/delete',
            method: 'post',
            data: params,
            mock: true
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
            mock: true,
            data: params
        })
    },
}