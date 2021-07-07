import pie from './pie'
import line from './line'
import bar from './bar'
import bas from './bas'
import bars from './bars'
import radar from './radar'
import bubble from './bubble'
import lbar from './lbar'
import hdbar from './hdbar'
import dount from './dount'
import copie from './copie'

export const CHART_CONFIG_DICT = {
  pie,
  line,
  bar,
  bas,
  bars,
  radar,
  bubble,
  lbar,
  hdbar,
  dount,
  copie
}

export const getChartConfig = (type, data, chartConfig = {}, query = {}) => {
  return CHART_CONFIG_DICT[type](data, chartConfig, query)
}
