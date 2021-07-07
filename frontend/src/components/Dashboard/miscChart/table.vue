<script>
export default {
  name: 'CommonTable',
  props: {
    data: {
      type: Array,
      default: () => ([])
    },
    headers: {
      type: Array,
      default: () => ([])
    }
  }
}
</script>

<template lang="pug">
el-table(
  :data="data",
  height="100%",
  style="width: 100%"

)
  el-table-column(
    label="序号",
    type="index",
    width="50"
  )
  el-table-column(
    v-for="header in headers",
    v-bind="header"
  )
</template>

<style lang="scss">

</style>
