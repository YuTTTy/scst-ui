<template>
  <div class="dept-container">
    <el-card>
      <el-button type="primary" size="mini" @click="handleSave()" icon="el-icon-plus">新增</el-button>
      <br/>
      <br/>
      <el-table :data="list" style="width: 100%;margin-bottom: 20px;" row-key="id">
        <el-table-column prop="name" label="名称" width="520"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="250"></el-table-column>
        <el-table-column label="操作" align="center" min-width="150">
          <template slot-scope="scope">
            <el-button @click="handleSave(scope.row.id)" size="mini" icon="el-icon-edit" type="warning"></el-button>
            <el-button @click="handleDelete(scope.row.id)" size="mini" icon="el-icon-delete" type="danger"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 子组件：新增、更新窗口 -->
      <save :sonData="sonData" @sonStatus="saveStatus"></save>
    </el-card>
  </div>
</template>

<script>
  import Save from './save'
  import { getDeptTree, findDept, deleteDept} from "@/api/dept";

  export default {
    name: "index",
    components: {Save},
    data() {
      return {
        list: [],
        sonData: null,
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
        getDeptTree(this.listQuery, this.searchEntity).then(response => {
          this.list = response.data
          this.loading = false;
        })
      },

      //触发新增、更新，传递给子组件完成操作
      handleSave(id) {
        if (id == undefined) {
          //新增
          this.sonData = {id: null};
        } else {
          //更新
          findDept(id).then(response => {
            this.sonData = response.data;
          })
        }
      },
      saveStatus(data) {
        if (data) {
          this.search();
        }
      },

      //触发删除按钮
      handleDelete(id) {
        this.$confirm('你确定永久删除此部门？, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteDept(id).then(response => {
            this.$message.success(response.msg)
            this.search()
          })
        }).catch(() => {
          this.$message.info('已取消删除')
        });
      },
    },
  }
</script>

<style lang="scss" scoped>
  .dept-container {
    padding: 32px;
    background-color: rgb(240, 242, 245);
    position: relative;
  }
</style>

