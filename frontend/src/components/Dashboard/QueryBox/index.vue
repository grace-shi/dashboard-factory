<script>
export default {
  name: 'QueryBox',
  props: {
    query: {
      type: Object,
      required: true
    },
    properties: {
      type: Array,
      default: () => ([])
    },
    auto: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    getCurrentTotalSpan (idx) {
      return this.properties.slice(0, idx + 1).reduce((total, property) => {
        const { span = 8 } = property
        return total + span
      }, 0)
    }
  }
}
</script>

<template lang="pug">
el-row.query-box(:gutter="5", justify="start")
  el-col.componnet-wrapper(
    v-for="(property, idx) in properties",
    :style="getCurrentTotalSpan(idx) > 24 ? 'margin-top: 5px;' : ''"
    :span="property.span || 8"
    :key="property.key",
  )
    el-select(
      v-if="['el-select', undefined].includes(property.type)",
      size="small",
      :clearable="true",
      v-model="query[property.key]",
      :placeholder="property.placeholder"
    )
      el-option(
        v-for="item in property.options",
        :key="item.value",
        :label="item.label",
        :value="item.value"
      )
    component(
      v-else,
      size="small",
      :clearable="true",
      v-model="query[property.key]",
      :is="property.type",
      v-bind="property.options",
      :placeholder="property.placeholder"
    )
  el-col(
    :span="8",
    :style="`${properties.length > 3 ? 'margin-top: 5px;' : ''} display: flex; align-items: center; justify-content: start;`"
  )
    el-button(
      v-if="!auto",
      size="small",
      type="primary",
      @click="$emit('query')"
    ) 查询
</template>

<style lang="scss">
.query-box {
  .el-date-editor.el-input, .el-select.el-select--small {
    width: 100% !important;
  }
}
</style>
