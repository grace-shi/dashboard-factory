<script>
import JsonEditor from '@/components/JsonEditor'
import axios from 'axios'

export default {
  name: 'ConfigPanel',
  props: {
    type: String
  },
  data () {
    return {
      data: {},
      loading: false
    }
  },
  components: {
    JsonEditor
  },
  methods: {
    async fetchData (type) {
      this.loading = true
      const rsp = await axios.get(`/config/${type}`)
      this.loading = false
      this.data = rsp.data.data
    },
    onChange (value) {
      if (value instanceof Event) {
        return
      }
      this.data = value
      this.jsonError = null
    },
    onHasError (value) {
      this.jsonError = value
    }
  },
  watch: {
    type: {
      immediate: true,
      handler: function (val) {
        this.fetchData(val)
      }
    }
  }
}
</script>

<template lang="pug">
.config-panel(v-loading="loading")
  JsonEditor(
    :data="data",
    @jsonChange="onChange",
    @hasError="onHasError"
  )
  span(v-if="jsonError") {{ jsonError }}
  .d-flex.align-items-end.mt-2
    el-button(type="primary", @click="$emit('submit', data)") 提交
    el-button(type="danger", @click="$emit('reset')") 重置
</template>
