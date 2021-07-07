export default (data, customConfig = {}) => ({
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    },
    textStyle: {
      align: 'left'
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
    x: 70,
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
  series: data,
  ...customConfig
})
