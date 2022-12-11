<template>
  <div class="user-manager">
    <div class="query-form">
      <el-form :inline="true" :model="queryForm" ref="form" >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="queryForm.roleName" placeholder="请输入角色名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="handleReset()">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="handleAdd(1)">创建</el-button>
      </div>
      <el-table :data="roleList"  style="width: 100%" row-key="_id">
        <el-table-column 
          v-for="item in columns" 
          :key="item.prop" 
          :prop="item.prop" 
          :label="item.label" 
          :formatter="item.formatter"
          width="180" />
        <el-table-column fixed="right" label="操作" width="220">
          <template #default="scope">
            <el-button link type="primary" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button link type="primary" @click="handleAdd(2,scope.row)">设置权限</el-button>
            <el-button link type="danger" @click="handleDelete(scope.row._id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination 
        background 
        layout="prev, pager, next" 
        :total="pager.total" 
        class="pagination"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- <el-dialog 
      title="菜单新增" 
      v-model="showModal" 
      :before-close="handleCloseDetail">
      <el-form 
        :model="menuForm" 
        ref="dialogForm" 
        label-width="100px" 
        :rules="rules"
      >
        <el-form-item label="父级菜单" prop="parentId">
          <el-cascader 
            v-model="menuForm.parentId"
            :options="roleList" 
            :props="{ checkStrictly: true,value:'_id', label:'menuName' }" 
            clearable 
          />
          <span>不选默认是创建一级菜单</span>
        </el-form-item>
        <el-form-item label="菜单类型" prop="menuType">
          <el-radio-group v-model="menuForm.menuType">
            <el-radio :label="1">菜单</el-radio>
            <el-radio :label="2">按钮</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="菜单名称" prop="menuName">
          <el-input placeholder="请输入菜单的名称" v-model="menuForm.menuName" />
        </el-form-item>
        <el-form-item label="菜单图标" prop="icon" v-show="menuForm.menuType === 1">
          <el-input placeholder="请输入菜单图标" v-model="menuForm.icon" />
        </el-form-item>
        <el-form-item label="路由地址" prop="path" v-show="menuForm.menuType === 1">
          <el-input placeholder="请输入路由地址" v-model="menuForm.path" />
        </el-form-item>
        <el-form-item label="权限标识" prop="menuCode" v-show="menuForm.menuType === 2">
          <el-input placeholder="请输入权限标识" v-model="menuForm.menuCode" />
        </el-form-item>
        <el-form-item label="组件路径" prop="component" v-show="menuForm.menuType === 1">
          <el-input placeholder="请输入组件路径" v-model="menuForm.component" />
        </el-form-item>
        <el-form-item label="菜单状态" prop="menuState" v-show="menuForm.menuType === 1">
          <el-radio-group v-model="menuForm.menuState">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="2">停用</el-radio>
          </el-radio-group>
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
      
    </el-dialog> -->
  </div>
</template>

<script >
import utils from '../utils/utils'

export default{
  name:'Menu',
  data(){
    return {
      queryForm: {
        roleName:'',
      },
      roleList: [],
      columns:[
        {
          label:'角色名称',
          prop:'roleName',
        },
        {
          label:'备注',
          prop:'remark',
        },
        {
          label:'权限列表',
          prop:'menuType',
        },
        {
          label:'更新时间',
          prop:'',
          formatter(row,colum,value){
            return utils.formateDate(new Date(value))
          }
        },
        {
          label:'创建时间',
          prop:'createTime',
          formatter(row,colum,value){
            return utils.formateDate(new Date(value))
          }
        },
      ],
      pager: {
        total: 0,
        pageSize: 10
      }
    };
  },
  mounted(){
    this.getRoleList()
  },
  methods:{
    async getRoleList(){
      const { list, page } = await this.$api.roleList(this.queryForm)
      this.roleList = list
      this.pager = page
    },
    
  }
};
</script>

<style lang="scss">
.pagination{
  float: right;
}
</style>
