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
    // 菜单
    MenuList() {
        return request({
            url: '/menu/list',
            method: 'get',
            data: {},
            mock: false
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
    // 用户删除
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
            mock: false,
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
    },
    // role上传新增
    roleOperate(params) {
        return request({
            url: '/roles/operate',
            method: 'post',
            data: params,
            mock: true
        })
    },
    // 用户设置权限
    updatePermission(params) {
        return request({
            url: '/roles/update/permission',
            method: 'post',
            mock: true,
            data: params
        })
    }
}