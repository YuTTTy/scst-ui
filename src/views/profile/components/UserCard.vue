<template>
  <div class="app-container">
    <h4 class="tab-header">基本设置</h4>
    <div class="tab-view">
      <div class="tab-left">
        <el-form ref="form" :model="form" :rules="rules" size="small">
          <el-form-item label="登录账户" prop="username">
            <el-input v-model="form.username" />
          </el-form-item>
          <el-form-item label="手机" prop="phone">
            <el-input v-model="form.phone" />
          </el-form-item>
          <el-form-item label="所属部门">
            <el-input v-if="form.dept != null" v-model="form.dept.name" disabled />
          </el-form-item>
          <el-form-item label="所属角色">
            <br>
            <div v-if="form.roles != null">
              <el-tag v-for="item in form.roles" :key="item.id">{{ item.name }}</el-tag>
            </div>
          </el-form-item>
        </el-form>
        <el-button type="primary" size="mini" @click="handleUpdate('form')">更新基本信息</el-button>
      </div>
      <div class="tab-right">
        <p><label>头像</label></p>
        <el-avatar :size="100" fit="fill" :src="form.avatar" />
        <div>
          <el-button plain size="mini" icon="el-icon-upload2" @click="handleAvatar">更换头像</el-button>
        </div>
      </div>
    </div>
    <Avatar :form="form" :dialog-visible="dialogVisible" />
  </div>
</template>
<script>
  import Avatar from './Avatar'
  import { checkUserName, updateUser } from '@/api/user'

  export default {
    components: { Avatar },
    props: {
      form: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    data() {
      var validateName = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('用户名不能为空'))
        }
        checkUserName({ id: this.form.id, username: value }).then(res => {
          if (res.data) {
            callback()
          } else {
            callback(new Error('用户名已存在'))
          }
        })
      }
      return {
        dialogVisible: false,
        rules: {
          username: [
            { validator: validateName, required: true, trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' }
          ],
          email: [
            { required: true, type: 'email', message: '请输入真实姓名', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      handleAvatar() {
        this.dialogVisible = true
      },
      changeAvatar() {
        this.disalogVisible = false
        updateUser({
          id: this.form.id,
          avatar: this.form.avatar
        }).then(res => {
          if (res.code === 200) {
            this.$confirm('更新用户头像成功，重新登录后生效，立即重新登录？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'success'
            }).then(() => {
              this.$store.dispatch('user/logout')
              this.$router.push(`/login?redirect=${this.$route.fullPath}`)
            })
          } else {
            this.$message.error(res.msg)
          }
        })
      },
      handleUpdate(form) {
        this.$refs[form].validate((valid) => {
          if (valid) {
            updateUser(this.form).then(res => {
              if (res.code === 200) {
                this.$alert('更新用户信息成功，立即重新登录？', '提示', {
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
  ::v-deep .avatar-img{width:100px;height:100px;display:inline-block;margin:10px;overflow:hidden;position:relative;border-radius:5%}
  ::v-deep .avatar-img img{width:100px;height:100px;z-index:1}
  ::v-deep .avatar-img img:hover{cursor:pointer}
  ::v-deep .avatar-img-label{position:absolute;right:-17px;top:-7px;width:46px;height:26px;background:#13ce66;text-align:center;transform:rotate(45deg);box-shadow:0 1px 1px #ccc}
  ::v-deep .avatar-img-label .el-icon-check{font-size:12px;margin-top:12px;transform:rotate(-45deg);color:#fff}
</style>
