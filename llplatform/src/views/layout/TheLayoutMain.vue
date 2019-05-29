<template>
  <el-main class="page-sub-main">
    <transition name="fade" mode="out-in">
      <router-view class="main-body"></router-view>
    </transition>
  </el-main>
</template>

<script>
export default {
  name: 'TheLayoutMain'
}
</script>

<style scoped>
.page-sub-main {
  color: #666666;
  min-height: 100%;
  overflow: visible;
  min-width: fit-content;
}

.main-body {
  background-color: #ffffff;
  padding: 20px;
  min-height: 100%;
}
</style>
