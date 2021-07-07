import { debounce } from 'lodash'
import { onMounted, onUnmounted } from 'vue'
import * as ECharts from 'echarts'
import LTCTheme from '@/charts/theme.ltc.json'

export default ({
  chartId,
  theme
}) => {
  let chartInstance = null

  const resizeHandler = debounce(() => {
    return chartInstance && chartInstance.resize()
  }, 200)

  const setOptions = opts => {
    if (chartInstance) {
      chartInstance.resize()
    }
    chartInstance.setOption(opts)
  }

  const toggleLegend = name => {
    chartInstance.dispatchAction({
      type: 'legendToggleSelect',
      name
    })
  }

  const resize = () => {
    chartInstance.resize()
  }

  onMounted(() => {
    const el = document.getElementById(chartId)
    chartInstance = ECharts.init(el, theme || LTCTheme)
    window.addEventListener('resize', resizeHandler)
  })

  onUnmounted(() => {
    chartInstance && chartInstance.dispose()
    chartInstance = null

    window.removeEventListener('resize', resizeHandler)
  })

  return {
    setOptions,
    resize,
    toggleLegend
  }
}
