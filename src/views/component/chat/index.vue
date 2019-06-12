<template>
  <div class="chat-container">
    <el-tabs v-model="activeName">
      <el-tab-pane label="在线聊天" name="send">
        <chat></chat>
      </el-tab-pane>
      <el-tab-pane label="使用说明" name="note">
        <description></description>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import Description from './components/description'
  import Chat from './components/chat'

  export default {
    name: 'index',
    components: {Description, Chat},
    data() {
      return {
        activeName: 'send',
      }
    },
    methods: {
    }
  }
</script>

<style scoped>
  .chat-container {
    padding: 32px;
    position: relative;
  }
</style>
