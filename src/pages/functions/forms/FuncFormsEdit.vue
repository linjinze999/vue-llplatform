<template>
  <div>
    <el-card>
      1. 实现：请参考<a style="color: #409eff" href="https://www.awesomes.cn/repo/surmon-china/vue-quill-editor">vue-quill-editor</a><br/>
      2. 示例：以下示例源代码见
      <a href="https://github.com/linjinze999/vue-llplatform/blob/master/src/pages/functions/forms/FuncFormsEdit.vue"
         style="color: #409eff" target="_blank">
        https://github.com/linjinze999/vue-llplatform/blob/master/src/pages/functions/forms/FuncFormsEdit.vue
      </a>
    </el-card>
    <br/>
    <el-card style="height: 610px;">
      <quill-editor
        v-model="content"
        ref="myQuillEditor"
        style="height: 500px;"
        :options="editorOption">
      </quill-editor>
    </el-card>
  </div>
</template>

<script>
import {quillEditor} from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

export default {
  name: 'FuncFormsEdit',
  components: {
    quillEditor
  },
  data () {
    return {
      content: null,
      editorOption: {}
    }
  }
}
</script>

<style scoped>

</style>
