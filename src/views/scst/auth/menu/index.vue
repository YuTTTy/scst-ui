<template>
  <div class="app-container">
    <el-card>
      <el-tooltip content="刷新" placement="bottom">
        <el-button icon="el-icon-refresh" circle style="float: right" @click="fetchData" />
      </el-tooltip>
      <br>
      <br>
      <el-table
        v-loading="loading"
        :data="list"
        row-key="id"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
      >
        <el-table-column prop="name" label="名称" min-width="300" />
        <el-table-column label="图标" width="100">
          <template slot-scope="scope">
            <svg-icon v-if="scope.row.meta.icon != null" :icon-class="scope.row.meta.icon" class-name="disabled" />
          </template>
        </el-table-column>
        <el-table-column prop="path" label="链接地址" min-width="200" />
        <el-table-column prop="perms" label="权限标识" min-width="200" />
        <el-table-column label="是否隐藏" min-width="120">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.hidden" type="info">是</el-tag>
            <el-tag v-else type="success">否</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否是外链" min-width="120">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.frame" type="info">是</el-tag>
            <el-tag v-else type="success">否</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="component" label="组件地址" min-width="250" />
      </el-table>
    </el-card>
  </div>
</template>

<script>
  import { getMenuTree } from '@/api/menu'

  export default {
    name: 'Index',
    data() {
      return {
        list: [],
        loading: true
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      fetchData() {
        this.loading = true
        getMenuTree().then(res => {
          this.list = res.data
          this.loading = false
        })
      }
    }
  }
</script>
