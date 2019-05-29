<template>
  <div>
    详情页id：{{ id }}
  </div>
</template>

<script>
export default {
  name: 'PageLevel4Detail',
  data () {
    return {
      id: this.$route.params.id
    }
  }
}
</script>

<style scoped lang="scss">

</style>
