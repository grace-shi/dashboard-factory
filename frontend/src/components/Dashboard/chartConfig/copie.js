export default (data, customConfig) => ({
  backgroundColor: 'black',
  angleAxis: {
    type: 'value',
    min: 0,
    max: 70,
    axisLine: {
      show: false
    },
    axisTick: {
      show: false
    },
    splitLine: {
      show: false
    },
    axisLabel: {
      show: false
    }
  },
  radiusAxis: {
    type: 'category',
    z: 100,
    axisLine: {
      show: false
    },
    axisTick: {
      show: false
    },
    axisLabel: {
      show: false
    }
  },
  polar: {
    center: ['26%', '50%']
  },
  tooltip: {
    show: true
  },
  series: data,
  legend: {
    top: 'middle',
    orient: 'vertical',
    right: 10,
    icon: 'circle',
    itemHeight: 10,
    itemWidth: 10,
    itemGap: 12,
    show: true,
    data: ['参加人数', '装备数量', '持续时间'],
    selectedMode: false,
    formatter: name => {
      let value
      let unit
      for (let i = 0; i < data.length; i++) {
        if (data[i].name === name) {
          value = data[i].value
          unit = data[i].unit
        }
      }
      const arr = ['{a|' + name + '}{b|' + value / 10 + '}{c|' + value + unit + '}']
      return arr.join('\n')
    },
    textStyle: {
      rich: {
        a: {
          verticalAlign: 'right',
          fontSize: 12,
          align: 'left',
          width: 70
        },
        b: {
          fontSize: 12,
          align: 'left',
          color: '#4DD1FF',
          width: 40
        },
        c: {
          fontSize: 12,
          align: 'left',
          width: 50,
          color: '#4DD1FF',
          padding: [0, 0, 0, 0]
        }
      }
    }
  },
  ...customConfig
})
