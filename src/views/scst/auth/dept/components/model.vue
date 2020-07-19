<template>
  <el-dialog title="修改/新增部门" :before-close="handleClose" :visible.sync="dialogVisible" width="50%">
    <el-form ref="form" :model="form" :rules="rules" status-icon>
      <el-form-item prop="name" label="部门名称" label-width="80px">
        <el-input v-model="form.name" placeholder="请输入部门名称" />
      </el-form-item>
      <el-form-item label="上级部门" label-width="80px">
        <el-tree
          ref="tree"
          :data="deptTree"
          highlight-current
          show-checkbox
          check-strictly
          :default-checked-keys="pId"
          :default-expanded-keys="pId"
          node-key="id"
          :props="treeProps"
          @check-change="checkChange"
        />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">
        取消
      </el-button>
      <el-button type="primary" @click="handleSubmit('form')">
        保存
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { checkDeptName, getDeptTree } from '@/api/dept'

  export default {
    props: {
      form: {
        type: Object,
        default() {
          return {}
        }
      },
      dialogVisible: {
        type: Boolean,
        default: false
      }
    },
    data() {
      var validateName = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请输入部门名称'))
        }
        checkDeptName({ id: this.form.id, name: value }).then(res => {
          if (res.data) {
            callback()
          } else {
            callback(new Error('部门名称已存在'))
          }
        })
      }
      return {
        pId: [],
        rules: {
          name: [{ validator: validateName, required: true, trigger: 'blur' }]
        },
        deptTree: [],
        treeProps: {
          children: 'children',
          label: 'name'
        }
      }
    },
    watch: {
      'form': function(form) {
        this.pId = [form.parentId]
      }
    },
    created() {
      if (this.$refs['form'] !== undefined) {
        this.$refs['form'].resetFields()
      }
      getDeptTree().then(res => {
        this.deptTree = res.data
      })
    },
    methods: {
      handleClose() {
        this.$emit('update:dialogVisible', false)
        this.$emit('update:form', {})
        this.$refs.tree.setCheckedKeys([])
      },
      checkChange(data, node, self) {
        if (node) {
          this.pId = [data.id]
          this.$refs.tree.setCheckedKeys(this.pId)
          this.form.parentId = data.id
        } else {
          if (this.$refs.tree.getCheckedKeys().length == 0) {
            this.pId = []
            this.form.parentId = null
          }
        }
      },
      handleSubmit(form) {
        this.$refs[form].validate((valid) => {
          if (valid) {
            this.$emit('modelOpen')
          } else {
            this.$message('error submit!!')
            return false
          }
        })
      }
    }
  }
</script>

<style lang="css">

</style>

