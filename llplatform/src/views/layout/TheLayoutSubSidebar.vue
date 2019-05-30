<template functional>
  <el-submenu v-on="listeners" :key="data.key" :index="data.key">
    <template slot="title">
      <i :class="data.attrs.subMenu.icon" v-if="data.attrs.subMenu.icon"></i>
      <span slot="title">{{ data.attrs.i18n(data.attrs.subMenu.title) }}</span>
    </template>
    <template v-for="item in data.attrs.subMenu.children">
      <el-menu-item v-if="!item.children" :key="item.name" :index="item.path">
        <a-icon :type="item.icon" v-if="item.icon"/>
        <span>{{ data.attrs.i18n(item.title) }}</span>
      </el-menu-item>
      <the-submenu v-else :subMenu="item" :key="item.name" :i18n="data.attrs.i18n"></the-submenu>
    </template>
  </el-submenu>
</template>
