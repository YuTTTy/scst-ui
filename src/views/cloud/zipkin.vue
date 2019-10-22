<template>
  <targetWindow :targetUrl="url"></targetWindow>
</template>

<script>
  import targetWindow from '@/components/Iframe'

  export default {
    name: "zipkin",
    components: {targetWindow},
    data() {
      return {
        url: 'http://localhost:3001'
      }
    }
  }
</script>

<style scoped>

</style>
