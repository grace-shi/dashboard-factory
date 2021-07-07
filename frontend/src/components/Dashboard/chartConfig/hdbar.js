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
        color: '#E323FF'
      },

      {
        offset: 1,
        color: '#7517F8'
      }
    ],
    false
  )
]
export default (data, customConfig = {}) => ({
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  legend: {
    data: ['次数'],
    icon: 'rect',
    itemHeight: 0,
    itemWidth: 0,
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
    }
  })),
  ...customConfig
})
