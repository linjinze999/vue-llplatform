<template>
  <el-row class="page">
    <el-col :span="24">
      <the-header :open-nav="openNav" @toogle-open="toggleOpen"></the-header>
    </el-col>
    <el-col :span="24" class="page-main">
      <the-sidebar></the-sidebar>
      <section class="page-content">
        <GeminiScrollbar>
          <the-main></the-main>
          <the-footer></the-footer>
        </GeminiScrollbar>
      </section>
    </el-col>
  </el-row>
</template>

<script>
import TheHeader from './TheHeader'
import TheSidebar from './TheSidebar'
import TheFooter from './TheFooter'
import TheMain from './TheMain'

export default {
  name: 'app-index',
  data () {
    return {
      openNav: true
    }
  },
  methods: {
    toggleOpen () {
      this.openNav = !this.openNav
    }
  },
  components: {
    'the-header': TheHeader,
    'the-sidebar': TheSidebar,
    'the-footer': TheFooter,
    'the-main': TheMain
  }
}
</script>

<style scoped lang="scss">
.page {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  .page-main {
    display: flex;
    position: absolute;
    top: 60px;
    bottom: 0;
    .page-content {
      position: absolute;
      left: 240px;
      right: 0;
      height: 100%;
    }
  }
}
</style>
