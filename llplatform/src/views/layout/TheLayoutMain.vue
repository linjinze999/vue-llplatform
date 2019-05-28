<template>
  <el-main :style="mainStyle" class="page-sub-main">
    <transition name="fade" mode="out-in">
      <router-view></router-view>
    </transition>
  </el-main>
</template>

<script>
export default {
  name: 'TheLayoutMain',
  data () {
    const winHeight = window.innerHeight - 100 + 'px'
    return {
      mainStyle: {
        minHeight: winHeight
      }
    }
  }
}
</script>

<style scoped>
.page-sub-main {
  background-color: #EBEEF5;
  color: #666666;
}
</style>
