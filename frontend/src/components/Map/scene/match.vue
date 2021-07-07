<template lang="pug">
#matchMapContainer.map-container
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

const PATH = []

const drawRoute = ({ route, map, style = {}, extData = [] }) => {
  const AMap = window.AMap
  const path = route.map(item => item.coordinates)

  // route.forEach(item => new AMap.Text({
  //   map,
  //   position: item.coordinates,
  //   anchor: 'center',
  //   text: item.name,
  //   offset: [0, -20],
  //   style: {
  //     'font-size': '14px',
  //     width: 'auto',
  //     'text-align': 'center',
  //     color: style.strokeColor,
  //     'border-color': style.strokeColor,
  //     'background-color': 'transparent'
  //   }
  // }))

  const routeLine = new AMap.Polyline({
    path: path,
    isOutline: false,
    strokeWeight: 6,
    strokeOpacity: 0.5,
    lineCap: 'round',
    lineJoin: 'round',
    extData: {
      info: route.map((item, idx) => ({
        label: idx === 0 ? '起点' : idx === route.length - 1 ? '终点' : '途经点',
        value: item.name
      })),
      properties: extData
    },
    ...style
  })

  routeLine.setMap(map)
  return routeLine
}

export default {
  name: 'MatchMap',
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
      this.map = new window.AMap.Map('matchMapContainer', {
        mapStyle: `amap://styles/${this.mapStyleId}`,
        zoom: 12.94, // 级别
        center: [103.800369, 36.096811],
        viewMode: '3D' // 使用3D视图
      })
      window.map = this.map
      this.draw()
    },
    draw () {
      const routes = (this.data || []).map(
        ({ id, route, extData }) =>
          drawRoute(
            {
              route,
              extData,
              map: this.map,
              style: { strokeColor: colors[(id || 0) % colors.length] }
            }
          ))
      this.addTooltip(routes)
    },
    addTooltip (routes) {
      const tooltip = genTooltip(this.map, { offset: [120, -20] })
      const group = new window.AMap.OverlayGroup(routes)
      group.on('mouseover', e => {
        const route = e.target
        route.setOptions({
          strokeOpacity: 1
        })
        const extData = route.getExtData()
        const { lat, lng } = e.lnglat
        tooltip.setPosition([lng, lat])
        tooltip.setText(
          [
            extData.info.map(item => `${item.label}: ${item.value}`).join('<br/>'),
            '<div class="extdata-wrapper">',
            extData.properties.map(item => `<span class="property-cell">${item.label}: ${item.value}</span>`).join('<br/>'),
            '</div>'
          ].join('')
        )
        tooltip.show()
      })
      group.on('mouseout', (e) => {
        const route = e.target
        route.setOptions({
          strokeOpacity: 0.5
        })
        tooltip.hide()
      })
    }
  },
  beforeUnmount () {
    this.map && this.map.destroy()
  },
  watch: {
    'data.length': 'draw'
  },
  mounted () {
    this.initMap()
  }
}
</script>
<style lang="scss">
.extdata-wrapper {
  margin-top: 4px;
}
.property-cell {
  position: relative;
  padding-left: 16px;
  &::before {
    position: absolute;
    content: '';
    left: 0;
    top: 5px;
    height: 8px;
    width: 8px;
    background: linear-gradient(270deg, #4DFFDF 0%, #4DA1FF 96.35%);
  }
}
</style>
