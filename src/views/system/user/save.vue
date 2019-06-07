<template>
  <el-dialog :title="dialogTitle" :before-close="handleClose" :visible.sync="dialogVisible" width="33%">
    <el-form ref="form" :model="form" :inline="true" :rules="rules" status-icon>
      <el-form-item prop="username" label="用户名" label-width="80px">
        <el-input v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label="状态" label-width="80px">
        <el-radio v-model="form.status" label="true">激活</el-radio>
        <el-radio v-model="form.status" label="false">锁定</el-radio>
      </el-form-item>
      <el-form-item prop="password" label="密码" label-width="80px"
                    :rules="{required: true, trigger: 'blur', message: '请输入登录密码'}">
        <el-input v-model="form.password" type="password" :disabled="dialogTitle == '新增用户' ? false : true"></el-input>
      </el-form-item>
      <el-form-item label="手机" label-width="80px">
        <el-input v-model="form.phone"></el-input>
      </el-form-item>
      <el-form-item prop="roleIds" label="角色" label-width="80px"
                    :rules="{required: true, trigger: 'blur', message: '请选择用户角色'}">
        <el-select v-model="form.roleIds" multiple placeholder="请选择角色" style="width:100%">
          <el-option
            v-for="item in roleTree"
            :key="item.id"
            :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="描述" label-width="64px">
        <el-input v-model="form.description"></el-input>
      </el-form-item>
      <el-form-item prop="deptId" label="部门" style="min-width: 250px;" label-width="80px">
        <el-tree :data="deptTree" v-model="form.deptId" ref="tree" highlight-current show-checkbox check-strictly
                 :default-checked-keys="deptId"
                 :default-expanded-keys="deptId"
                 node-key="id"
                 @check-change="checkChange"
                 :props="treeProps"></el-tree>
      </el-form-item>
      <el-form-item v-model="form.avatar" label="头像" label-width="90px" style="min-width: 250px;">
        <div class="avatar-uploader">
          <div @click="handleEditAvatar" class="el-upload">
            <img v-if="form.avatar" :src="form.avatar" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </div>
        </div>
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
  import {addUser, updateUser, checkUserName} from '@/api/user'
  import {getRoles} from '@/api/role'
  import {getDeptTree} from '@/api/dept'

  export default {
    //父组件向子组件传值，通过props获取。
    //一旦父组件改变了`sonData`对应的值，子组件的`sonData`会立即改变，通过watch函数可以实时监听到值的变化
    //`props`不属于data，但是`props`中的参数可以像data中的参数一样直接使用
    props: ['sonData'],

    data() {
      var validateName = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('用户名不能为空'))
        }
        checkUserName(value, this.form.id).then(response => {
          if (response.data) {
            callback();
          } else {
            callback(new Error('用户名已存在'))
          }
        })
      }
      return {
        dialogVisible: false,
        dialogTitle: '新增用户',
        // localUpload: upload,
        form: {
          status: false
        },
        deptId: [],
        roleTree: [],
        deptTree: [],
        rules: {
          username: [{validator: validateName, required: true, trigger: 'blur'}],
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
          this.form.status = this.form.status.toString()
          this.deptId = [this.form.deptId]
          this.form.password = 'xxx'
          this.dialogTitle = '修改用户'
        } else {
          this.form.status = 'false'
          this.dialogTitle = '新增用户'
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
      let obj = {
        query: {
          page: 0,
          limit: 0,
        },
        data: {}
      }
      getRoles(obj.query, obj.data).then(response => {
        this.roleTree = response.data.rows
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
        this.form = {
          id: null,
          username: null,
          password: null,
          roleIds: [],
          status: false,
          phone: null,
          deptId: []
        }
        this.$refs['tree'].setCheckedKeys([]);
        if (this.$refs['form'] !== undefined) {
          this.$refs['form'].resetFields(); //经查询：可能是由于对象还没有生成，导致误读了空对象而报错
        }
      },
      handleClose() {
        this.clearForm();
        this.dialogVisible = false
      },
      onSubmit(form) {
        this.$refs[form].validate((valid) => {
          if (valid) {
            if (!this.deptId.length) {
              this._notify('请选择用户所属部门', 'warning')
              return;
            }
            this.form.deptId = this.deptId[0]
            if (this.form.id == null) {
              addUser(this.form).then(response => {
                if (response.code === 200) {
                  this._notify(response.msg, 'success')
                  this.clearForm();
                  //通知父组件刷新表格
                  this.$emit('sonStatus', true)
                  this.dialogVisible = false
                } else {
                  this._notify(response.msg, 'error')
                }
              })
            } else {
              updateUser(this.form).then(response => {
                if (response.code === 200) {
                  this._notify(response.msg, 'success')
                  this.clearForm();
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
      //触发修改头像按钮
      handleEditAvatar() {
        this.$http.get(api.system.user.avatar).then(response => {
          this.avatarList = response.body;
        });
        this.avatarDialog = true;
      },
      //修改头像
      changeAvatar(url) {
        this.form.avatar = url;
        this.avatarDialog = false;
      },
      //Tree控件节点选中状态改变触发的事件
      checkChange(data, node, self) {
        if (node) {
          this.deptId = [data.id];
          this.form.deptId = this.deptId[0]
          this.$refs.tree.setCheckedNodes([data.id])
        } else {
          if (this.$refs.tree.getCheckedKeys().length == 0) {
            this.deptId = [];
          }
        }
      },

      //文件上传成功的钩子函数
      handleAvatarSuccess(res, file, fileList) {
        this._notify('图片上传成功', 'success');
        if (res.code == 200) {
          this.form.avatar = res.data.url;
          this.avatarDialog = false;
        }
      },
      //文件上传前的前的钩子函数
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isGIF = file.type === 'image/gif';
        const isPNG = file.type === 'image/png';
        const isBMP = file.type === 'image/bmp';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG && !isGIF && !isPNG && !isBMP) {
          this.$message.error('上传图片必须是JPG/GIF/PNG/BMP 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 2MB!');
        }
        return (isJPG || isBMP || isGIF || isPNG) && isLt2M;
      },
    }
  }
</script>

<style lang="css">
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
</style>


