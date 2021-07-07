const getColorStop = () => {
  return [0, 0.3, 1].map(offset => ({
    offset,
    color: `rgba(49, 251, 251, ${offset})`
  }))
}

export default (data, customConfig = {}) => ({
  tooltip: {
    trigger: 'axis',
    textStyle: {
      align: 'left'
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
  series: data.map((item, index) => ({
    ...item,
    tooltip: {
      trigger: 'item'
    },
    lineStyle: {
      opacity: 0
    },
    areaStyle: {
      color: {
        type: 'radial',
        x: 0.5,
        y: 0.5,
        r: 0.5,
        colorStops: getColorStop()
      }
    },
    label: {
      position: 'insideBottom',
      show: true,
      distance: 15,
      color: '#31FBFB'
    }
  })),
  ...customConfig
})
