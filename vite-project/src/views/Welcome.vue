<script setup>

</script>

<template>
  <div class="welcome">
    <div class="content">
      <div class="sub-title">欢迎体验</div>
      <div class="title">公司员工内部管理系统</div>
      <div class="desc">vue3-Element+Node打造的公司内部员工管理系统</div>
      <!-- <div class="img"></div> -->
    </div>
  </div>
</template>

<style scoped lang="scss">
.welcome{
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background: #fff;
  .content{
    .sub-title{
      font-size: 30px;
      line-height: 42px;
      color: #333;
    }
    .title{
      font-size: 40px;
      line-height: 42px;
      color: #409eff;
    }
    .desc{
      text-align: right;
      font-size: 14px;
      color: #999;
    }

    // .img{

    // }
  }
}
</style>
