<template lang="pug">
#drivingMapContainer.map-container
</template>
<script>
import useAjax from '@/functions/useAjax'
import { genTooltip } from './utils'

const colors = [
  '#ffcf5f',
  '#FF7D05',
  '#4DA1FF',
  '#61ddaa',
  '#ff6e76'
]

const PATH = [
  {
    id: 1,
    route: [
      {
        label: '兰州火车站',
        coordinates: [103.75428928574607, 36.073526394680265]
      },
      {
        label: '武威',
        coordinates: [102.64543658426733, 37.925922970842805]
      }
    ],
    extData: [
      {
        label: '人数',
        value: 1000
      },
      {
        label: '车流量',
        value: 300
      }
    ]
  },
  {
    id: 1,
    route: [
      {
        label: '武威',
        coordinates: [102.64543658426733, 37.925922970842805]
      },
      {
        label: '金昌',
        coordinates: [102.34931768333885, 38.54796440228573]
      }
    ],
    extData: [
      {
        label: '人数',
        value: 1000
      },
      {
        label: '车流量',
        value: 300
      }
    ]
  },
  {
    id: 1,
    route: [
      {
        label: '金昌',
        coordinates: [102.34931768333885, 38.54796440228573]
      },
      {
        label: '张掖',
        coordinates: [100.45760420339327, 38.94179043611231]
      }
    ],
    extData: [
      {
        label: '人数',
        value: 1000
      },
      {
        label: '车流量',
        value: 300
      }
    ]
  },
  {
    id: 2,
    route: [
      {
        label: '海东',
        coordinates: [102.8162676485404, 35.90842007417943]
      },
      {
        label: '西宁',
        coordinates: [101.75227942505747, 36.62608204533208]
      }
    ],
    extData: [
      {
        label: '人数',
        value: 1000
      },
      {
        label: '车流量',
        value: 300
      }
    ]
  },
  {
    id: 2,
    route: [
      {
        label: '西宁',
        coordinates: [101.75227942505747, 36.62608204533208]
      },
      {
        label: '海北',
        coordinates: [100.56515712013018, 37.15951264720955]
      }
    ],
    extData: [
      {
        label: '人数',
        value: 1000
      },
      {
        label: '车流量',
        value: 300
      }
    ]
  }
]
const drawRoute = ({ route, extData, map, style = {} }) => {
  const AMap = window.AMap
  const path = route.map(item => item.coordinates)

  const routeLine = new AMap.Polyline({
    path: path,
    isOutline: false,
    strokeWeight: 6,
    strokeOpacity: 0.5,
    lineCap: 'round',
    extData: {
      title: `
        起点: ${route[0].label}
        <br />
        终点: ${route[1].label}
        <br />
      `,
      properties: extData
    },
    ...style
  })

  return routeLine
}

export default {
  name: 'SelfDrivingMap',
  props: {
    config: {
      type: Object,
      required: true
    },
    mapStyleId: {
      type: String,
      required: true
    }
  },
  setup (props) {
    const params = (props.config.properties || []).reduce((acc, property) => {
      acc[property.key] = ''
      return acc
    }, {})

    if (props.config.url) {
      const { fetchData, data, loading, query } = useAjax({
        url: props.config.url,
        params
      })

      return { fetchData, data, loading, query }
    }
    return { data: PATH, fetchData: () => {}, loading: false, query: {} }
  },
  data () {
    return {
      map: null
    }
  },
  methods: {
    initMap () {
      this.map = new window.AMap.Map('drivingMapContainer', {
        mapStyle: `amap://styles/${this.mapStyleId}`,
        zoom: 8, // 级别
        center: [102.172198, 37.903138], // 中心点坐标
        viewMode: '3D' // 使用3D视图
      })
      window.map = this.map
      this.draw()
    },
    draw () {
      const markers = (this.data || []).map(
        ({ id, route, extData }) =>
          drawRoute(
            {
              route,
              map: this.map,
              extData,
              style: { strokeColor: colors[(id || 0) % colors.length] }
            }
          ))
      const markerGroup = new window.AMap.OverlayGroup(markers)

      this.map.add(markerGroup)
      this.addTooltip(markerGroup)
    },
    addTooltip (group) {
      const tooltip = genTooltip(this.map, { offset: [80, -60] })
      let hoveredItem = null
      group.on('mouseover', (e) => {
        if (hoveredItem === e.target) {
          return
        }
        e.target.setOptions({
          strokeOpacity: 1
        })
        hoveredItem = e.target

        const extData = hoveredItem.getExtData()
        const { lat, lng } = e.lnglat
        tooltip.setPosition([lng, lat])
        tooltip.setText(`
          ${extData.title}
          <br/>
          ${extData.properties.map(item => `${item.label}: ${item.value}`).join('<br/>')}
        `)
        tooltip.show()
      })
      group.on('mouseout', e => {
        hoveredItem.setOptions({
          strokeOpacity: 0.6
        })
        hoveredItem = null
        tooltip.hide()
      })
    }
  },
  beforeUnmount () {
    this.map && this.map.destroy()
  },
  watch: {
    data: {
      deep: true,
      handler: function (val) {
        if (val && val.length) {
          this.initMap()
        }
      }
    }
  }
}
</script>

<style lang="scss">
.map-container {
  position: absolute;
  height: 100vh;
  width: 100vw;
  .amap-logo {
    display: none !important;
  }
  .amap-copyright {
    display: none !important;
  }
}
</style>
