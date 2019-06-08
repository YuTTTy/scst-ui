<template>
  <div class="logs-container">
    <el-card>
      <el-input size="small" v-model="searchEntity.name" style="width:20%" placeholder="请输入角色名查询">
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
      <el-button @click="search" size="mini" icon="el-icon-search" type="success">搜索</el-button>
      <br/>
      <br/>
      <el-table :data="list" style="width: 100%;margin-bottom: 20px;" row-key="id">
        <el-table-column prop="username" label="操作用户" width="120"></el-table-column>
        <el-table-column prop="operation" label="日志描述" width="170"></el-table-column>
        <el-table-column label="操作耗时" width="120">
          <template slot-scope="scope">
            <el-tag>{{scope.row.time}} 毫秒</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="method" label="操作方法" width="250" show-overflow-tooltip></el-table-column>
        <el-table-column prop="params" label="方法参数" width="200" show-overflow-tooltip></el-table-column>
        <el-table-column prop="ip" label="IP地址" width="180"></el-table-column>
        <el-table-column prop="location" label="地理位置" width="200"></el-table-column>
        <el-table-column prop="createTime" label="操作时间" width="200"></el-table-column>
        <el-table-column label="操作" align="center" min-width="150">
          <template slot-scope="scope">
            <el-button @click="handleDelete(scope.row.id)" size="mini" icon="el-icon-delete" type="danger"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                  @pagination="search"></pagination>
    </el-card>
  </div>
</template>

<script>
  import Pagination from '@/components/Pagination'
  import { getLogs, deleteLog} from "@/api/logs";

  export default {
    name: "logs",
    components: {Pagination},
    data() {
      return {
        list: [],
        searchEntity: {},
        loading: true,
        listQuery: {
          page: 1,
          limit: 10,
          importance: undefined,
          title: undefined,
          type: undefined,
          sort: '+id'
        },
        total: 0,
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
        getLogs(this.listQuery, this.searchEntity).then(response => {
          this.list = response.data.rows
          this.total = response.data.total
          this.loading = false;
        })
      },

      //触发删除按钮
      handleDelete(id) {
        this.$confirm('你确定永久删除此部门？, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteLog(id).then(response => {
            if (response.code == 200) {
              this._notify('删除成功', 'success')
            } else {
              this._notify(response.msg, 'error')
            }
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
  .logs-container {
    padding: 32px;
    background-color: rgb(240, 242, 245);
    position: relative;
  }
</style>

