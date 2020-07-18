<template>
  <el-dialog title="新增/修改角色" :before-close="handleClose" :visible.sync="dialogVisible" width="33%">
    <el-form ref="form" :model="form" :rules="rules" status-icon>
      <el-form-item prop="name" label="角色名称" label-width="80px">
        <el-input v-model="form.name" placeholder="请输入角色名称" />
      </el-form-item>
      <el-form-item prop="description" label="角色描述" label-width="80px">
        <el-input v-model="form.description" placeholder="请输入角色描述" />
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
  import { checkRoleName } from '@/api/role'

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
          return callback(new Error('请输入角色名称'))
        }
        checkRoleName({ id: this.form.id, name: value }).then(res => {
          if (res.data) {
            callback()
          } else {
            callback(new Error('角色名已存在'))
          }
        })
      }
      return {
        rules: {
          name: [{ validator: validateName, required: true, trigger: 'blur' }]
        },
        treeProps: {
          children: 'children',
          label: 'name'
        }
      }
    },
    created() {
      if (this.$refs['form'] !== undefined) {
        this.$refs['form'].resetFields()
      }
    },
    methods: {
      handleClose() {
        this.$emit('update:dialogVisible', false)
        this.$emit('update:form', {})
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

