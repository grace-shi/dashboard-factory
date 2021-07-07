<template lang="pug">
.dashboard-container(:gutter="24")
  .panel-container(
    v-for="panel in config.panels",
    :key="panel.id",
    :style="getPanelStyle(panel)"
  )
    Panel(
      :config="panel"
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
    }
  },
  methods: {
    getPanelStyle (panel) {
      const { x, y, width, height } = panel
      return {
        'z-index': 1,
        'grid-area': `${y} / ${x} / ${y + height} / ${x + width}`
      }
    }
  }
}
</script>

<style lang="scss">
.dashboard-container {
  display: grid;
  width: 100%;
  height: calc(100vh - 180px);
  grid-template-columns: repeat(24, minmax(0, 1fr));
  grid-template-rows: repeat(24, minmax(0, 1fr));
  grid-gap: 24px;
}
</style>
