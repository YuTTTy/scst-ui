<template>
  <div class="menu-container">
    <el-card>
      <el-input size="small" v-model="searchEntity.name" style="width:20%" placeholder="请输入名称查询">
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
      <el-button @click="search" size="mini" icon="el-icon-search" type="success">搜索</el-button>
      <el-button type="primary" size="mini" @click="handleSave()" icon="el-icon-plus">新增</el-button>
      <br/>
      <br/>
      <el-table :data="list" style="width: 100%;margin-bottom: 20px;" row-key="id">
        <el-table-column prop="name" label="名称" width="180"></el-table-column>
        <el-table-column label="图标" width="180">
          <template slot-scope="scope">
            <svg-icon :icon-class="scope.row.icon" class-name="disabled" />
          </template>
        </el-table-column>
        <el-table-column prop="url" label="链接地址" width="180"></el-table-column>
        <el-table-column prop="component" label="组件地址" width="180"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="250"></el-table-column>
        <el-table-column label="操作" align="center" min-width="150">
          <template slot-scope="scope">
            <el-button @click="handleSave(scope.row.id)" size="mini" icon="el-icon-edit" type="warning"></el-button>
            <el-button @click="handleDelete(scope.row.id)" size="mini" icon="el-icon-delete" type="danger"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <div v-for="item of svgIcons" :key="item">
        <svg-icon :icon-class="item" class-name="disabled" />
        <span>{{ item }}</span>
      </div>
    </el-card>
  </div>
</template>

<script>
  import svgIcons from './svg-icons'
  import {parseTime} from '@/utils/index'
  import Save from './save'
  import { getMenuTree, findMenu, deleteMenu} from "@/api/menu";

  export default {
    name: "index",
    components: {Save},
    data() {
      return {
        svgIcons,

        list: [], //用户列表数据
        searchEntity: {}, //查询实体类
        sonData: null,
        saveDialog: false,
        loading: true,
      }
    },
    created() {
      this.search();
    },
    methods: {
      _notify(message, type) {
        this.$message({
          message: message,
          type: type
        })
      },

      //获取权限按钮列表
      search() {
        this.loading = true;
        getMenuTree(this.listQuery, this.searchEntity).then(response => {
          this.list = response.data
          this.loading = false;
        })
      },

      //触发新增、更新，传递给子组件完成操作
      handleSave(id) {
        if (id == undefined) {
          //新增
          this.sonData = {id: null, createTime: parseTime(new Date()), deptId: [], status: 'false'};
        } else {
          //更新
          findMenu(id).then(response => {
            this.sonData = response.data;
          })
        }
      },

      //触发删除按钮
      handleDelete(id) {
        this.$confirm('你确定永久删除此账户？, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteMenu(id).then(response => {
            if (response.code == 200) {
              this._notify('删除成功', 'success')
            } else {
              this._notify(response.msg, 'error')
            }
            this.$refs.table.clearSelection();
            this.search()
          })
        }).catch(() => {
          this._notify('已取消删除', 'info')
        });
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

