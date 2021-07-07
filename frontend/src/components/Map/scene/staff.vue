<template lang="pug">
#staffMapContainer.map-container
</template>
<script>
import { STAFF_PATH, MOVING_STAFF } from './data/path'
import { genTooltip } from './utils'

export default {
  name: 'StaffMap',
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
  // setup (props) {
  //   const params = (props.config.properties || []).reduce((acc, property) => {
  //     acc[property.key] = ''
  //     return acc
  //   }, {})

  //   if (props.config.url) {
  //     const { fetchData, data, loading, query } = useAjax({
  //       url: props.config.url,
  //       params
  //     })

  //     return { fetchData, data, loading, query }
  //   }
  //   return { data: [], fetchData: () => {}, loading: false, query: {} }
  // },
  data () {
    return {
      map: null,
      loca: null
    }
  },
  methods: {
    getOptions () {
      return {
        hideWithoutStyle: false,
        areas: [
          {
            rejectTexture: true,
            path: STAFF_PATH
          }
        ]
      }
    },
    initMap () {
      const AMap = window.AMap
      const buildingLayer = new AMap.Buildings({ zIndex: 130, zooms: [16, 20] })
      buildingLayer.setStyle(this.getOptions())

      const map = new AMap.Map('staffMapContainer', {
        mapStyle: `amap://styles/${this.mapStyleId}`,
        zoom: 17.61,
        pitch: 45,
        rotation: 90,
        showBuildingBlock: true,
        showIndoorMap: false,
        center: [120.513403, 31.2425],
        features: ['bg', 'point', 'road'],
        viewMode: '3D',
        layers: [AMap.createDefaultLayer(), buildingLayer]
      })
      map.addControl(new AMap.Scale())
      this.map = map
      window.map = map

      this.draw()
    },
    draw () {
      const AMap = window.AMap
      // eslint-disable-next-line no-new
      new AMap.Polygon({
        zooms: [2, 20],
        zIndex: 10,
        map: this.map,
        bubble: true,
        fillOpacity: 0.5,
        strokeWeight: 1,
        path: this.getOptions().areas[0].path
      })

      const markerGroup = new window.AMap.OverlayGroup(
        MOVING_STAFF.map(({ extData, latitude, longitude }) => new AMap.Marker({
          map: this.map,
          position: [longitude, latitude],
          content: '<div class="moving-people"></div>',
          extData
        }))
      )
      const tooltip = genTooltip(this.map, { offset: [0, -20] })
      let hoveredItem = null
      markerGroup.on('mouseover', (e) => {
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
        tooltip.setText(
          extData
            .map(item => `${item.label}: ${item.value}`)
            .join('<br/>')
        )
        tooltip.show()
      })
      markerGroup.on('mouseout', e => {
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
  mounted () {
    this.initMap()
  }
}
</script>
<style lang="scss">
.moving-people {
  background: url('./icons/dot.png');
  width: 32px;
  height: 32px;
  zoom: 0.4;
}
</style>
