<template>
  <div class="qiniu-container">
    <!-- 查询结果 -->
    <el-table :data="list" size="small" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" border fit highlight-current-row>
      <el-table-column align="center" label="对象KEY" width="270" prop="key"></el-table-column>
      <el-table-column align="center" label="对象名称" width="260" prop="name"></el-table-column>
      <el-table-column align="center" label="对象类型" width="150" prop="type"></el-table-column>
      <el-table-column align="center" label="对象大小(kb)" width="150">
        <template slot-scope="scope">
          {{scope.row.size / 1000}} kb
        </template>
      </el-table-column>
      <el-table-column align="center" property="url" width="100" label="预览图">
        <template slot-scope="scope">
          <a :href="scope.row.url" target="_blank" style="color:#409EFF;">
            <img :src="scope.row.url" width="40">
          </a>
        </template>
      </el-table-column>
      <el-table-column align="center" label="链接地址" prop="url"></el-table-column>
      <el-table-column align="center" label="操作" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <a :href="scope.row.url" target="_blank" style="color:#409EFF;">
            <el-button type="success" size="mini" icon="el-icon-download"></el-button>
          </a>
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row.name)" icon="el-icon-edit"></el-button>
          <el-button type="danger" size="mini" @click="handleDelete(scope.row.name)" style="margin-left: 0px;" icon="el-icon-delete"></el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import {getFiles,deleteFile,updateFile} from '@/api/qiniu'
  export default {
    name: "index",
    data() {
      return {
        loading: false,
        rules: {
          newname: [{required: true, message: '对象名称不能为空', trigger: 'blur'}]
        },
        dataForm: {
          oldname: '',
          newname: '',
        },
        list: [],
        dialogVisible: false,
        createDialogVisible: false
      }
    },
    created() {
      this.search();
    },
    methods: {
      _notify(message, type) {
        this.$message({
          message: message,
          type: type
        })
      },
      search() {
        this.loading = true;
        getFiles().then(response => {
          this.list = response.body.data.rows;
          this.loading = false;
        })
      },

      //触发关闭按钮
      handleClose() {
        this.dialogVisible = false; //关闭模态框
      },

      //触发删除按钮
      handleDelete(name) {
        this.$confirm('你确定永久删除此文件？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          deleteFile(name).then(response => {
            if (response.code != 200) {
              this._notify(response.body.msg, 'success')
            } else {
              this._notify(response.body.msg, 'error')
            }
            this.search();
          });
        }).catch(() => {
          this._notify('已取消删除', 'info');
        });
      },

      //触发新增按钮
      handleSave() {
        this.createDialogVisible = true;
      },

      //上传
      upload(item) {
        console.log(item);
        const formData = new FormData()
        formData.append('file', item.file)
        updateFile(formData).then(response => {
          this.createDialogVisible = false
          if (response.body.code == 200) {
            this._notify(response.body.msg, 'success')
          } else {
            this._notify(response.body.msg, 'error')
          }
          this.search();
        })
      },

      //触发更新按钮
      handleUpdate(name) {
        this.dataForm.oldname = name;
        this.dataForm.newname = name;
        this.updateDialogVisible = true
      },

      update() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            console.log(this.dataForm);
            this.$http.get(api.storage.qiniu.updateOne(this.dataForm.oldname, this.dataForm.newname)).then(response => {
              this.updateDialogVisible = false
              if (response.body.code == 200) {
                this._notify(response.body.msg, 'success')
              } else {
                this._notify(response.body.msg, 'error')
              }
              this.search();
            })
          }
        })
      },

      //文件上传前的前的钩子函数
      beforeUpload(file) {
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

<style scoped>
  .qiniu-container {
    padding: 32px;
    background-color: rgb(240, 242, 245);
    position: relative;
  }
</style>
