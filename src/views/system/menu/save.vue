<template>
  <el-dialog :title="dialogTitle" :before-close="handleClose" :visible.sync="dialogVisible" width="33%">
    <el-form ref="form" :model="form" :rules="rules" status-icon>
      <el-form-item prop="name" label="菜单名称" label-width="80px">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item prop="description" label="菜单描述" label-width="80px">
        <el-input v-model="form.description"></el-input>
      </el-form-item>
    </el-form>
    <div v-for="item of svgIcons" :key="item">
      <svg-icon :icon-class="item" class-name="disabled" />
      <span>{{ item }}</span>
    </div>
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
  import {addRole, updateRole, checkRoleName} from '@/api/role'

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
        checkRoleName(value, this.form.id).then(response => {
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
        form: {},
        rules: {
          name: [{validator: validateName, required: true, trigger: 'blur'}],
        },
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
      handleClose() {
        this.clearForm();
        this.dialogVisible = false
      },
      onSubmit(form) {
        this.$refs[form].validate((valid) => {
          if (valid) {
            if (this.form.id == null) {
              addRole(this.form).then(response => {
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
              updateRole(this.form).then(response => {
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
    }
  }
</script>

<style lang="css">

</style>


