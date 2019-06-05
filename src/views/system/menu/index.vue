<template>
  <div class="menu-container">
    <el-card>
      <!-- 功能按钮 -->
      <el-row :gutter="15" type="flex">
        <el-col :span="17">
          <el-card>
            <div slot="header">
              <label>角色列表</label>
            </div>
            <el-input size="small" v-model="searchEntity.username" style="width:20%" placeholder="请输入用户名查询">
              <i slot="prefix" class="el-input__icon el-icon-search"></i>
            </el-input>
            <el-button @click="search" size="mini" icon="el-icon-search" type="success">搜索</el-button>
            <el-button type="primary" size="mini" @click="handleSave()" icon="el-icon-plus">新增</el-button>
            <br/>
            <br/>
            <!-- 列表 -->
            <el-table ref="table" :data="list" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" stripe size="mini" tooltip-effect="dark" style="width: 100%">
              <el-table-column prop="name" label="名称" min-width="250"></el-table-column>
              <el-table-column prop="description" label="描述" min-width="250"></el-table-column>
              <el-table-column prop="createTime" label="创建时间" min-width="300"></el-table-column>
              <el-table-column label="操作" align="center" min-width="150">
                <template slot-scope="scope">
                  <el-button @click="handleSave(scope.row.id)" size="mini" icon="el-icon-edit" type="warning"></el-button>
                  <el-button @click="handleDelete(scope.row.id)" size="mini" icon="el-icon-delete" type="danger"></el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 子组件：新增、更新窗口 -->
            <!--            <save :sonData="sonData" @sonStatus="saveDialog"></save>-->
            <!-- 分页 -->
            <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                        @pagination="search"></pagination>
          </el-card>
        </el-col>
        <el-col :span="7">
          <el-card>
            <div slot="header">
              <label>{{switchLabel}}</label>
              <el-button style="float: right;margin-top: -4px;" size="mini" type="primary">保存</el-button>
            </div>
            <el-tree class="filter-tree"
                     :data="switchLabel == '菜单分配' ? menuTree : permTree" :props="treeProps"
                     @node-click="handleDeptNodeClick"
                     show-checkbox
                     @check-change="handleCheckChange"
                     :expand-on-click-node="false" :filter-node-method="filterDeptNode" ref="tree"></el-tree>
          </el-card>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import {parseTime} from '@/utils/index'
  import Pagination from '@/components/Pagination'
  import Save from './save'
  import { getUsers, findUser, addUser, deleteUser, updateUser, getUserMenus } from "@/api/user"
  import { getRoles } from '@/api/role'
  import { getDeptTree } from '@/api/dept'

  export default {
    name: "index",
    components: {Pagination, Save},
    data() {
      return {
        list: [], //用户列表数据

        filterText: '', //查询节点过滤
        searchEntity: {}, //查询实体类
        listQuery: {
          page: 1,
          limit: 3,
          importance: undefined,
          title: undefined,
          type: undefined,
          sort: '+id'
        },
        total: 0,
        sonData: null,
        saveDialog: false,
        //部门Tree数据
        deptTree: [{
          id: 0,
          name: 'Root',
          children: []
        }],
        treeProps: {
          children: 'children',
          label: 'name'
        },
        loading: true,
      }
    },
    computed: {
      //从vuex中获取登录用户数据
      ...mapGetters([
        'name',
        'avatar',
        'roles'
      ])
    },
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val);
      }
    },
    created() {
      this.init(); //初始化
      this.search();
    },
    methods: {
      _notify(message, type) {
        this.$message({
          message: message,
          type: type
        })
      },
      init() {
        //获取Dept Tree
        getDeptTree().then(response => {
          this.deptTree[0].children = response.data;
        })
      },

      //过滤节点
      filterDeptNode(value, data) {
        if (!value) return true;
        return data.name.indexOf(value) !== -1;
      },
      //节点点击事件
      handleDeptNodeClick(data) {
        this.searchEntity.deptId = data.id
        this.search();
      },

      //获取用户列表
      search() {
        this.loading = true;
        getUsers(this.listQuery, this.searchEntity).then(response => {
          this.list = response.data.rows
          this.total = response.data.total
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
          findUser(id).then(response => {
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
          deleteUser(id).then(response => {
            if (response.code == 200) {
              this._notify('删除成功', 'success')
            } else {
              this._notify(response.msg, 'error')
            }
            this.$refs.table.clearSelection();
            this.selectIds = [];
            this.search()
          })
        }).catch(() => {
          this._notify('已取消删除', 'info')
        });
      },

      //触发导出按钮
      handleExcel() {

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

