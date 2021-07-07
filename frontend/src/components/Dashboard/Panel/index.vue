<script>
import { ref, watch, reactive } from 'vue'
import { isEmpty, capitalize } from 'lodash'

import useAjax from '@/functions/useAjax'
import useChart from '@/functions/useChart'

import Tree from '../miscChart/tree'
import Table from '../miscChart/table'
import Timeline from '../miscChart/timeline'

import QueryBox from '../QueryBox'
import { CHART_CONFIG_DICT, getChartConfig } from '../chartConfig'

const echartTypes = Object.keys(CHART_CONFIG_DICT)

export default {
  name: 'Panel',
  props: {
    config: {
      type: Object,
      default: () => ({})
    }
  },
  setup (props) {
    const params = (props.config.properties || []).reduce((acc, property) => {
      acc[property.key] = ''
      return acc
    }, {})

    const chartId = echartTypes.includes(props.config.type)
      ? `chart-${props.config.id}`
      : ''

    if (!props.config.url) {
      return {
        query: reactive(params),
        loading: ref(false),
        chartId,
        data: ref([]),
        fetchData: () => {}
      }
    }

    const { fetchData, data, loading, query } = useAjax({
      url: props.config.url,
      params
    })

    const isAutoRefresh = props.config.auto === false ? props.config.auto : true
    if (!isEmpty(params) && isAutoRefresh) {
      watch(() => ({ ...query }), fetchData)
    }

    const result = { chartId, fetchData, data, loading, query }
    if (chartId) {
      const { setOptions, resize } = useChart({
        chartId
      })

      watch(data, val => {
        const options = getChartConfig(
          props.config.type,
          val,
          props.config.chartConfig || {},
          params
        )
        setOptions(options)
      }, { deep: true })
      watch(ref(chartId), () => {
        resize()
      })

      result.setOptions = setOptions
    }

    return result
  },
  components: {
    QueryBox,
    Tree,
    Table,
    Timeline
  },
  methods: {
    capitalize
  },
  computed: {
    hasTitle () {
      return this.config.title.trim()
    },
    cardStyle () {
      return {
        height: '100%'
      }
    },
    cardBodyCls () {
      return {
        'bg-dark': !this.config.transparent
      }
    },
    chartStyle () {
      const { properties = [] } = this.config

      if (isEmpty(properties)) {
        return {
          height: '100%'
        }
      }

      const totalSpan = properties.reduce((total, { span = 8 }) => total + span, 0)
      const numOfQueryBoxRows = Math.ceil(totalSpan / 24)
      const queryBoxHeight = numOfQueryBoxRows === 1 ? 33 : numOfQueryBoxRows * 33 + (numOfQueryBoxRows - 1) * 5
      return {
        height: `calc(100% - ${queryBoxHeight}px)`
      }
    }
  }
}
</script>

<template lang="pug">
.card.dashboard-panel(
  :class="config.cardCls === 'drive' ? 'linear-border' : ''",
  :style="cardStyle"
)
  .card-header(
    v-if="hasTitle",
    :class="config.cardCls || 'common'"
  )
    span.icon
    span.rank {{ config.title }}
    span.linear
  .card-body(
    v-if="!config.transparent || (config.properties || []).length > 0",
    :class="cardBodyCls"
  )
    .content-container(
      v-loading="loading",
      :class="config.cardCls ? 'no-border' : 'has-border'"
    )
      QueryBox(
        v-if="config.properties && query",
        :query="query",
        :properties="config.properties",
        :auto="config.auto === false ? false : true",
        @query="fetchData"
      )
      .chart-container(
        :id="chartId",
        :style="chartStyle"
      )
        component(
          v-if="!chartId",
          :data="data",
          :is="`${capitalize(config.type)}`",
          v-bind="config.chartOptions"
        )
</template>

<style lang="scss">
.card.dashboard-panel {
  z-index: 1;
  display: flex;
  flex-direction: column;

  .card-header {
    font-family: YouSheBiaoTiHei;
    font-weight: 400;
    font-size: 24px;
    z-index: 1;
    height: 42px;
    border: 1px solid #4DA1FF;
  }
  &.linear-border {
    border-radius: 4px;
    border-right: 2px solid;
    border-left: 2px solid;
    border-image: -webkit-linear-gradient(-180deg, rgba(255,255,255,0.00) 0%,#00BBF2 20%, rgba(255,255,255,0.00) 99%) 2 2 2 2;
    border-image: -moz-linear-gradient(-180deg, rgba(255,255,255,0.00) 0%,#00BBF2 20%, rgba(255,255,255,0.00) 99%) 2 2 2 2;
    border-image: linear-gradient(-180deg, rgba(255,255,255,0.00) 0%,#00BBF2 20%, rgba(255,255,255,0.00) 99%) 2 2 2 2;
    .card-header {
      border: none;
      border-bottom: 2px solid;
      border-image: -webkit-linear-gradient(90deg, rgba(255,255,255,0.00) 0%,#00BBF2 20%, rgba(255,255,255,0.00) 99%) 2 2 2 2;
      border-image: -moz-linear-gradient(90deg, rgba(255,255,255,0.00) 0%,#00BBF2 20%, rgba(255,255,255,0.00) 99%) 2 2 2 2;
      border-image: linear-gradient(90deg, rgba(255,255,255,0.00) 0%,#00BBF2 20%, rgba(255,255,255,0.00) 99%) 2 2 2 2;
    }
  }

  .drive {
    display:flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    background: #081A30;
    .rank {
      background-image: linear-gradient(270deg,#4DFFDF 0%,#4DA1FF 96.35%);
      -webkit-background-clip: text;
      color: transparent;
    }
    border-bottom: 2px solid;
    border-image: linear-gradient(90deg, rgba(0,216,247,0.00) 0%, #00AFED 100%) 2 2 2 2;
    border-image: -webkit-linear-gradient(90deg, rgba(0,216,247,0.00) 0%, #00AFED 100%) 2 2 2 2;
    border-image: -moz-linear-gradient(90deg, rgba(0,216,247,0.00) 0%, #00AFED 100%) 2 2 2 2;
  }
  .plain {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(7, 88, 196, 0.4);
    border: 0.5px solid #2384DD;
  }
  .common {
    display:flex;
    align-items: center;
    padding: 0 10px;
    text-align: left;
    background: linear-gradient(-45deg, rgba(65, 106, 255, 0.5) 0, rgba(65, 106, 255, 0.5) 25%, transparent 25%, transparent 50%, rgba(65, 106, 255, 0.5) 50%, rgba(65, 106, 255, 0.5) 75%, transparent 75%, transparent);
    background-size: 8px 8px;
    background-color: #062F68;
    .icon {
      display: inline-block;
      width: 21px;
      height: 21px;
      margin-right: 15px;
      background: linear-gradient(270deg, #4DFFDF 0%, #4DA1FF 96.35%);
    }
  }
  .card-body {
    z-index: 1;
    overflow-y: auto;
    &.bg-dark {
      background-color: #081A30;
    }
    flex-grow: 1;
    .content-container {
      padding: 10px;
      height: calc(100% - 25px);
      overflow-y: auto;
      &.has-border {
        border: 1px solid #2385DF;
      }
    }
  }
}

.no-border {
  border: none !important;
}
</style>
