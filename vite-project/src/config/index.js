// 环境配置封装

const env =
    import.meta.env.MODE || 'prod'

const EnvConfig = {
    dev: {
        baseApi: '/api',
        mockApi: 'https://www.fastmock.site/mock/3348ac61b0db2e0ac96915ac0a34a0b2/api',
    },
    test: {
        baseApi: '//test.future.com/api',
        mockApi: 'https://www.fastmock.site/mock/3348ac61b0db2e0ac96915ac0a34a0b2/api'
    },
    prod: {
        baseApi: '//future.com/api',
        mockApi: 'https://www.fastmock.site/mock/3348ac61b0db2e0ac96915ac0a34a0b2/api'
    }
    // dev 开发环境 
    // test 测试环境
    // prod 生产环境
}

export default {
    env,
    // mock: false, // 开启默认的数据
    ...EnvConfig[env],
    namespace: 'manage'
}