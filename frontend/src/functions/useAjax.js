import { ref, onMounted, reactive } from 'vue'
import { isFunction } from 'lodash'
import axios from 'axios'

export default ({
  method = 'get',
  url,
  params = {},
  body = {},
  adaptor = rsp => rsp.data,
  initialDataVal = []
}) => {
  const data = ref(initialDataVal)
  const loading = ref(false)

  const fetchData = () => {
    const instance = axios(method.toLowerCase() === 'get'
      ? {
        method,
        url,
        params
      }
      : {
        method,
        url,
        body
      })

    loading.value = true
    return instance
      .then(rsp => {
        if (rsp.status === 200) {
          const rspData = rsp.data
          data.value = isFunction(adaptor) ? adaptor(rspData) : rspData
        }
      })
      .catch(() => new Error('Request Failed'))
      .finally(() => {
        loading.value = false
      })
  }

  onMounted(fetchData)

  return { data, loading, query: reactive(params), fetchData }
}
