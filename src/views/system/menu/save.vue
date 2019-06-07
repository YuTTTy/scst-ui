<template>
  <el-dialog :title="dialogTitle" :before-close="handleClose" :visible.sync="dialogVisible" width="33%">
    <el-form ref="form" :model="form" :rules="rules" status-icon>
      <el-form-item prop="name" label="角色名称" label-width="80px" required>
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item prop="description" label="角色描述" label-width="80px">
        <el-input v-model="form.description"></el-input>
      </el-form-item>
      <el-form-item prop="deptId" v-model="form.menuIds" label="菜单权限" label-width="80px">
        <el-tree :data="menuTree" ref="tree" highlight-current show-checkbox check-strictly
                 :default-checked-keys="form.menuIds"
                 :default-expanded-keys="form.menuIds"
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
  import {save, edit, upload} from '@/api/user'
  import { getDeptTree } from '@/api/dept'
  import  { getTree } from "@/api/menu";

  export default {
    //父组件向子组件传值，通过props获取。
    //一旦父组件改变了`sonData`对应的值，子组件的`sonData`会立即改变，通过watch函数可以实时监听到值的变化
    //`props`不属于data，但是`props`中的参数可以像data中的参数一样直接使用
    props: ['sonData'],

    data() {
      return {
        dialogVisible: false,
        dialogTitle: '新增用户',
        localUpload: upload,
        imgURL: '',
        form: {
          status: false
        },
        menuTree: [],
        roleTree: [],
        deptTree: [],
        rules: {
          name: [{required: true, trigger: 'blur', message: '请输入角色名称'}],
        },
        treeProps: {
          children: 'children',
          label: 'name'
        },
      }
    },
    watch: {
      'sonData': function (newVal, oldVal) {
        this.form = newVal
        //清空表单的校验状态
        if (this.$refs['form'] !== undefined) {
          this.$refs['form'].resetFields(); //经查询：可能是由于对象还没有生成，导致误读了空对象而报错
        }

        getTree().then(response => {
          this.menuTree = response.data
        })
        getDeptTree().then(response => {
          this.deptTree = response.data
        })

        this.dialogVisible = true
        if (newVal.id != null) {
          this.dialogTitle = '修改角色'
        } else {
          this.dialogTitle = '新增角色'
        }
      },
    },
    methods: {
      _notify(message, type) {
        this.$message({
          message: message,
          type: type
        })
      },
      clearForm() {
        this.form.id = null
        this.form.name = null
        this.form.description = null
      },
      handleClose() {
        this.clearForm();
        this.dialogVisible = false
      },
      onSubmit(form) {
        this.$refs[form].validate((valid) => {
          if (valid) {
            if (this.form.id === null) {
              save(this.form).then(response => {
                if (response.code === 200) {
                  this._notify(response.msg, 'success')
                  this.clearForm()
                  this.$emit('sonStatus', true)
                  this.dialogVisible = false
                } else {
                  this._notify(response.msg, 'error')
                }
              })
            } else {
              edit(this.form).then(response => {
                if (response.code === 200) {
                  this._notify(response.msg, 'success')
                  this.clearForm()
                  this.$emit('sonStatus', true)
                  this.dialogVisible = false
                } else {
                  this._notify(response.msg, 'error')
                }
              })
            }
          } else {
            this.$message('error submit!!')
            return false;
          }
        });
      },

      //Tree控件节点选中状态改变触发的事件
      checkChange(data, node, self) {
        this.form.menuIds = this.$refs.tree.getCheckedKeys();
      },
    }
  }
</script>

<style lang="css">

</style>


