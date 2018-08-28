<template>
  <el-main :style="mainStyle" >主页面</el-main>
</template>

<script>
export default {
  name: 'the-main',
  data () {
    const win_height = window.innerHeight - 100 + 'px'
    return {
      mainStyle: {
        minHeight: win_height
      }
    }
  }
}
</script>

<style scoped>
.content {
  min-height: 600px;
}
</style>
