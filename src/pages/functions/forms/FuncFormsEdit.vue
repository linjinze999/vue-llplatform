<template>
  <div>
    <el-card shadow="hover">
      请参考<a style="color: #409eff" href="https://www.awesomes.cn/repo/surmon-china/vue-quill-editor">
      vue-quill-editor</a>。
    </el-card>
    <br/>
    <el-card shadow="hover" style="height: 610px;">
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
