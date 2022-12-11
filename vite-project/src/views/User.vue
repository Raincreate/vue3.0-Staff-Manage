<template>
  <div class="user-manager">
    <div class="query-form">
      <el-form :inline="true" :model="user" ref="form" >
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
          <el-button @click="handleReset('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="handleAdd" >新增</el-button>
        <el-button type="danger" @click="handleManyDelete" >批量删除</el-button>
      </div>
      <el-table :data="userList"  style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column 
          v-for="item in columns" 
          :key="item.prop" 
          :prop="item.prop" 
          :label="item.label" 
          :formatter="item.formatter"
        />
        <el-table-column fixed="right" label="操作" width="150">
          <template #default="scope">
            <el-button  
              type="primary" 
              size="small"
              @click="handleEdit(scope.row)"
            >编辑</el-button>
            <el-button  
              type="danger" 
              size="small"
              @click="handleDelete(scope.row)"
            >删除</el-button>
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

    <el-dialog title="用户新增" v-model="showModal" :before-close="handleCloseDialog">
      <el-form 
        :model="userForm" 
        ref="dialogForm" 
        label-width="100px" 
        :rules="rules"
        
      >
        <el-form-item label="用户名" prop="userName">
          <el-input placeholder="请输入用户名" v-model="userForm.userName" :disabled="action == 'edit'"/>
        </el-form-item>
        <el-form-item label="邮箱" prop="userEmail">
          <el-input placeholder="请输入邮箱" v-model="userForm.userEmail" :disabled="action == 'edit'">
            <template #append>@jason.com</template>
          </el-input>
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
          <el-select 
            v-model="userForm.roleList" 
            placeholder="请选择用户系统角色"
            style="width:100%"
            multiple
          >
            <el-option 
              v-for="item in roleList" 
              :value="item._id" 
              :key="item._id" 
              :label="item.roleName" 
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门" prop="deptId" >
          <el-cascader 
            v-model="userForm.deptId"
            placeholder="请选择部门" 
            :options="deptList"
            :props="{ checkStrictly: true, value: '_id',label:'deptName' }" 
            
          />

        </el-form-item>
      </el-form>
      <template #footer>
            <span class="dialog-footer">
              <el-button @click="handleClose">取消</el-button>
              <el-button type="primary" @click="handleSubmit">
                确定
              </el-button>
            </span>
          </template>
    </el-dialog>
  </div>
</template>

<script >
import { onMounted,reactive,getCurrentInstance,ref,toRaw } from 'vue';
import utils from '../utils/utils'

export default{
  name:'user',
  setup(){
    const {proxy} = getCurrentInstance()
    // 生命周期
    onMounted(()=>{
      getUserList()
      // 为什么调用啊
      getDeptList()
      getRoleList()
    });
    const user = reactive({
      state: 0
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
            1:'在职',
            2:'离职',
            3:'试用期',
          }[value]
        }
      },
      {
        label:'注册时间',
        prop:'createTime',
        formatter(row,column,value){
          return utils.formateDate(new Date(value))
        }
      },
      {
        label:'最后登录时间',
        prop:'lastLoginTime',
        formatter(row,column,value){
          return utils.formateDate(new Date(value))
        }
      },
    ])
    
    const pages = reactive({
      pageNum:1,
      pageSize:10,
      total:10
    })
    const checkedUserIds = ref([]);
    // 函数调用
    const getUserList = async () =>{
      let params = {...user , ...pages}
      try {
        const { page,list } = await proxy.$api.userList(params)
        pages.total = page.total
        userList.value = list
      } catch (error) { }
    }
    // 查询
    const handleQuery = () => {
      getUserList()
    }
    // 重置
    const handleReset = (form) => {
      // console.log('asd');
      proxy.$refs[form].resetFields()
    }
    // 换页
    const handleCurrentChange = (current) =>{
      pages.pageNum = current
      getUserList()
    }
    const handleDelete = async (row) =>{
      const res = await proxy.$api.userDelete({
         userIds: [row.userId]
      })

      if(res.modifiedCount > 0){
        proxy.$message.success('删除成功！')
        getUserList()
      }else{
        proxy.$message.error('删除失败')
      }
    }

    const handleManyDelete = async () =>{
      if(checkedUserIds.value.length == 0){
        proxy.$message.error('请选择需要删除的对象')
        return
      }

      const res = await proxy.$api.userDelete({
         userIds:checkedUserIds.value
      })

      if(res.modifiedCount > 0){
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
      checkedUserIds.value = arr
    }

    const showModal = ref(false)
    // 新增
    const handleAdd = () => {
      showModal.value = true
      action.value= 'add'
    }
    const userForm = reactive({
      state:1
    })

    const rules = reactive({
      userName:[
        {
          required:true,
          message:'请输入用户名',
          trigger:'blur'
        }
      ],
      userEmail:[
        {
          required:true,
          message:'请输入用户邮箱',
          trigger:'blur'
        }
      ],
      deptId:[
        {
          required:true,
          message:'请选择部门',
          trigger:'blur'
        }
      ],
      mobile:[
        {
          pattern:/1[3-9]\d{9}/,
          message:'请输入正确的手机格式',
          trigger:'blur'
        }
      ]
    })

    // 角色列表
    const roleList = ref([])
    const getRoleList = async() =>{
      const res = await proxy.$api.getRoleLists()
      roleList.value = res
    }
    // 部门列表
    const deptList = ref([])
    const getDeptList = async() =>{
      const res = await proxy.$api.getDeptList()
      deptList.value = res
    }

    const handleClose  = () =>{
      showModal.value = false
      handleReset('dialogForm')
    }

    const action = ref('add')
    // 上交
    const handleSubmit = () =>{
      proxy.$refs.dialogForm.validate(async (valid)=>{
        if(valid){
          let params = toRaw(userForm)
          console.log('params::::',params);
          params.userEmail += "@jason.com"
          params.action = action.value
          let res = await proxy.$api.userSubmit(params)
          console.log('rewess',res);
          if(res){
            showModal.value = false
            if(action.value == 'add'){
              proxy.$message.success('新增用户成功！')
            }else{
              proxy.$message.success('编辑用户成功！')
            }
            handleReset('dialogForm')
            getUserList()
          }
        }
      })
    }

    // 编辑
    const handleEdit = (row) =>{
      action.value = 'edit'
      showModal.value = true
      proxy.$nextTick(()=>{
        // 状态的更改
        row.state = Number(row.state)
        Object.assign(userForm,row)
      })
    }

    const handleCloseDialog = () =>{
      handleReset('dialogForm')
      showModal.value = false
    }
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
      checkedUserIds,
      handleSelectionChange,
      showModal,
      handleAdd,
      userForm,
      rules,
      getRoleList,
      roleList,
      getDeptList,
      deptList,
      handleClose,
      handleSubmit,
      handleEdit,
      action,
      handleCloseDialog
    }
  }
};
</script>

<style lang="scss">
.pagination{
  float: right;
}
</style>
