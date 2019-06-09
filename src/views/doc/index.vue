<template>
  <targetWindow :targetUrl="url"></targetWindow>
</template>

<script>
  import targetWindow from '@/components/Iframe'

  export default {
    components: {targetWindow},
    name: "index",
    data() {
      return {
        url: 'http://localhost:5000/swagger-ui.html'
      }
    }
  }
</script>

<style scoped>

</style>
