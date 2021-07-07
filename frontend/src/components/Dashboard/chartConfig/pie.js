export default (data, customConfig) => ({
  tooltip: {
    trigger: 'item',
    textStyle: {
      align: 'left'
    }
  },
  legend: {
    top: 'middle',
    orient: 'vertical',
    right: 15,
    icon: 'circle',
    itemHeight: 10,
    itemWidth: 10,
    itemGap: 12
  },
  series: [{
    name: '',
    type: 'pie',
    radius: ['40%', '70%'],
    center: ['30%', '58%'],
    avoidLabelOverlap: false,
    label: {
      show: false,
      position: 'center'
    },
    labelLine: {
      show: false
    },
    data
  }],
  ...customConfig
})
