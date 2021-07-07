<template>
  <div class="app-container">
    <el-card>
      <el-collapse v-model="activeNames">
        <el-collapse-item title="项目介绍" name="1">
          <div>一套基于SpringCloud Alibaba & Nacos构建的分布式权限管理系统。</div>
          <div>基于SpringBoot 2.3.1.RELEASE</div>
          <div>基于SpringCloud Hoxton.SR6</div>
          <div>基于SpringCloud Alibaba 2.2.1.RELEASE</div>
        </el-collapse-item>
        <el-collapse-item title="项目源码" name="2">
          <div>后端源码：<a href="https://github.com/TyCoding/scst" target="_blank">https://github.com/TyCoding/scst</a></div>
          <div>前端源码：<a href="https://github.com/TyCoding/scst-ui" target="_blank">https://github.com/TyCoding/scst-ui</a></div>
          <div>项目源码：<a href="https://docs.scst.tycoding.cn" target="_blank">https://docs.scst.tycoding.cn</a></div>
        </el-collapse-item>
        <el-collapse-item title="联系我" name="3">
          <div>Blog: <a href="https://tycoding.cn/" target="_blank">https://tycoding.cn</a></div>
          <div>Github: <a href="https://github.com/TyCoding" target="_blank">https://github.com/TyCoding</a></div>
          <div>公众号：程序员涂陌</div>
          <div>QQ群：671017003</div>
        </el-collapse-item>
      </el-collapse>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Index',
  data() {
    return {
      activeNames: ['1', '2', '3', '4']
    }
  },
  created() {

  }
}
</script>
<style lang="css" scoped>
  .el-collapse{
    text-align: center;
  }
  ::v-deep .el-collapse-item__header{
    display: block !important;
  }
  a {
    color: #3b91b6;
  }
</style>
