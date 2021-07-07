import * as echarts from 'echarts'

export default (data, customConfig = {}) => {
  const value = data[0].data
  const max = parseInt(Math.max(...value) / 100) * 100
  const min = parseInt(Math.min(...value) / 100) * 100
  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    color: ['#E45061', '#796CFF', '#129BFF', '#68F6EA', '#D357FF', '#FDEE7B'],
    yAxis: {
      type: 'value',
      min: parseInt(min / 100) * 100
    },
    series: data.map(item => ({
      ...item,
      type: 'scatter',
      symbolSize: (data) => {
        return Math.floor((data - min) * 50 / (max - min))
      },
      itemStyle: {
        opacity: 0.8,
        shadowBlur: 10,
        shadowOffsetX: 0,
        shadowOffsetY: 0,
        shadowColor: 'rgba(0, 0, 0, 0.5)',
        color: new echarts.graphic.RadialGradient(0.3, 0.3, 1, [{
          offset: 0,
          color: 'rgba(104, 246, 234, 0.5)'
        }, {
          offset: 1,
          color: 'rgba(104, 246, 234, 1)'
        }])
      }
    })),
    ...customConfig
  }
}
