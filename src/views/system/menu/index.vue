<template>
  <div class="menu-container">
    <el-card>
      <el-table :data="list" row-key="id" v-loading="loading"
                element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading">
        <el-table-column prop="name" label="名称" min-width="300"></el-table-column>
        <el-table-column label="图标" min-width="180">
          <template slot-scope="scope">
            <svg-icon v-if="scope.row.icon != null" :icon-class="scope.row.icon" class-name="disabled" />
          </template>
        </el-table-column>
        <el-table-column prop="path" label="链接地址" min-width="250"></el-table-column>
        <el-table-column prop="perms" label="权限标识" min-width="200"></el-table-column>
        <el-table-column prop="component" label="组件地址" min-width="250"></el-table-column>
      </el-table>

    </el-card>
  </div>
</template>

<script>
  import { getMenuTree } from "@/api/menu";
  export default {
    name: "index",
    data() {
      return {
        list: null,
        saveDialog: false,
        loading: true,
      }
    },
    created() {
      this.search();
    },
    methods: {
      //获取权限按钮列表
      search() {
        this.loading = true;
        getMenuTree().then(response => {
          this.list = response.data
          this.loading = false;
        })
      },
    },
  }
</script>

<style lang="scss" scoped>
  .menu-container {
    padding: 32px;
    background-color: rgb(240, 242, 245);
    position: relative;
  }
</style>
