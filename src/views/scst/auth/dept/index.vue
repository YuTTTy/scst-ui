<template>
  <div class="app-container">
    <el-card>
      <el-button type="primary" size="mini" icon="el-icon-plus" @click="handleAdd">新增</el-button>
      <el-tooltip content="刷新" placement="bottom">
        <el-button icon="el-icon-refresh" circle style="float: right" @click="fetchData" />
      </el-tooltip>
      <br>
      <br>
      <el-table :data="list" style="width: 100%;margin-bottom: 20px;" row-key="id">
        <el-table-column prop="name" label="名称" />
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button size="mini" icon="el-icon-edit" type="text" @click="handleEdit(scope.row.id)">修改</el-button>
            <el-button size="mini" icon="el-icon-delete" type="text" @click="handleDelete(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <Model :form.sync="form" :dialog-visible.sync="dialogVisible" @modelOpen="handleSubmit" />
    </el-card>
  </div>
</template>

<script>
  import Model from './components/model'
  import { getDeptTree, getDeptById, deleteDept, addDept, updateDept } from '@/api/dept'

  export default {
    name: 'Index',
    components: { Model },
    data() {
      return {
        list: [],
        form: {},
        dialogVisible: false,
        loading: true
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      handleClose() {
        this.form = {}
        this.dialogVisible = false
      },
      fetchData() {
        this.loading = true
        getDeptTree().then(res => {
          this.list = res.data
          this.loading = false
        })
      },
      handleAdd() {
        this.dialogVisible = true
      },
      handleEdit(id) {
        getDeptById(id).then(res => {
          this.form = res.data
          this.dialogVisible = true
        })
      },
      handleSubmit() {
        if (this.form.id == null) {
          addDept(this.form).then(res => {
            if (res.code === 200) {
              this.fetchData()
              this.handleClose()
              this.$message.success(res.msg)
            } else {
              this.$message.error(res.msg)
            }
          })
        } else {
          updateDept(this.form).then(res => {
            if (res.code === 200) {
              this.fetchData()
              this.handleClose()
              this.$message.success(res.msg)
            } else {
              this.$message.error(res.msg)
            }
          })
        }
      },
      handleDelete(id) {
        this.$confirm('你确定永久删除此数据？, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteDept(id).then(res => {
            if (res.code === 200) {
              this.handleClose()
              this.fetchData()
              this.$message.success('删除成功')
            } else {
              this.$message.error(res.msg)
            }
          })
        }).catch(() => {
          this.$message.info('已取消删除')
        })
      }
    }
  }
</script>
