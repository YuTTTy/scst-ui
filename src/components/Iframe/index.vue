<template>
  <el-card v-loading="loading">
    <iframe width="400" id="iframe" frameborder="0" scrolling="auto" :src="targetUrl"></iframe>
  </el-card>
</template>

<script>
  export default {
    name: "index",
    props: ['targetUrl'],
    data() {
      return {
        loading: true,
      }
    },
    mounted() {
      /**
       * iframe-宽高自适应显示
       */
      const oIframe = document.getElementById('iframe');
      const deviceWidth = document.documentElement.clientWidth;
      const deviceHeight = document.documentElement.clientHeight;
      oIframe.style.width = (Number(deviceWidth) - 255) + 'px'; //数字是页面布局宽度差值
      oIframe.style.height = (Number(deviceHeight)) + 'px'; //数字是页面布局高度差
      this.loading = false;
    },
  }
</script>

<style scoped>

</style>
