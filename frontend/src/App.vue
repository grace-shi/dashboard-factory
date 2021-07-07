<template lang="pug">
.app-container.d-flex
  BackgroundMap(v-if="mapConfig", :config="mapConfig")
  router-view(v-if="dashboardConfig", :dashboardConfig="dashboardConfig")
  el-drawer(
    title="编辑面板配置",
    v-model="drawer",
    direction="rtl",
    :modal="false",
    destroy-on-close
  )
    ConfigPanel(
      :type="type",
      @reset="reset",
      @submit="submit"
    )
</template>

<script>
import BackgroundMap from '@/components/Map'
import * as shortid from 'shortid'
import menu from '@/constant/menu'
import ConfigPanel from '@/views/ConfigPanel'
import axios from 'axios'

export default {
  name: 'App',
  components: {
    BackgroundMap,
    ConfigPanel
  },
  data () {
    return {
      dashboardConfig: null
    }
  },
  methods: {
    async getConfig () {
      const activeMenu = menu.find(m => m.name.toLowerCase() === this.type.toLowerCase())
      const type = activeMenu ? activeMenu.name : menu[0].name

      const rsp = await axios.get(`/config/${type}`)
      const config = rsp.data.data
      this.dashboardConfig = {
        ...config,
        panels: config.panels.map(p => ({ id: shortid.generate(), ...p }))
      }
    },
    async submit (data) {
      await axios.put(`/config/${this.type}`, { data })
      this.$notify({
        title: '成功',
        message: '更新成功，请刷新页面',
        type: 'success'
      })
      this.getConfig()
    },
    async reset () {
      await axios.post(`/config/${this.type}`)
      this.$notify({
        title: '成功',
        message: '重置成功，请刷新页面',
        type: 'success'
      })
      this.getConfig()
    }
  },
  computed: {
    drawer: {
      get () {
        const edit = this.$route.query.edit
        return edit === 'true'
      },
      set (val) {
        this.$router.push({
          query: {
            edit: val
          }
        })
      }
    },
    type () {
      const type = this.$route.params.type || ''
      const activeMenu = menu.find(m => m.name.toLowerCase() === type.toLowerCase())
      return activeMenu ? activeMenu.name : menu[0].name
    },
    mapConfig () {
      if (!this.dashboardConfig) {
        return null
      }
      const dashboardConfig = this.dashboardConfig
      const mapConfig = dashboardConfig.panels.find(item => item.type === 'map')
      return mapConfig
    }
  },
  watch: {
    type: {
      handler: 'getConfig',
      immediate: true
    }
  }
}
</script>

<style lang="scss">
@font-face{
  font-family: 'YouSheBiaoTiHei';
  src: url('./fonts/YouSheBiaoTiHei.ttf');
}
body {
  margin: 0;
  /* background: url('./assets/bg.png');
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover; */
}

.el-loading-mask {
  background-color: rgba(0, 0, 0, 0.5) !important;
}

#app {
  height: 100vh;
  background-color: #081A30;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  color: #e0e8ef;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}

#mapContainer {
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
