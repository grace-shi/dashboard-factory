<template lang="pug">
el-row.dashboard-container(:gutter="24")
  el-col(
    v-for="([x, width]) in cols",
    :key="x",
    :span="width",
  )
    Panel(
      v-for="chart in charts[x]",
      :key="chart.id",
      :config="chart"
    )
</template>

<script>
import Panel from './Panel'
import { calcCols } from './utils'

export default {
  name: 'Dashboard',
  props: {
    config: {
      type: Object
    }
  },
  components: {
    Panel
  },
  computed: {
    cols () {
      return calcCols(this.panels || [])
    },
    panels () {
      return this.config.panels
    },
    charts () {
      const result = this.panels.reduce((result, panel) => {
        const { x } = panel
        if (result[x]) {
          result[x].push(panel)
        } else {
          result[x] = [panel]
        }
        return result
      }, {})
      for (const key in result) {
        result[key].sort(({ y: y1 }, { y: y2 }) => y1 - y2)
      }
      return result
    }
  }
}
</script>

<style lang="scss">
.dashboard-container {
  height: calc(100vh - 160px);
}
</style>
