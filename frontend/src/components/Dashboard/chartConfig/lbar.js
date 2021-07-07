import * as echarts from 'echarts'
// const gradients = ['#4DFFDF', '#E323FF']
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
  )
]
export default (data, customConfig = {}) => ({
  tooltip: {
    trigger: 'axis',
    textStyle: {
      align: 'left'
    },
    axisPointer: {
      type: 'shadow'
    }
  },
  color: ['#065DFF', '#31FBFB', '#129BFF', '#FFCF5F', '#D357FF'],
  legend: {
    top: 20,
    data: ['波音767-Max', '空客A800', '中国商飞C999', '波音686', '空客A780'],
    itemHeight: 10,
    itemWidth: 10
  },
  grid: {
    x: 110,
    y: 100
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
      boundaryGap: true,
      data: ['单位名称', '单位名称', '单位名称', '单位名称', '单位名称', '单位名称', '单位名称', '单位名称', '单位名称', '单位名称']
    }
  ],
  series: data.map((item, index) => ({
    ...item,
    itemStyle: {
      color: gradients[index % gradients.length]
    }
  })),
  ...customConfig
})
