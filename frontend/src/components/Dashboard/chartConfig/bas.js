import { isNumber } from 'lodash'
import * as echarts from 'echarts'
const gradients = [
  new echarts.graphic.LinearGradient(
    0,
    0,
    1,
    0,
    [
      {
        offset: 0,
        color: '#4DA1FF'
      },

      {
        offset: 1,
        color: '#4DFFDF'
      }
    ],
    false
  ),
  new echarts.graphic.LinearGradient(
    0, // x
    0, // y
    1, // x1
    0, // y1
    [
      {
        offset: 0,
        color: '#7517F8' // 100% 处的颜色
      },

      {
        offset: 1,
        color: '#E323FF' // 0% 处的颜色
      }
    ],
    false
  )
]

export default (data, customConfig = {}, query = {}) => {
  const hasThreshold = isNumber(parseInt(query.count)) && parseInt(query.count) > 0
  const hasPeopleThreshold = isNumber(parseInt(query.threshold)) && parseInt(query.threshold) > 0
  const getMarkLine = (index) => {
    if (index === 0) {
      return hasThreshold ? {
        lineStyle: {
          color: '#4DFFDF',
          width: 3
        },
        symbol: 'none',
        data: [{
          xAxis: query.count
        }]
      } : {}
    }
    return hasPeopleThreshold ? {
      lineStyle: {
        color: '#E323FF',
        width: 3
      },
      symbol: 'none',
      data: [{
        xAxis: query.threshold
      }]
    } : {}
  }

  return {
    tooltip: {
      trigger: 'axis',
      textStyle: {
        align: 'left'
      },
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      top: 15,
      itemHeight: 10,
      itemWidth: 10
    },
    grid: {
      x: 70,
      y: 70
    },
    xAxis: [
      {
        type: 'value'
      }
    ],
    yAxis: [
      {
        type: 'category',
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        boundaryGap: true
      }
    ],
    series: data.map((item, index) => ({
      ...item,
      itemStyle: {
        color: gradients[index % gradients.length]
      },
      markLine: getMarkLine(index)
    })),
    ...customConfig
  }
}
