<template>
  <div class="app-container">
    <h4 class="tab-header">登录日志</h4>
    <div class="tab-view" style="display: block;">
      <el-form size="mini" :inline="true">
        <el-form-item>
          <el-input v-model="query.location" placeholder="请输入登录地点查询" style="width: 300px" />
        </el-form-item>
        <el-form-item style="padding: 0;margin: 0">
          <el-button type="success" icon="el-icon-search" @click="fetchData" />
        </el-form-item>
      </el-form>
      <div class="table-responsive">
        <el-table
          :data="list"
          tooltip-effect="dark"
          style="width: 100%"
          size="mini"
        >
          <el-table-column prop="username" label="登录账户" width="110" />
          <el-table-column prop="ip" label="登录IP" width="120" />
          <el-table-column prop="location" label="登录地点" />
          <el-table-column prop="device" label="登录设备" />
          <el-table-column prop="createTime" label="登录时间" width="150" />
          <el-table-column label="操作" width="50">
            <template slot-scope="scope">
              <el-button type="text" icon="el-icon-delete" @click="handleDel(scope.row.id)" />
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="pageConf.total>0" :total="pageConf.total" :page.sync="pageConf.page" :limit.sync="pageConf.limit" @pagination="fetchData" />
      </div>
    </div>
  </div>
</template>
<script>
  import Pagination from '@/components/Pagination'
  export default {
    name: 'LogCard',
    components: { Pagination },
    data() {
      return {
        list: [],
        pageConf: {
          page: 1,
          limit: 8,
          total: 12
        },
        query: {}
      }
    },
    methods: {
      fetchData() {
        //  getLoginLogList(this.query, this.pageConf).then(res => {
        //   if (res.code === 200) {
        //     this.list = res.data.rows
        //     this.pageConf.total = res.data.total
        //   } else {
        //     this.$message.error(res.msg)
        //   }
        // })
      },
      handleDel(id) {
        this.$confirm('你确定永久删除此数据？, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          /* loginLogDel(id).then(res => {
            if (res.code === 200) {
              this.fetchData()
              this.$message.success('删除成功')
            } else {
              this.$message.error(res.msg)
            }
          })*/
        }).catch(() => {
          this.$message.info('已取消删除')
        })
      }
    }
  }
</script>
<style lang="css" scoped>
  ::v-deep h4.tab-header{margin-bottom:12px;color:rgba(0,0,0,.85);font-weight:500;font-size:20px;line-height:28px}
    ::v-deep .tab-view{display:flex;padding-top:12px}.tab-left{min-width:280px;max-width:448px}.tab-right{flex:1 1;padding-left:104px}
</style>
