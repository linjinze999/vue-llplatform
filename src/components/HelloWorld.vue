<template>
  <div class="hello">
    <el-button @click="login">按钮</el-button>
    <h1>{{ msg }}</h1>
  </div>
</template>

<script>
import {requestLogin} from '../api/user'

export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  methods: {
    login () {
      requestLogin({'name': 'linjinze999'}).then(data => this.$alert(data))
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  h1, h2 {
    font-weight: normal;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }
</style>
