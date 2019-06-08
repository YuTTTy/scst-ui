<template>
  <el-dialog :title="dialogTitle" :before-close="handleClose" :visible.sync="dialogVisible" width="32.4%">
    <el-form ref="form" :model="form" :rules="rules" status-icon>
      <el-form-item prop="name" label="菜单名称" label-width="80px">
        <el-input v-model="form.name" placeholder="请输入菜单名称"></el-input>
      </el-form-item>
      <el-form-item prop="type" label="类型选择" label-width="80px" :rules="{required: true, trigger: 'blur', message: '请选择菜单类型'}">
        <el-radio v-model="form.type" label="menu">菜单</el-radio>
        <el-radio v-model="form.type" label="button">按钮</el-radio>
      </el-form-item>
      <el-form-item prop="permission" label="权限标识" label-width="80px" :rules="{required: true, trigger: 'blur', message: '请输入权限标识'}">
        <el-input v-model="form.permission" placeholder="请输入权限标识"></el-input>
      </el-form-item>
      <el-form-item v-if="form.type == 'menu'" prop="icon" label="菜单图标" label-width="80px">
        <el-select v-model="form.icon" popper-class="icon-select" filterable placeholder="请选择菜单图标">
          <el-option
            class="icon-option"
            v-for="item of svgIcons"
            :key="item"
            :label="item"
            :value="item">
            <svg-icon :icon-class="item" class-name="disabled" />
            <span>{{ item }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="form.type == 'menu'" prop="url" label="链接地址" label-width="80px">
        <el-input v-model="form.url" placeholder="请输入链接地址"></el-input>
      </el-form-item>
      <el-form-item v-if="form.type == 'menu'" prop="component" label="组件地址" label-width="80px">
        <el-input v-model="form.component" placeholder="请输入组件地址"></el-input>
      </el-form-item>
      <el-form-item prop="menuId" v-model="pid" label="上级菜单" label-width="80px">
        <el-tree :data="menuTree" ref="tree" highlight-current show-checkbox check-strictly
                 :default-checked-keys="pid"
                 :default-expanded-keys="pid"
                 node-key="id"
                 @check-change="checkChange"
                 :props="treeProps"></el-tree>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">
        取消
      </el-button>
      <el-button type="primary" @click="onSubmit('form')">
        保存
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
  import svgIcons from './svg-icons'
  import {addMenu, updateMenu, checkMenuName, getMenuTree} from '@/api/menu'

  export default {
    //父组件向子组件传值，通过props获取。
    //一旦父组件改变了`sonData`对应的值，子组件的`sonData`会立即改变，通过watch函数可以实时监听到值的变化
    //`props`不属于data，但是`props`中的参数可以像data中的参数一样直接使用
    props: ['sonData'],

    data() {
      var validateName = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请输入菜单名称'))
        }
        checkMenuName(value, this.form.id).then(response => {
          if (response.data) {
            callback();
          } else {
            callback(new Error('菜单名已存在'))
          }
        })
      }
      return {
        svgIcons,
        dialogVisible: false,
        dialogTitle: '新增菜单',
        pid: [],
        form: { type: 'menu' },
        rules: {
          name: [{validator: validateName, required: true, trigger: 'blur'}],
        },
        menuTree: [],
        treeProps: {
          children: 'children',
          label: 'name'
        },
      }
    },
    watch: {
      'sonData': function (newVal, oldVal) {
        if (newVal.id != null) {
          this.form = newVal
          this.pid = [this.form.parentId]
          this.dialogTitle = '修改菜单'
        } else {
          this.dialogTitle = '新增菜单'
        }
        this.dialogVisible = true
      },
    },
    created() {
      //清空表单的校验状态
      if (this.$refs['form'] !== undefined) {
        this.$refs['form'].resetFields(); //经查询：可能是由于对象还没有生成，导致误读了空对象而报错
      }

      getMenuTree().then(response => {
        this.menuTree = response.data
      })
    },
    methods: {
      _notify(message, type) {
        this.$message({
          message: message,
          type: type
        })
      },
      clearForm() {
        this.form = {}
      },

      //Tree控件节点选中状态改变触发的事件
      checkChange(data, node, self) {
        if (node) {
          this.pid = [data.id];
          this.$refs.tree.setCheckedKeys(this.pid)
          this.form.parentId = data.id
        } else {
          if (this.$refs.tree.getCheckedKeys().length == 0) {
            this.pid = [];
            this.form.parentId = null
          }
        }
      },

      handleClose() {
        this.clearForm();
        this.dialogVisible = false
      },
      onSubmit(form) {
        this.$refs[form].validate((valid) => {
          if (valid) {
            if (this.form.id == null) {
              addMenu(this.form).then(response => {
                if (response.code === 200) {
                  this._notify('新增菜单成功', 'success')
                  this.clearForm()
                  this.$emit('sonStatus', true)
                  this.dialogVisible = false
                } else {
                  this._notify('新增菜单失败', 'error')
                }
              })
            } else {
              updateMenu(this.form).then(response => {
                if (response.code === 200) {
                  this._notify('修改菜单成功', 'success')
                  this.clearForm()
                  this.$emit('sonStatus', true)
                  this.dialogVisible = false
                } else {
                  this._notify('修改菜单失败', 'error')
                }
              })
            }
          } else {
            this.$message('error submit!!')
            return false;
          }
        });
      },
    }
  }
</script>

<style lang="css">
  .el-select{
    width: 500px;
  }
  .icon-select{
    width: 454px !important;
  }
  .icon-select el-select-dropdown__list {
    width: 454px !important;
  }
  .icon-option{
    width: 145px;
    display: -webkit-inline-box;
  }
</style>


