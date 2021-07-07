export default (data, customConfig = {}) => ({
  tooltip: {
    trigger: 'axis',
    textStyle: {
      align: 'left'
    }
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: ['2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021']
  },
  yAxis: {
    type: 'value'
  },
  series: data,
  ...customConfig
})
