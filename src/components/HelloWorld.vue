<template>
  <div class="hello">
    <el-button @click="login">按钮</el-button>
  </div>
</template>

<script>
import {requestLogin} from '../api/user'

export default {
  name: 'HelloWorld',
  methods: {
    login () {
      requestLogin({'name': 'linjinze999'}).then(data => this.$alert(data))
    }
  }
}
</script>
