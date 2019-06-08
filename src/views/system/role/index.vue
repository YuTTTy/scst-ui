<template>
  <div class="role-container">
    <el-card>
      <!-- 功能按钮 -->
      <el-row :gutter="15" type="flex">
        <el-col :span="17">
          <el-card>
            <div slot="header">
              <label>角色列表</label>
            </div>
            <el-input size="small" v-model="searchEntity.name" style="width:20%" placeholder="请输入角色名查询">
              <i slot="prefix" class="el-input__icon el-icon-search"></i>
            </el-input>
            <el-button @click="search" size="mini" icon="el-icon-search" type="success">搜索</el-button>
            <el-button type="primary" size="mini" @click="handleSave()" icon="el-icon-plus">新增</el-button>
            <br/>
            <br/>
            <!-- 列表 -->
            <el-table ref="table" :data="list" v-loading="loading" highlight-current-row
                      @current-change="handleCurrentChange"
                      element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" stripe size="mini" tooltip-effect="dark" style="width: 100%">
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
            <save :sonData="sonData" @sonStatus="saveStatus"></save>
            <!-- 分页 -->
            <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                        @pagination="search"></pagination>
          </el-card>
        </el-col>
        <el-col :span="7">
          <el-card>
            <div slot="header">
              <label>菜单权限</label>
              <el-button @click="updateMenus" :disabled="this.form.menuIds == undefined ? true : false" style="float: right;margin-top: -4px;" size="mini" icon="el-icon-check" type="primary">保存</el-button>
            </div>
            <el-tree :data="menuTree" :props="treeProps"
                     node-key="id"
                     :default-checked-keys="form.menuIds"
                     :default-expanded-keys="form.menuIds"
                     highlight-current show-checkbox check-strictly
                     @check-change="handleCheckChange"
                     :expand-on-click-node="false" ref="tree"></el-tree>
          </el-card>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
  import Pagination from '@/components/Pagination'
  import Save from './save'
  import { getRoles, findRole, deleteRole, updateRole } from "@/api/role"
  import { getMenuTree } from "@/api/menu";

  export default {
    name: "index",
    components: {Pagination, Save},
    data() {
      return {
        list: [],
        searchEntity: {},
        listQuery: {
          page: 1,
          limit: 10,
          importance: undefined,
          title: undefined,
          type: undefined,
          sort: '+id'
        },
        total: 0,
        sonData: null,
        saveDialog: false,
        menuTree: [], //菜单Tree
        treeProps: {
          children: 'children',
          label: 'name'
        },
        form: {},
        loading: true,
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
        //获取菜单Tree
        getMenuTree().then(response => {
          this.menuTree = response.data
        })
      },
      //节点勾选事件
      handleCheckChange(data) {
        if (this.form.menuIds != undefined && this.form.menuIds != null) {
          this.form.menuIds = this.$refs.tree.getCheckedKeys()
        }
      },
      //触发表格行单选
      handleCurrentChange(val) {
        if (val != null) {
          this.form = {}
          this.$refs.tree.setCheckedKeys([]);
          findRole(val.id).then(response => {
            this.form = response.data;
            if (response.data.menuIds.length == 0 || response.data.menuIds[0] == null) {
              this.form.menuIds = []
            }
          })
        }
      },

      //获取用户列表
      search() {
        this.loading = true;
        getRoles(this.listQuery, this.searchEntity).then(response => {
          this.list = response.data.rows
          this.total = response.data.total
          this.loading = false;
        })
      },

      //触发新增、更新，传递给子组件完成操作
      handleSave(id) {
        if (id == undefined) {
          //新增
          this.$refs.tree.setCheckedKeys([]);
          this.sonData = {id: null};
        } else {
          //更新
          findRole(id).then(response => {
            this.sonData = response.data;
          })
        }
      },

      saveStatus(data) {
        if (data) {
          this.search();
        }
      },

      //更新角色权限列表
      updateMenus() {
        if (!this.form.menuIds.length) {
          this._notify('请选择该角色对应的权限', 'warning')
          return;
        }
        updateRole(this.form).then(response => {
          this.search();
          this.$refs.tree.setCheckedKeys([]);
          this.form = {}
          if (response.code == 200) {
            this._notify('更新权限列表成功', 'success')
          } else {
            this._notify('更新权限列表失败', 'error')
          }
        })
      },

      //触发删除按钮
      handleDelete(id) {
        this.$confirm('你确定永久删除此角色？, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteRole(id).then(response => {
            if (response.code == 200) {
              this._notify('删除成功', 'success')
            } else {
              this._notify('删除失败', 'error')
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
  .role-container {
    padding: 32px;
    background-color: rgb(240, 242, 245);
    position: relative;
  }
</style>

