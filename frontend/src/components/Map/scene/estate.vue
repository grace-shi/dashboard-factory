<template lang="pug">
#estateMapContainer.map-container
</template>
<script>
import { ESTATE_PATH, MONITOR_POINTS } from './data/path'
import { genTooltip } from './utils'

export default {
  name: 'EstateMap',
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
    getOptions () {
      return {
        hideWithoutStyle: false,
        areas: [
          {
            rejectTexture: true,
            path: ESTATE_PATH
          }
        ]
      }
    },
    initMap () {
      const AMap = window.AMap
      const buildingLayer = new AMap.Buildings({ zIndex: 130, zooms: [16, 20] })
      buildingLayer.setStyle(this.getOptions())

      const map = new AMap.Map('estateMapContainer', {
        mapStyle: `amap://styles/${this.mapStyleId}`,
        zoom: 17.95,
        pitch: 65,
        rotation: 50,
        showBuildingBlock: true,
        showIndoorMap: false,
        center: [103.805807, 36.056824],
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

      const canvas = document.createElement('canvas')
      const customLayer = new AMap.CustomLayer(canvas, {
        zooms: [16.5, 20],
        alwaysRender: true,
        zIndex: 22,
        opacity: 0.35
      })
      const markerLayer = MONITOR_POINTS.map(({ latitude, longitude, ...extData }) =>
        new AMap.Marker({
          map: this.map,
          position: [longitude, latitude],
          extData: extData,
          shape: 'rect',
          content: extData.status
            // ? `<div class="open-electric-eyes">${[latitude, longitude]}</div>`
            // : `<div class="close-electric-eyes">${[latitude, longitude]}</div>`
            ? `
              <div class="eye-wrapper">
                <div class="open-electric-eyes"></div>
              </div>
            `
            : `
              <div class="eye-wrapper">
                <div class="close-electric-eyes"></div>
              </div>
            `
        })
      )

      this.addTooltip(markerLayer)

      customLayer.render = () => {
        const { width, height } = this.map.getSize()
        canvas.style.width = `${width}px`
        canvas.style.height = `${height}px`
        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext('2d')
        ctx.fillStyle = '#6ADFAF'
        ctx.strokeStyle = 'transparent'
        ctx.lineWidth = 1

        MONITOR_POINTS
          .filter(({ status }) => status)
          .map(({ latitude, longitude, range }) => {
            const originalPos = [longitude, latitude]
            const pos = this.map.lngLatToContainer(originalPos)
            const radius = 130
            ctx.beginPath()

            const x = pos.x + 14
            const y = pos.y + 14
            ctx.moveTo(x, y)
            ctx.arc(x, y, radius, ...range)
            ctx.lineTo(x, y)
            ctx.closePath()
            ctx.stroke()
            ctx.fill()
          })
      }

      customLayer.setMap(this.map)
      customLayer.show()
    },
    addTooltip (markers) {
      const tooltip = genTooltip(this.map, { offset: [60, -80] })
      const markerGroup = new window.AMap.OverlayGroup(markers)
      let hoveredItem = null
      markerGroup.on('mouseover', e => {
        hoveredItem = e.target
        const { name, status, uptime, boottime } = hoveredItem.getExtData()
        const { lat, lng } = e.lnglat
        tooltip.setPosition([lng, lat])
        tooltip.setText(`
          <div class="tooltip-title">${name}设备</div>
          <br/>
          <div class="metric-container">
            <div class="metric-wrapper">
              <span class="legend-cube">
                状态
              </span>
              <span>${status ? '开机' : '关机'}</span>
            </div>
            <div class="metric-wrapper">
              <span class="legend-cube">
                运行时长
              </span>
              <span>${uptime || 0}</span>
            </div>
            <div class="metric-wrapper">
              <span class="legend-cube">
                开机时间
              </span>
              <span>${boottime || '暂无'}</span>
            </div>
          </div>
        `)
        tooltip.show()
      })
      markerGroup.on('mouseout', e => {
        tooltip.hide()
        hoveredItem = null
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
.eye-wrapper {
  width: 50px;
  height: 50px;
}
.open-electric-eyes {
  background: url('./icons/electric-eyes.png');
  width: 32px;
  height: 32px;
  zoom: 0.8;
}

.close-electric-eyes {
  background: url('./icons/electric-eyes-close.png');
  width: 32px;
  height: 32px;
  zoom: 0.8;
}
</style>
