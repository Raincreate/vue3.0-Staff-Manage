<template>
  <template v-for="menu in userMenu">
    <el-sub-menu 
        v-if="(menu.children && menu.children.length > 0 && menu.children[0].menuType == 1)" 
        :key="menu._id"
        :index="menu.path"
    >
        <template #title>
            <!-- <el-icon >
                <component :is="menu.icon"></component>
            </el-icon> -->
            <span>{{menu.menuName}}</span>
        </template>
        <tree-menu :userMenu="menu.children"></tree-menu>
    </el-sub-menu>
    <el-menu-item v-else-if="menu.menuType == 1" :key="menu._id" :index="menu.path">{{menu.menuName}}</el-menu-item>
  </template>
</template>

<script>
import { defineComponent } from 'vue'
export default defineComponent({
    name:'TreeMenu',
    props:{
        userMenu:{
            type:Array,
            default(){
                return []
            }
        }
    }
})
</script>

<style>

</style>