<template lang="pug">
#constructionMapContainer.map-container
</template>
<script>
import { CONSTRUCTION_SITES } from './data/construction'

export default {
  name: 'FlightMap',
  props: {
    mapStyleId: {
      type: String,
      required: true
    }
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
      const map = new AMap.Map('constructionMapContainer', {
        esizeEnable: true,
        pitch: 50,
        rotation: 20,
        mapStyle: `amap://styles/${this.mapStyleId}`,
        center: [103.86293, 36.062342],
        zoom: 14.51, // 级别
        showBuildingBlock: true,
        viewMode: '3D' // 使用3D视图
      })

      this.map = map
      this.draw()
    },
    draw () {
      const AMap = window.AMap

      const labelLayer = new AMap.LabelsLayer()
      this.map.add(labelLayer)
      labelLayer.clear()

      CONSTRUCTION_SITES.forEach(item => {
        const labelsMarker = new AMap.LabelMarker({
          name: item.name,
          position: item.coordinates,
          zooms: [2, 22],
          opacity: 1,
          zIndex: 20,
          text: {
            content: item.name,
            direction: 'bottom',
            offset: [10, 23],
            style: {
              fontSize: 14,
              fontWeight: 'normal',
              fillColor: '#4DFFDF'
            }
          }
        })
        labelLayer.add(labelsMarker)
      })

      const infoWindow = new AMap.InfoWindow({
        offset: new AMap.Pixel(19, -2),
        autoMove: true,
        showShadow: true,
        content: '信息加载中...'
      })

      const showInfoWindow = (coordinates, content, image) => {
        infoWindow.setContent([
          `<div class="amap-info-text">${content}</div>`,
          `<img class="amap-info-img" src="/images/${image}.jpeg"/>`
        ].join(''))
        infoWindow.open(this.map, coordinates)
      }
      const markers = CONSTRUCTION_SITES.map(({ coordinates, description, image }) => {
        const marker = new AMap.Marker({
          map: this.map,
          position: coordinates,
          content: '<div class="construction-site"></div>'
        })
        marker.on('click', () => showInfoWindow(coordinates, description, image))
        return marker
      })
      const target = markers[6]
      target.emit('click', { target })
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
.amap-info-contentContainer {
  height: 300px;
  .amap-info-content {
    padding: 10px;
    color: #FFFFFF;
    text-align: center;
    font-size: 16px;
    height: 180px;
    width: 200px;
    background: #0D3477;
    border-radius: 4px;
    border: 1px solid #0AE0FF;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    .amap-info-text {
      margin-bottom: 0;
    }
    .amap-info-img {
      height: 130px;
      width: 200px;
    }
  }
  .amap-info-close {
    color: #4DFFDF;
  }
  .amap-info-sharp {
    border: none;
    width: 4px;
    height: 105px;
    background: linear-gradient(180deg, #4DFFDF 0%, rgba(77, 161, 255, 0) 100%);
    border-radius: 4px;
  }
}
.construction-site {
  background: url('./icons/construction.png');
  zoom: 0.2;
  width: 128px;
  height: 128px;
}
</style>
