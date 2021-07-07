<template lang="pug">
component(
  v-if="loadMap",
  :is="capitalize(type)",
  :config="config",
  :mapStyleId="mapStyleId"
)
</template>

<script>
import AMapLoader from '@amap/amap-jsapi-loader'

import { capitalize } from 'lodash'
import Selfdriving from './scene/selfDriving'
import Flight from './scene/flight'
import Estate from './scene/estate'
import Bossactivity from './scene/bossActivity'
import Construction from './scene/construction'
import Staff from './scene/staff'
import Match from './scene/match'

const key = process.env.VUE_APP_MAP_KEY
const mapStyleId = process.env.VUE_APP_MAP_STYLE_ID

window.lodash = capitalize
export default {
  name: 'BackgroundMap',
  props: {
    config: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      loadMap: false,
      mapStyleId
    }
  },
  computed: {
    type () {
      return this.$route.params.type || 'staff'
    }
  },
  components: {
    Selfdriving,
    Bossactivity,
    Estate,
    Flight,
    Construction,
    Staff,
    Match
  },
  methods: {
    capitalize
  },
  mounted () {
    this.loadMap = false
    if (window.AMap) {
      return
    }
    AMapLoader.load({
      key,
      version: '2.0',
      plugins: [
        'AMap.Scale',
        'AMap.CustomLayer'
      ],
      Loca: {
        version: '2.0.0'
      }
    })
      .then(() => {
        this.loadMap = true
        console.log('load map success')
      })
      .catch(e => {
        console.log(e)
      })
  }
}
</script>
<style lang="scss">
.amap-overlay-text-container {
  .tooltip-title {
    font-weight: 600;
    font-size: 16px;
  }
  .metric-container {
    display: flex;
    flex-direction: column;
    .metric-wrapper {
      display: inline-flex;
      justify-content: space-between;
    }
  }
}
</style>
