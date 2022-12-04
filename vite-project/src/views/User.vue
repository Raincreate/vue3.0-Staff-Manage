<template>
  <div class="user-manager">
    <div class="query-form">
      <el-form :inline="true" :model="user" ref="form">
        <el-form-item label="用户Id" prop="userId">
          <el-input v-model="user.userId" placeholder="请输入用户ID"></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="user.userName" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="用户状态" prop="state">
          <el-select v-model="user.state">
            <el-option :value="0" label="所有"></el-option>
            <el-option :value="1" label="在职"></el-option>
            <el-option :value="2" label="离职"></el-option>
            <el-option :value="3" label="试用期"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="handleAdd">新增</el-button>
        <el-button type="danger" @click="handleManyDelete">批量删除</el-button>
      </div>
      <el-table :data="userList"  style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column 
          v-for="item in columns" 
          :key="item.prop" 
          :prop="item.prop" 
          :label="item.label" 
          :formatter="item.formatter"
          width="180" />
        <el-table-column fixed="right" label="操作" width="120">
          <template #default="scope">
            <el-button link type="primary" size="small" >编辑</el-button>
            <el-button link type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination 
        background 
        layout="prev, pager, next" 
        :total="pages.total" 
        class="pagination"
        @current-change="handleCurrentChange"
      />
    </div>

    <el-dialog title="用户新增" v-model="showModal">
      <el-form :model="userForm" ref="dialogForm" label-width="100px">
        <el-form-item label="用户名" prop="userName">
          <el-input placeholder="请输入用户名" v-model="userForm.userName" />
        </el-form-item>
        <el-form-item label="邮箱" prop="userEmail">
          <el-input placeholder="请输入邮箱" v-model="userForm.userEmail" />
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input placeholder="请输入手机号" v-model="userForm.mobile" />
        </el-form-item>
        <el-form-item label="岗位" prop="job">
          <el-input placeholder="请输入岗位" v-model="userForm.job" />
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-select v-model="userForm.state">
            <el-option :value="1" label="在职"></el-option>
            <el-option :value="2" label="离职"></el-option>
            <el-option :value="3" label="试用期"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="系统角色" prop="roleList">
          <el-select v-model="userForm.roleList" placeholder="请选择用户系统角色">
            <el-option :value="1" ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门" prop="deptId" >
          <el-cascader 
            v-model="userForm.deptId"
            placeholder="请选择部门" 
            :options="[]"
            :props="{ checkStrictly: true, value: '_id',label:'deptName' }" 
            
          />
        </el-form-item>
        
      </el-form>
      
    </el-dialog>
  </div>
</template>

<script >
import { onMounted,reactive,getCurrentInstance,ref } from 'vue';
export default{
  name:'user',
  setup(){
    const {proxy} = getCurrentInstance()
    // 生命周期
    onMounted(()=>{
      getUserList()
    });
    const user = reactive({
      state:0
    })
    const userList = ref([])
    const columns = reactive([
      {
        label:'用户ID',
        prop:'userId'
      },
      {
        label:'用户名',
        prop:'userName'
      },
      {
        label:'用户邮箱',
        prop:'userEmail'
      },
      {
        label:'用户角色',
        prop:'role',
        formatter(row,column,value){
          return {
            0:'管理员',
            1:'普通用户',
          }[value]
        }
      },
      {
        label:'用户状态',
        prop:'state',
        formatter(row,column,value){
          return {
            0:'在职',
            1:'离职',
            2:'试用期',
          }[value]
        }
      },
      {
        label:'注册时间',
        prop:'createTime'
      },
      {
        label:'最后登录时间',
        prop:'lastLoginTime'
      },
    ])
    
    const pages = reactive({
      pageNum:1,
      pageSize:10,
      total:10
    })
    // 函数调用
    const getUserList = async () =>{
      let params = {...user , ...pages}
      const { page,list } = await proxy.$api.userList(params)
      pages.total = page.total
      userList.value = list
    }
    // 查询
    const handleQuery = () => {
      getUserList()
    }
    // 重置
    const handleReset = () => {
      // console.log('asd');
      proxy.$refs.form.resetFields()
    }
    // 换页
    const handleCurrentChange = (current) =>{
      pages.pageNum = current
      getUserList()
    }
    const handleDelete = async (row) =>{
      const res = await proxy.$api.userDelete({
         userIds:[row.userId]
      })

      if(res.nModified > 0){
        proxy.$message.success('删除成功！')
        getUserList()
      }else{
        proxy.$message.error('删除失败')
      }
    }

    const checkUsersIds = ref([])
    const handleManyDelete = async () =>{
      if(checkUsersIds.value.length == 0){
        proxy.$message.error('请选择需要删除的对象')
        return
      }

      const res = await proxy.$api.userDelete({
         userIds:checkUsersIds.value
      })

      if(res.nModified > 0){
        proxy.$message.success('删除成功！')
        getUserList()
      }else{
        proxy.$message.error('删除失败')
      }
    } 

    const handleSelectionChange = (list) =>{
      let arr = []
      list.forEach((item)=>{
        arr.push(item.userId)
      })
      checkUsersIds.value = arr
    }

    const showModal = ref(false)
    const handleAdd = () => {
      showModal.value = true
    }
    const userForm = reactive({})

    return{
      user,
      userList,
      columns,
      handleQuery,
      handleReset,
      pages,
      handleCurrentChange,
      handleDelete,
      handleManyDelete,
      checkUsersIds,
      handleSelectionChange,
      showModal,
      handleAdd,
      userForm,
    }
  }
};
</script>

<style lang="scss">
.pagination{
  float: right;
}
</style>
