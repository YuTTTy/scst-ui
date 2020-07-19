<template>
  <el-dialog
    title="新增/修改"
    :before-close="handleClose"
    :visible.sync="dialogVisible"
    width="50%"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="80px" status-icon>
      <el-form-item prop="username" label="用户名">
        <el-input v-model="form.username" placeholder="请输入用户名" />
      </el-form-item>
      <el-form-item
        prop="password"
        label="密码"
        label-width="80px"
      >
        <el-input v-model="form.password" type="password" :disabled="form.id!=undefined" placeholder="请输入登录密码" />
      </el-form-item>
      <el-form-item
        prop="roleIds"
        label="角色"
      >
        <el-select v-model="form.roleIds" multiple placeholder="请选择角色" style="width: 100%">
          <el-option
            v-for="item in roleTree"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="手机">
        <el-input v-model="form.phone" />
      </el-form-item>
      <el-form-item prop="status" label="状态" style="display: block">
        <el-radio v-model="form.status" border label="true">激活</el-radio>
        <el-radio v-model="form.status" border label="false">锁定</el-radio>
      </el-form-item>
      <el-form-item prop="deptId" label="部门" style="float: left">
        <el-tree
          ref="tree"
          v-model="form.deptId"
          :data="deptTree"
          highlight-current
          show-checkbox
          check-strictly
          :default-checked-keys="deptId"
          :default-expanded-keys="deptId"
          node-key="id"
          :props="treeProps"
          @check-change="checkChange"
        />
      </el-form-item>
      <el-form-item v-model="form.avatar" label="头像">
        <div class="avatar-uploader">
          <div class="el-upload" @click="handleEditAvatar">
            <img v-if="form.avatar" :src="form.avatar" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </div>
        </div>
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
    <Avatar :avatar-dialog.sync="avatarDialog" :data.sync="form" @modelOpen="changeAvatar" />
  </el-dialog>
</template>

<script>
  import { checkUserName } from '@/api/user'
  import { getRoleFilterList } from '@/api/role'
  import { getDeptTree } from '@/api/dept'
  import Avatar from './avatar'

  export default {
    components: { Avatar },
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
        deptId: [],
        roleTree: [],
        deptTree: [],
        rules: {
          username: { validator: validateName, required: true, trigger: 'blur' },
          password: { required: true, trigger: 'blur', message: '请输入登录密码' },
          roleIds: { required: true, trigger: 'blur', message: '请选择用户角色' },
          status: { required: true, trigger: 'blur', message: '请选择状态' }
        },
        treeProps: {
          children: 'children',
          label: 'name'
        },
        avatarDialog: false
      }
    },
    watch: {
      'form': function(form) {
        this.deptId = [form.deptId]
      }
    },
    created() {
      if (this.$refs['form'] !== undefined) {
        this.$refs['form'].resetFields()
      }
      this.fetchData()
    },
    methods: {
      handleClose() {
        this.$refs['tree'].setCheckedKeys([])
        this.$emit('update:dialogVisible', false)
        this.$emit('update:form', {})
      },
      fetchData() {
        getDeptTree().then(res => {
          this.deptTree = res.data
        })
        getRoleFilterList({}).then(res => {
          this.roleTree = res.data
        })
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
      },
      handleEditAvatar() {
        this.avatarDialog = true
      },
      changeAvatar(url) {
        this.form.avatar = url
      },
      // Tree控件节点选中状态改变触发的事件
      checkChange(data, node, self) {
        if (node) {
          this.deptId = [data.id]
          this.form.deptId = this.deptId[0]
          this.$refs.tree.setCheckedNodes([data.id])
        } else {
          if (this.$refs.tree.getCheckedKeys().length == 0) {
            this.deptId = []
          }
        }
      }
    }
  }
</script>

<style lang="css" scoped>
  .line {
    text-align: center;
  }

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }

  ::v-deep .el-form-item {
    width: 50%;
    display: inline-block;
  }
</style>

