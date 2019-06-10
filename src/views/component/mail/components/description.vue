<template>
  <el-collapse v-model="activeNames">
    <el-collapse-item title="介绍" name="1">
      <div># 此邮件服务模块基于 spring-boot-starter-mail 实现，该服务位于 `scst-component/src/main/java/cn/tycoding/scst/component/email`
        包下
      </div>
      <div># 默认的配置，支持HTML格式文本邮件发送，本模块采用了 <a href="https://github.com/nhn/tui.editor" target="_blank">tui.editor</a>
        -Markdown富文本编辑器
      </div>
    </el-collapse-item>
    <el-collapse-item title="注意" name="2">
      <div># 邮件服务器必须支持并打开了SMTP协议，常见的新浪、163、QQ邮箱都支持并有相关说明</div>
      <div># 因为使用的SpringBoot封装的邮件工具类，如果需要修改邮件发送方的信息，请手动修改`scst-component`服务下的`application.yml`邮件配置</div>
    </el-collapse-item>
    <el-collapse-item title="参数说明" name="3">
      <div># 本服务模块因为采用的SpringBoot封装的邮件工具类，配置项都写死在`scst-component`服务的`application.yml`中</div>
      <ul>
        <li>spring.mail.host: 邮件服务器地址，比如163邮箱用 `smtp.163.com`，新浪邮箱用 `smtp.sina.com`</li>
        <li>spring.mail.username: 邮件服务的发送方</li>
        <li>spring.mail.password: 密码，对于不同的邮件服务可能会不同，比如sina的邮箱开启smtp支持并不需要什么秘钥（密码就是邮箱的登录密码），但如163邮箱开启smtp支持需要设定秘钥（密码就是这个秘钥）</li>
        <li>spring.mail.default-encoding: 邮件发送的字符编码设定，通常都是UTF-8</li>
        <li>spring.mail.properties.mail.smtp.auth: 是否开启smtp支持</li>
      </ul>
    </el-collapse-item>
    <el-collapse-item title="相关参考" name="4">
      <div># 如果你对 `spring-boot-starter-mail` 有什么不懂的，可以参考我的这篇文档：<a href="https://www.tycoding.cn/2019/02/27/boot/spring-boot-mail/" target="_blank">Spring Boot整合Mail邮件服务</a></div>
      <div># 在一些开源项目中，也看到他们实现了这样的功能：邮件的发送方和收件方都可以让用户自定义。当然这肯定不是用的 `spring-boot-starter-mail` 依赖，他们采用的 <a href="https://hutool.cn/docs/#/">Hutool工具包</a>，具体看文档，本服务并未采用</div>
    </el-collapse-item>
  </el-collapse>
</template>

<script>
  export default {
    name: "description",
    data() {
      return {
        activeNames: ['1', '2', '3', '4']
      }
    }
  }
</script>

<style scoped>
a {
  color: red;
}
</style>
