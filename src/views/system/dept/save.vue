<template>
  <el-dialog :title="dialogTitle" :before-close="handleClose" :visible.sync="dialogVisible" width="32.4%">
    <el-form ref="form" :model="form" :rules="rules" status-icon>
      <el-form-item prop="name" label="部门名称" label-width="80px">
        <el-input v-model="form.name" placeholder="请输入部门名称"></el-input>
      </el-form-item>
      <el-form-item v-model="pid" label="上级部门" label-width="80px">
        <el-tree :data="deptTree" ref="tree" highlight-current show-checkbox check-strictly
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
  import {addDept, updateDept, checkDeptName, getDeptTree} from '@/api/dept'

  export default {
    //父组件向子组件传值，通过props获取。
    //一旦父组件改变了`sonData`对应的值，子组件的`sonData`会立即改变，通过watch函数可以实时监听到值的变化
    //`props`不属于data，但是`props`中的参数可以像data中的参数一样直接使用
    props: ['sonData'],

    data() {
      var validateName = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请输入部门名称'))
        }
        checkDeptName(value, this.form.id).then(response => {
          if (response.data) {
            callback();
          } else {
            callback(new Error('部门名称已存在'))
          }
        })
      }
      return {
        dialogVisible: false,
        dialogTitle: '新增部门',
        pid: [],
        form: {},
        rules: {
          name: [{validator: validateName, required: true, trigger: 'blur'}],
        },
        deptTree: [],
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
          this.dialogTitle = '修改部门'
        } else {
          this.dialogTitle = '新增部门'
        }
        this.dialogVisible = true
      },
    },
    created() {
      //清空表单的校验状态
      if (this.$refs['form'] !== undefined) {
        this.$refs['form'].resetFields(); //经查询：可能是由于对象还没有生成，导致误读了空对象而报错
      }

      getDeptTree().then(response => {
        this.deptTree = response.data
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
        if (this.$refs['form'] !== undefined) {
          this.$refs['form'].resetFields();
        }
        this.pid = [];
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
              addDept(this.form).then(response => {
                if (response.code === 200) {
                  this._notify('新增部门成功', 'success')
                  this.clearForm()
                  this.$emit('sonStatus', true)
                  this.dialogVisible = false
                } else {
                  this._notify('新增部门失败', 'error')
                }
              })
            } else {
              updateDept(this.form).then(response => {
                if (response.code === 200) {
                  this._notify('修改部门成功', 'success')
                  this.clearForm()
                  this.$emit('sonStatus', true)
                  this.dialogVisible = false
                } else {
                  this._notify('修改部门失败', 'error')
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


