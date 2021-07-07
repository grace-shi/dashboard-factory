<template lang="pug">
.tree-content
  el-tree(
    style="width: 35%; height: 100%; overflow: auto",
    :data="data",
    :props="defaultProps",
    node-key="id",
    :default-expanded-keys="[1]",
    @node-click="handleNodeClick"
  )
  .label-box(v-if="info")
    .label-name {{ info.label }}
    .empty-text(
      v-if="isEmpty(info.metrics) && isEmpty(info.description)"
    ) 暂无该组织/人员信息
    .metrics-container(
      v-if="info.metrics && info.metrics.length > 0"
    )
      .metric-item(
        v-for="(metric, idx) in info.metrics",
        :key="idx"
      )
        span.name {{ metric.label }}:
        span.explain {{ metric.value }}
    .desc-container(v-if="info.description && info.description.length > 0")
      .text(
        v-for="(desc, idx) in info.description",
        :key="idx"
      ) {{ desc }}
</template>

<script>
import { isEmpty } from 'lodash'
export default {
  name: 'CommonTree',
  props: {
    data: {
      type: Array,
      default: () => ([])
    },
    defaultProps: {
      children: 'children',
      label: 'label'
    }
  },
  data () {
    return {
      info: null
    }
  },
  watch: {
    data: function (newVal) {
      newVal && this.handleNodeClick(newVal[0])
    }
  },
  methods: {
    isEmpty,
    handleNodeClick (data) {
      this.info = data
    }
  }
}
</script>
<style lang="scss">
.tree-content {
  display: flex;
  height: 100%;
}
.label-box {
  width: 65%;
  padding-left: 45px;
  text-align: left;
}

.empty-text {
  font-size: 14px;
}

.label-name{
  color: #fff;
  font-size: 18px;
  margin-bottom: 16px;
}
.explain {
  margin-left: 8px;
  color:#4DA5FE;
}
.metrics-container {
  margin-bottom:6px;
  font-size: 16px;
  .name {
    color: #BFBFBF;
  }
}
.text {
  font-size: 14px;
  color: #BFBFBF;
  &:first-child {
    margin-top: 10px;
  }
}
</style>
