<template lang="pug">
#flightMapContainer.map-container
</template>
<script>
import useAjax from '@/functions/useAjax'
import BreathGreenImg from '@/assets/breath_green.png'
import { FLIGHT_PAHT } from './data/city'
import chinaGeoJson from './data/china'
import { genTooltip } from './utils'

const COLORS = [
  '#3c23bc',
  '#065dff',
  '#2d99ff',
  '#4dd1ff',
  '#61ddaa',
  '#73a373',
  '#73b9bc'
]

export default {
  name: 'FlightMap',
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
        params,
        adaptor: val => val,
        initialDataVal: {}
      })
      return { fetchData, data, loading, query }
    }
    return { data: { data: FLIGHT_PAHT, colors: COLORS }, fetchData: () => {}, loading: false, query: {} }
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
      const map = new AMap.Map('flightMapContainer', {
        mapStyle: `amap://styles/${this.mapStyleId}`,
        showLabel: false,
        center: [103.695054, 45.905962],
        pitch: 50,
        rotation: 20,
        zoom: 4, // 级别
        viewMode: '3D' // 使用3D视图
      })

      this.map = map
      window.map = map
      this.loca = new window.Loca.Container({ map })

      this.draw3DMap()
      this.draw()
    },
    draw3DMap () {
      const Loca = window.Loca
      const geo = new Loca.GeoJSONSource({
        data: chinaGeoJson
      })
      const plLayer = new Loca.PolygonLayer({
        // loca,
        zIndex: 120,
        opacity: 0.8,
        // cullface: 'none',
        shininess: 10,
        hasSide: true
      })
      plLayer.setSource(geo)
      // const colors = this.data.colors || COLORS
      plLayer.setStyle({
        topColor: (index, feature) => {
          // return colors[index % colors.length]
          return `rgba(7, 88, 196, ${((index + 1) % 10) * 0.1})`
        },
        sideColor: (index, feature) => {
          return 'rgba(7, 88, 196, 1)'
        },
        height: (index, feature) => {
          return 150000
        },
        altitude: 0
      })
      this.loca.add(plLayer)
    },
    draw () {
      const AMap = window.AMap
      const Loca = window.Loca

      const labelLayer = new AMap.LabelsLayer({
        rejectMapMask: true,
        collision: true,
        animation: true
      })
      this.map.add(labelLayer)

      const scatterLayer1 = new Loca.ScatterLayer({
        zIndex: 10,
        opacity: 1,
        visible: true,
        zooms: [2, 22]
      })
      const scatterLayer3 = new Loca.ScatterLayer({
        zIndex: 10,
        opacity: 0.8,
        visible: true,
        zooms: [2, 22]
      })

      const centerPoint = new Loca.GeoJSONSource({
        data: {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: [103.73, 36.03]
              }
            }
          ]
        }
      })
      scatterLayer3.setSource(centerPoint)
      scatterLayer3.setStyle({
        size: [300000, 300000],
        unit: 'meter',
        texture: 'https://a.amap.com/Loca/static/static/center-point.png'
      })
      this.loca.add(scatterLayer3)

      labelLayer.clear()
      const cities = (this.data.data || []).reduce((acc, path) => {
        const tmp = path.filter(
          city => !acc.some(item => item.label === city.label)
        )
        return [...acc, ...tmp]
      }, [])
      cities.forEach(item => {
        const labelsMarker = new AMap.LabelMarker({
          name: item.label,
          position: item.coordinates,
          zooms: [2, 22],
          opacity: 1,
          zIndex: 10,
          text: {
            content: item.label,
            direction: 'bottom',
            style: {
              fontSize: 12,
              fontWeight: 'normal',
              fillColor: '#fff'
            }
          }
        })
        labelLayer.add(labelsMarker)
      })

      const source1 = new Loca.GeoJSONSource({
        data: {
          type: 'FeatureCollection',
          features: cities.slice(1).map(city => ({
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: city.coordinates
            },
            properties: {
              country: city.name
            }
          }))
        }
      })
      scatterLayer1.setSource(source1)
      scatterLayer1.setStyle({
        size: [500000, 500000],
        unit: 'miter',
        animate: true,
        duration: 1000,
        texture: BreathGreenImg // 'https://a.amap.com/Loca/static/static/green.png'
      })
      this.loca.add(scatterLayer1)
      this.loca.animate.start()

      const linkLayer = new Loca.LinkLayer({
        zIndex: 20,
        opacity: 1,
        visible: true,
        zooms: [2, 22]
      })
      const source2 = new Loca.GeoJSONSource({
        data: {
          type: 'FeatureCollection',
          features: this.data.data.map(flight => ({
            type: 'Feature',
            geometry: {
              type: 'LineString',
              coordinates: [flight[0].coordinates, flight[1].coordinates]
            },
            properties: {
              flight
            }
          }))
        }
      })
      linkLayer.setSource(source2)

      linkLayer.setStyle({
        lineColors: () => (['#6ADFAF']),
        smoothSteps: () => 100
      })
      this.loca.add(linkLayer)

      const tooltip = genTooltip(this.map, { offset: [0, -20] })
      this.map.on('mousemove', e => {
        const feat = linkLayer.queryFeature(e.pixel.toArray())
        if (feat) {
          linkLayer.setStyle({
            lineColors: (idx, feature) =>
              feature.link === feat ? ['#F7A452'] : ['#6ADFAF']
          })

          const { lat, lng } = e.lnglat
          tooltip.setPosition([lng, lat])
          const flight = feat.properties.flight
          tooltip.setText(`
            始发地: ${flight[0].label}
            <br />
            目的地: ${flight[1].label}
          `)
          tooltip.show()
        } else {
          linkLayer.setStyle({
            lineColors: () => ['#6ADFAF']
          })
          tooltip.hide()
        }
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
        if (val && val.data.length) {
          this.initMap()
        }
      }
    }
  }
}
</script>
