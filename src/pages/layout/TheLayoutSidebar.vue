<template>
  <aside class="sidebar" :class="{'sidebar-hide': !openNav}">
    <vue-scroll>
      <el-menu :default-active="$route.path" class="sidebar-menu" :collapse="!openNav" @select="menuSelect">
        <template v-for="(item, index) in $router.options.routes" v-if="item.menu ">
          <!-- 一级菜单 -->
          <el-menu-item v-if="item.children.length === 1" :index="item.children[0].path" :key="index+''">
            <i :class="item.children[0].icon"></i>{{item.children[0].name}}
          </el-menu-item>
          <el-submenu :index="index+''" v-if="item.children.length > 1" :key="index+''">
            <template slot="title"><i :class="item.icon"></i>{{item.name}}</template>
            <el-menu-item v-for="child in item.children" :index="child.path" :key="child.path">
              <!-- 二级菜单 -->
              <el-menu-item v-if="item.children.length === 1" :index="item.children[0].path" :key="index+''">
                <i :class="item.children[0].icon"></i>{{child.name}}
              </el-menu-item>
              <el-submenu :index="index+''" v-if="child.children" :key="index+''">
                <!-- 三级菜单 -->
                <template slot="title"><i :class="item.icon"></i>{{item.name}}</template>
                <el-menu-item v-for="child in item.children" :index="child.path" :key="child.path">
                  {{child.name}}
                </el-menu-item>
              </el-submenu>
            </el-menu-item>
          </el-submenu>
        </template>
      </el-menu>
    </vue-scroll>
  </aside>
</template>

<script>
export default {
  name: 'TheLayoutSidebar',
  props: ['openNav'],
  methods: {
    menuSelect (index) {
      console.log(index)
      this.$router.push(index)
    }
  }
}
</script>

<style scoped lang="scss">
.sidebar {
  width: 240px;
  position: absolute;
  top: 0;
  bottom: 0;
  border-right: 1px solid #e6e6e6;
  .sidebar-menu {
    border: none;
    height: 100%;
  }
}

.sidebar-hide {
  width: 65px;
}
</style>
