<template>
  <div class="app-container">
    <el-card>
      <el-input v-model="query.username" size="small" style="width:20%;margin-right: 10px;" placeholder="请输入操作用户查询">
        <i slot="prefix" class="el-input__icon el-icon-search" />
      </el-input>
      <el-button size="mini" icon="el-icon-search;" type="success" @click="fetchData">搜索</el-button>
      <el-tooltip content="刷新" placement="bottom">
        <el-button icon="el-icon-refresh" circle style="float: right" @click="fetchData" />
      </el-tooltip>
      <br>
      <br>
      <el-table :data="list" style="width: 100%;margin-bottom: 20px;" row-key="id">
        <el-table-column prop="username" label="操作用户" width="120" />
        <el-table-column prop="operation" label="日志描述" />
        <el-table-column label="操作耗时" width="120">
          <template slot-scope="scope">
            <el-tag>{{ scope.row.time }} 毫秒</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="ip" label="IP地址" width="120" />
        <el-table-column prop="location" label="地理位置" />
        <el-table-column prop="createTime" label="操作时间" width="160" />
        <el-table-column label="操作" align="center" width="160">
          <template slot-scope="scope">
            <el-button size="mini" icon="el-icon-view" type="text" @click="handleDelete(scope.row.id)">查看</el-button>
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
  </div>
</template>

<script>
  import Pagination from '@/components/Pagination'
  import { getLogList, deleteLog } from '@/api/logs'

  export default {
    name: 'Index',
    components: { Pagination },
    data() {
      return {
        list: [],
        query: {},
        pageConf: {
          page: 1,
          limit: 10,
          total: 0
        },
        loading: true
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      fetchData() {
        this.loading = true
        if (this.query.timeField != null) {
          const timeField = this.query.timeField[0] + ',' + this.query.timeField[1]
          this.query.timeField = timeField
        }
        getLogList(this.pageConf, this.query).then(res => {
          this.list = res.data.rows
          this.pageConf.total = res.data.total
          this.loading = false
        })
      },
      handleDelete(id) {
        this.$confirm('你确定永久删除此数据？, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteLog(id).then(res => {
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
