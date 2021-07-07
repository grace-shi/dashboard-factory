export default (data, customConfig) => ({
  radius: [0, '40%'],
  // center: ['10%', '35%'],
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b}: {c} ({d}%)'
  },
  color: [
    '#991BFA',
    '#3296ED',
    '#7719E3',
    '#9D53F2',
    '#067D77',
    '#26ABA4',
    '#EB7F13',
    '#F7A452',
    '#fca4bb',
    '#dc69aa',
    '#07a2a4',
    '#9a7fd1',
    '#588dd5',
    '#f5994e',
    '#c05050',
    '#59678c',
    '#c9ab00',
    '#7eb00a',
    '#6f5553',
    '#c14089'
  ],
  grid: {
    x: 10,
    y: 10
  },
  legend: {
    top: 'middle',
    orient: 'vertical',
    right: 5,
    icon: 'circle',
    itemHeight: 10,
    itemWidth: 10,
    itemGap: 12,
    formatter: name => {
      const datas = data[1].data
      let target
      let unit
      for (let i = 0; i < datas.length; i++) {
        if (datas[i].name === name) {
          target = datas[i].value
          unit = datas[i].unit
        }
      }
      const arr = [
        '{a|' +
        name +
        '}{b|' +
        target / 10 +
        '%}{c|' +
        '(' + target + unit + ')' +
        '}'
      ]
      return arr.join('\n')
    },
    textStyle: {
      rich: {
        a: {
          verticalAlign: 'right',
          fontSize: 12,
          align: 'left',
          padding: [0, 0, 0, 0],
          width: 70
        },
        b: {
          fontSize: 12,
          align: 'left',
          color: '#4DD1FF',
          width: 50,
          padding: [0, 0, 0, 18]
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
  series: data.map(item => ({
    ...item,
    center: ['25%', '50%']
  })),
  ...customConfig
})
