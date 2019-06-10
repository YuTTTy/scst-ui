<template>
  <div class="editor-container">
    <el-tabs v-model="activeName">
      <el-tab-pane label="发送邮件" name="send">
        <el-form :model="form" ref="form" label-width="100px">
          <el-form-item style="width: 50%"
                        label="收件邮箱"
                        prop="to"
                        :rules="[{ required: true, message: '请输入邮箱地址'},{ type: 'email', message: '请输入正确的邮箱地址'}]">
            <el-input v-model="form.to"></el-input>
          </el-form-item>
          <el-form-item label="邮件主题" style="width: 50%"
                        prop="subject" :rules="[{ required: true, message: '请输入邮箱主题'}]">
            <el-input v-model="form.subject"></el-input>
          </el-form-item>
          <el-form-item label="邮件内容">
            <markdown-editor ref="markdownEditor" v-model="content" style="width: 100%" height="300px"/>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="send('form')">提交</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="使用说明" name="note">
        <description></description>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import {sendEmail} from "@/api/component";
  import MarkdownEditor from '@/components/MarkdownEditor'
  import Description from './components/description'

  export default {
    name: 'index',
    components: {MarkdownEditor, Description},
    data() {
      return {
        activeName: 'send',
        content: '支持Markdown格式文档，右侧为渲染的HTML效果',
        form: {}
      }
    },
    methods: {
      _notify(message, type) {
        this.$message({
          message: message,
          type: type
        })
      },
      send(form) {
        this.$refs[form].validate((valid) => {
          this.form.text = this.$refs.markdownEditor.getHtml()
          if (valid) {
            console.log(this.form)
            sendEmail(this.form).then(response => {
              if (response.code == 200) {
                this._notify('邮件发送成功，请注意查收', 'success')
                this.form = {}
                this.content = ''
              } else {
                this._notify('邮件发送失败', 'error')
              }
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      }
    }
  }
</script>

<style scoped>
  .editor-container {
    padding: 32px;
    position: relative;
  }
</style>
