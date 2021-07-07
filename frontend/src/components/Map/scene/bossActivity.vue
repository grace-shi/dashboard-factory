<template lang="pug">
#bossMapContainer.map-container
</template>

<script>
import { EVENT_LOCATIONS } from './data/events'
import useAjax from '@/functions/useAjax'

export default {
  name: 'BossMap',
  props: {
    mapStyleId: {
      type: String,
      required: true
    },
    config: {
      type: Object,
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
    return { data: EVENT_LOCATIONS, fetchData: () => {}, loading: false, query: {} }
  },
  data () {
    return {
      map: null,
      loca: null
    }
  },
  methods: {
    initMap () {
      const AMap = window.AMap
      const map = new AMap.Map('bossMapContainer', {
        esizeEnable: true,
        mapStyle: `amap://styles/${this.mapStyleId}`,
        center: [103.793283, 36.085112],
        pitch: 15,
        rotation: 180,
        zoom: 12.49, // 级别
        showBuildingBlock: true,
        viewMode: '3D' // 使用3D视图
      })

      this.map = map
      // this.loca = new window.Loca.Container({ map })
      window.map = map
      this.draw()
    },
    draw () {
      const AMap = window.AMap

      const labelLayer = new AMap.LabelsLayer()
      this.map.add(labelLayer)

      labelLayer.clear()
      this.data.forEach(item => {
        const labelsMarker = new AMap.LabelMarker({
          name: item.name,
          position: item.coordinates,
          zooms: [2, 22],
          opacity: 1,
          zIndex: 20,
          text: {
            content: item.name,
            direction: 'bottom',
            offset: [-5, 0],
            style: {
              fontSize: 12,
              fontWeight: 'normal',
              fillColor: '#FF7D05'
            }
          }
        })
        labelLayer.add(labelsMarker)
      })

      const path = this.data.map(
        ({ coordinates }) => new AMap.LngLat(...coordinates)
      )
      const polyline = new AMap.Polyline({
        path,
        strokeWeight: 6,
        strokeOpacity: 0.5,
        strokeColor: '#FF7D05',
        lineJoin: 'bevel'
      })

      this.map.add(polyline)

      this.data.forEach(
        ({ coordinates }) => new AMap.Marker({
          map: this.map,
          position: coordinates,
          content: '<div class="position-pin"></div>',
          offset: new AMap.Pixel(-16, -32)
        })
      )
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
.position-pin {
  background: url('./icons/pin.png');
  width: 32px;
  height: 32px;
}
</style>
