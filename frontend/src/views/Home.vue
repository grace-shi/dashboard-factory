<template lang="pug">
el-container.home
  el-header.header(style="display: flex; justify-content: space-between;")
    .area
      span.hd 区域活动观察室
      span.analysis Big Data Analysis Platform
    .menu-container
     .main-nav(type="text", v-for="({ name, label, }, index) in menu", :key="name")
        .spacer(v-if="index!==0")
        router-link.link(:class="name === type ? 'is-active' : ''", :to="{ name: 'Home', params: { type: name } }" ) {{ label }}
  Dashboard(:config="dashboardConfig")
</template>

<script>

import Dashboard from '@/components/Dashboard'
import menu from '@/constant/menu'

export default {
  name: 'Home',
  props: {
    dashboardConfig: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      menu
    }
  },
  components: {
    Dashboard
  },
  computed: {
    type () {
      return this.$route.params.type || 'staff'
    }
  }
}
</script>
<style>
.home {
  padding: 0 60px;
}
.header {
  height: 160px !important;
  background-color: transparent;
  padding-left: 0 !important;
  padding-right: 0 !important;
}
.area {
 display: flex;
 flex-direction: column;
}
.hd {
  font-size: 64px;
  font-family: YouSheBiaoTiHei;
  background: linear-gradient(180deg, #FFFFFF 16.43%, #0E9AFF 100%);
  background-clip:text;
  -webkit-text-fill-color:transparent;
  margin-left: 0;
  margin-top: 30px;
  transform: skew(-6deg);
}
.analysis {
  color:rgba(133, 196, 255, 0.8);
  font-size:20px;
  transform: skew(-6deg);
  margin-left: -151px;
}
.main-nav {
  height: 36px;
  display: flex;
}

.main-nav :first-child {
  border-left: none;
}
.spacer {
  width: 2px;
  height: 29px;
  background: rgba(255, 255, 255, 0.8);
  margin-top: -3px;
  color:transparent;
  margin: 3px 16px 0;
}
.main-nav .link {
  font-family: YouSheBiaoTiHei;
  display: block;
  width: 100%;
  font-size: 28px;
  line-height: 35px;
  font-weight: 400;
  transform: skew(-10deg);
  text-decoration: none;
  color: #E0E8EF;
}
.main-nav .link:hover {
  color: #4DBEF5;
}

.main-nav .is-active {
  color: #4DBEF5;
}

.lastfood {
 background-color: red;
}
.menu-container {
  z-index: 1;
  display: flex;
  align-items: center;
}
</style>
