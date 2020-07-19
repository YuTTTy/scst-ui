<template>
  <div class="app-container">
    <el-card>
      <el-input v-model="query.name" size="small" style="width:20%;margin-right: 10px;" placeholder="请输入角色名查询">
        <i slot="prefix" class="el-input__icon el-icon-search" />
      </el-input>
      <el-button size="mini" icon="el-icon-search" type="success" @click="fetchData">搜索</el-button>
      <el-button type="primary" size="mini" icon="el-icon-plus" @click="handleAdd()">新增</el-button>
      <el-tooltip content="刷新" placement="bottom">
        <el-button icon="el-icon-refresh" circle style="float: right" @click="fetchData" />
      </el-tooltip>
      <br>
      <br>
      <!-- 列表 -->
      <el-table
        ref="table"
        v-loading="loading"
        :data="list"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        stripe
        size="mini"
        tooltip-effect="dark"
        style="width: 100%"
      >
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="description" label="描述" />
        <el-table-column prop="createTime" label="创建时间" width="150" />
        <el-table-column label="操作" align="center" width="200">
          <template slot-scope="scope">
            <el-button size="mini" icon="el-icon-edit" type="text" @click="handleAdd(scope.row.id)">修改</el-button>
            <el-button size="mini" icon="el-icon-plus" type="text" @click="handleViewPermission(scope.row.id)">权限</el-button>
            <el-button size="mini" icon="el-icon-delete" type="text" @click="handleDelete(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="pageConf.total>0"
        :total="pageConf.total"
        :page.sync="pageConf.page"
        :limit.sync="pageConf.limit"
        @pagination="fetchData"
      />
    </el-card>
    <Model :form.sync="form" :dialog-visible.sync="dialogVisible" @modelOpen="handleSubmit" />
    <Permissions :form.sync="form" :permission-dialog.sync="permissionDialog" @permissionModelOpen="handleSubmit" />
  </div>
</template>

<script>
  import Pagination from '@/components/Pagination'
  import Model from './components/model'
  import Permissions from './components/permissions'
  import { getRoleList, getRoleById, addRole, deleteRole, updateRole } from '@/api/role'

  export default {
    name: 'Index',
    components: { Pagination, Model, Permissions },
    data() {
      return {
        list: [],
        form: {},
        query: {},
        pageConf: {
          page: 1,
          limit: 10,
          total: 0
        },
        dialogVisible: false,
        permissionDialog: false,
        loading: true
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      fetchData() {
        this.loading = true
        getRoleList(this.pageConf, this.query).then(res => {
          this.list = res.data.rows
          this.pageConf.total = res.data.total
          this.loading = false
        })
      },
      handleViewPermission(id) {
        getRoleById(id).then(res => {
          this.form = res.data
          this.permissionDialog = true
        })
      },
      handleAdd() {
        this.dialogVisible = true
      },
      handleEdit(id) {
        getRoleById(id).then(res => {
          if (res.code === 200) {
            this.form = res.data
            this.dialogVisible = true
          } else {
            this.$message.error(res.msg)
          }
        })
      },
      handleSubmit() {
        this.dialogVisible = false
        this.permissionDialog = false
        if (this.form.id == undefined) {
          addRole(this.form).then(res => {
            if (res.code === 200) {
              this.fetchData()
              this.$message.success(res.msg)
            } else {
              this.$message.error(res.msg)
            }
          })
        } else {
          updateRole(this.form).then(res => {
            if (res.code === 200) {
              this.fetchData()
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
          deleteRole(id).then(res => {
            if (res.code === 200) {
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
