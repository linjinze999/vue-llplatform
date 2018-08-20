<template>
  <el-container  style="height: 100%">
    <the-sidebar></the-sidebar>
    <el-container  direction="vertical" class="right">
      <the-header></the-header>
      <el-container  direction="vertical" style="height: 100%">
        <the-main></the-main>
        <the-footer></the-footer>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
import TheHeader from './TheHeader'
import TheSidebar from './TheSidebar'
import TheFooter from './TheFooter'
import TheMain from './TheMain'

export default {
  name: 'app-index',
  components: {
    'the-header': TheHeader,
    'the-sidebar': TheSidebar,
    'the-footer': TheFooter,
    'the-main': TheMain
  }
}
</script>

<style scoped>
.right{
  margin-left: 240px;
  height: 100%;
}
</style>
