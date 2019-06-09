<template>
  <targetWindow :targetUrl="url"></targetWindow>
</template>

<script>
  import targetWindow from '@/components/Iframe'

  export default {
    components: {targetWindow},
    name: "admin",
    data() {
      return {
        url: 'http://localhost:3000'
      }
    }
  }
</script>

<style scoped>

</style>
