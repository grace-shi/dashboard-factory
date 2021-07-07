import { isNumber } from 'lodash'
import * as echarts from 'echarts'
// const gradients = ['#4DFFDF', '#E323FF']
const gradients = [
  new echarts.graphic.LinearGradient(
    0,
    1,
    0,
    0,
    [
      {
        offset: 0,
        color: '#4DFFDF'
      },

      {
        offset: 1,
        color: '#4DA1FF'
      }
    ],
    false
  )
]
export default (data, customConfig = {}, query = {}) => {
  const hasThreshold = isNumber(parseInt(query.threshold)) && parseInt(query.threshold) > 0
  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      textStyle: {
        align: 'left'
      }
    },
    legend: {
      data: ['次数'],
      icon: 'rect',
      itemHeight: 10,
      itemWidth: 10,
      left: 30,
      top: 20
    },
    grid: {
      x: 70,
      y: 70
    },
    xAxis: [{
      type: 'category',
      axisTick: {
        show: false
      },
      data: ['2012', '2013', '2014', '2015', '2016']
    }],
    yAxis: [{
      type: 'value'
    }],
    series: data.map((item, index) => ({
      ...item,
      itemStyle: {
        color: gradients[index % gradients.length]
      },
      markLine: hasThreshold ? {
        itemStyle: {
          show: true,
          color: '#4DA1FF'
        },
        data: [{
          yAxis: query.threshold
        }]
      } : {}
    })),
    ...customConfig
  }
}
