# 功能页面
本章节介绍一些常见功能的实现。

::: tip 提示
文中不会介绍详细的实现方式，各个功能的官网都有更详细的介绍。本章主要介绍功能类别以及常用插件。
:::


## 图表
【说明】

vue图表有许多选择，看个人习惯用哪一种。若图表在项目中用的地方较少，建议按需引入，不要完整引入。

本项目采用了百度的[ECharts](http://echarts.baidu.com/)，为了使用方便，引入[v-charts](https://v-charts.js.org/#/)组件（在使用 echarts 生成图表时，经常需要做繁琐的数据类型转化、修改复杂的配置项，v-charts 的出现正是为了解决这个痛点。基于 Vue2.0 和 echarts 封装的 v-charts 图表组件，只需要统一提供一种对前后端都友好的数据格式设置简单的配置项，便可轻松生成常见的图表）。

【代码示例】：[https://github.com/linjinze999/vue-llplatform/blob/master/llplatform/src/views/pages/PageCharts.vue](https://github.com/linjinze999/vue-llplatform/blob/master/llplatform/src/views/pages/PageCharts.vue)

【在线演示】：[https://linjinze999.github.io/vue-llplatform/preview/#/charts](https://linjinze999.github.io/vue-llplatform/preview/#/charts)

【预览图片】：

<img :src="$withBase('/assets/img/vue-llplatform/func-chart.png')" />

## 表单
【说明】

[Element Form](http://element-cn.eleme.io/#/zh-CN/component/form)提供了基础的表单，如单选、多选、输入、选择、联级选择、开关、日期、文件、穿梭框、颜色选择等，参考官网使用即可。

【代码示例】：[https://github.com/linjinze999/vue-llplatform/blob/master/llplatform/src/views/pages/forms/PageFormsBase.vue](https://github.com/linjinze999/vue-llplatform/blob/master/llplatform/src/views/pages/forms/PageFormsBase.vue)

【在线演示】：[https://linjinze999.github.io/vue-llplatform/preview/#/forms/base](https://linjinze999.github.io/vue-llplatform/preview/#/forms/base)

【预览图片】：

<img :src="$withBase('/assets/img/vue-llplatform/func-form.png')" />

## 富文本编辑器
【说明】

富文本编辑器可选项也较多（[常见富文本](https://panjiachen.github.io/vue-element-admin-site/zh/component/rich-editor.html)），本项目采用[vue-quill-editor](https://www.awesomes.cn/repo/surmon-china/vue-quill-editor)，其风格较为简洁。

【代码示例】：[https://github.com/linjinze999/vue-llplatform/blob/master/llplatform/src/views/pages/forms/PageFormsEdit.vue](https://github.com/linjinze999/vue-llplatform/blob/master/llplatform/src/views/pages/forms/PageFormsEdit.vue)

【在线演示】：[https://linjinze999.github.io/vue-llplatform/preview/#/forms/edit](https://linjinze999.github.io/vue-llplatform/preview/#/forms/edit)

【预览图片】：

<img :src="$withBase('/assets/img/vue-llplatform/func-edit.png')" />

## 表格
【说明】

[Element Table](http://element-cn.eleme.io/#/zh-CN/component/table)提供了表格组件，加上[Element Pagination](http://element-cn.eleme.io/#/zh-CN/component/pagination)分页组件，即可完成正常的表格显示。

::: tip 提示
分页时，table需要过滤数据，只显示分页的数据，可以如此过滤：`:data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)"`
:::

【代码示例】：[https://github.com/linjinze999/vue-llplatform/blob/master/llplatform/src/views/pages/PageTable.vue](https://github.com/linjinze999/vue-llplatform/blob/master/llplatform/src/views/pages/PageTable.vue)

【在线演示】：[https://linjinze999.github.io/vue-llplatform/preview/#/table](https://linjinze999.github.io/vue-llplatform/preview/#/table)

【预览图片】：

<img :src="$withBase('/assets/img/vue-llplatform/func-table.png')" />

## 拖曳
【说明】

本项目采用了[vue.draggable](https://www.npmjs.com/package/vuedraggable)来提供拖曳功能。

【代码示例】：[https://github.com/linjinze999/vue-llplatform/blob/master/llplatform/src/views/pages/PageDrag.vue](https://github.com/linjinze999/vue-llplatform/blob/master/llplatform/src/views/pages/PageDrag.vue)

【在线演示】：[https://linjinze999.github.io/vue-llplatform/preview/#/drag](https://linjinze999.github.io/vue-llplatform/preview/#/drag)

【预览图片】：

<img :src="$withBase('/assets/img/vue-llplatform/func-drag.gif')" />

## 权限配置
【说明】

本项目的[权限控制策略](/vue-llplatform/permission.html)采用前端记录页面表，后台记录权限表，前端根据权限表显示页面的方式，适合在权限配置比较频繁的时候使用。因此需要开发一个权限设置页面。

权限设置页面分为三种：用户、角色、页面。一个用户可以有多个角色；角色指定了其拥有的页面权限和页面中的指令权限；页面记录了页面信息，包括指令权限。

【代码示例】：[https://github.com/linjinze999/vue-llplatform/blob/master/llplatform/src/views/pages/user/PageUserPermissions.vue](https://github.com/linjinze999/vue-llplatform/blob/master/llplatform/src/views/pages/user/PageUserPermissions.vue)

【在线演示】：[https://linjinze999.github.io/vue-llplatform/preview/#/user/permissions](https://linjinze999.github.io/vue-llplatform/preview/#/user/permissions)

【预览图片】：

<img :src="$withBase('/assets/img/vue-llplatform/func-permission.gif')" />


## 其他
1. 复制粘贴：[clipboard.js](https://clipboardjs.com/)
2. excel导入导出：[vue中使用excel导入导出](https://www.cnblogs.com/liguiwang/p/8430672.html)
