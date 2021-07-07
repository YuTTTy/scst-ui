<template>
  <div class="app-container">
    <h4 class="tab-header">修改密码</h4>
    <div class="tab-view">
      <div class="tab-left">
        <el-form ref="rulePass" :model="form" :rules="rules" size="small">
          <el-form-item label="新密码" prop="password">
            <el-input v-model="form.password" type="password" />
          </el-form-item>
          <el-form-item label="再次确认" prop="rePass">
            <el-input v-model="form.rePass" type="password" />
          </el-form-item>
        </el-form>
        <el-button type="primary" size="mini" @click="handleUpdatePass('rulePass')">更新密码</el-button>
      </div>
      <div class="tab-right" />
    </div>
  </div>
</template>
<script>
  import { updatePass } from '@/api/user'

  export default {
    props: {
      form: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    data() {
      var validateRePass = (rule, value, callback) => {
        if (value === '' || value === undefined) {
          callback(new Error('请输入原密码'))
        } else {
          if (this.form.password != value) {
            callback(new Error('两次输入的密码不一致'))
          }
          callback()
        }
      }
      return {
        rules: {
          password: [
            { required: true, message: '请输入原密码', trigger: 'blur' }
          ],
          rePass: [
            { validator: validateRePass, required: true, trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      handleUpdatePass(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            updatePass(this.passForm).then(res => {
              if (res.code === 200) {
                this.$alert('修改账户密码成功，立即重新登录？', '提示', {
                  confirmButtonText: '确定',
                  type: 'success'
                }).then(() => {
                  this.$store.dispatch('user/logout')
                })
              } else {
                this.$message.error(res.msg)
              }
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      }
    }
  }
</script>
<style lang="css" scoped>
  ::v-deep h4.tab-header{margin-bottom:12px;color:rgba(0,0,0,.85);font-weight:500;font-size:20px;line-height:28px}
  ::v-deep .tab-view{display:flex;padding-top:12px}.tab-left{min-width:280px;max-width:448px}.tab-right{flex:1 1;padding-left:104px}
</style>
