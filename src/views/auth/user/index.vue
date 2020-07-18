<template>
  <div class="app-container">
    <el-card>
      <el-row :gutter="15" type="flex">
        <el-col :span="4">
          <el-input v-model="filterText" size="small" placeholder="输入部门名称搜索">
            <i slot="prefix" class="el-input__icon el-icon-search" />
          </el-input>
          <br>
          <br>
          <el-tree
            ref="tree"
            class="filter-tree"
            :data="deptTree"
            :props="treeProps"
            :expand-on-click-node="false"
            default-expand-all
            :filter-node-method="filterDeptNode"
            @node-click="handleDeptNodeClick"
          />
        </el-col>
        <el-col :span="20">
          <el-input v-model="query.username" size="small" style="width:20%;margin-right: 10px;" placeholder="请输入用户名查询">
            <i slot="prefix" class="el-input__icon el-icon-search" />
          </el-input>
          <el-select v-model="query.status" size="small" style="margin-right: 10px;" placeholder="请选择用户状态查询">
            <el-option key="0" label="所有" value="" />
            <el-option key="1" label="有效" value="true" />
            <el-option key="2" label="锁定" value="false" />
          </el-select>
          <el-button size="mini" icon="el-icon-search" type="success" @click="fetchData">搜索</el-button>
          <el-button type="primary" size="mini" icon="el-icon-plus" @click="handleAdd">新增</el-button>
          <el-button type="warning" size="mini" icon="el-icon-download" @click="handleExcel">导出</el-button>
          <el-tooltip content="刷新" placement="bottom">
            <el-button icon="el-icon-refresh" circle style="float: right" @click="fetchData" />
          </el-tooltip>
          <br>
          <br>
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
            <el-table-column prop="username" label="用户名" min-width="110" />
            <el-table-column prop="roles" label="角色" min-width="100">
              <template slot-scope="scope">
                <el-tag v-for="role in scope.row.roles" :key="role.id" type="success">{{ role.name }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="deptName" label="部门" min-width="120" />
            <el-table-column prop="phone" label="电话" width="100" />
            <el-table-column prop="createTime" label="创建时间" width="150" />
            <el-table-column prop="status" label="状态" width="100">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.status">激活</el-tag>
                <el-tag v-else type="danger">锁定</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button size="mini" type="text" icon="el-icon-edit" @click="handleEdit(scope.row.id)">修改</el-button>
                <el-button
                  size="mini"
                  icon="el-icon-delete"
                  type="text"
                  @click="handleDelete(scope.row.id)"
                >删除
                </el-button>
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
          <Model :form.sync="form" :dialog-visible.sync="dialogVisible" @modelOpen="handleSubmit" />
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import Pagination from '@/components/Pagination'
  import Model from './components/model'
  import { getUserList, getUserById, deleteUser, addUser, updateUser } from '@/api/user'
  import { getDeptTree } from '@/api/dept'

  export default {
    name: 'Index',
    components: { Pagination, Model },
    data() {
      return {
        list: [],
        filterText: '',
        form: {},
        query: {},
        pageConf: {
          page: 1,
          limit: 10,
          total: 0
        },
        deptTree: [{
          id: 0,
          name: 'Root',
          children: []
        }],
        treeProps: {
          children: 'children',
          label: 'name'
        },
        dialogVisible: false,
        loading: true
      }
    },
    computed: {
      ...mapGetters([
        'name'
      ])
    },
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val)
      }
    },
    created() {
      this.init()
      this.fetchData()
    },
    methods: {
      init() {
        getDeptTree().then(res => {
          this.deptTree[0].children = res.data
        })
      },
      filterDeptNode(value, data) {
        if (!value) return true
        return data.name.indexOf(value) !== -1
      },
      handleDeptNodeClick(data) {
        this.searchEntity.deptId = data.id
        this.fetchData()
      },
      fetchData() {
        this.loading = true
        getUserList(this.pageConf, this.query).then(res => {
          this.list = res.data.rows
          this.pageConf.total = res.data.total
          this.loading = false
        })
      },
      handleAdd() {
        this.dialogVisible = true
      },
      handleEdit(id) {
        getUserById(id).then(res => {
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
        if (this.form.id == undefined) {
          addUser(this.form).then(res => {
            if (res.code === 200) {
              this.fetchData()
              this.$message.success(res.msg)
            } else {
              this.$message.error(res.msg)
            }
          })
        } else {
          updateUser(this.form).then(res => {
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
          deleteUser(id).then(res => {
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
      },

      // 触发导出按钮
      handleExcel() {

      }

    }
  }
</script>
