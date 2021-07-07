import KoaRouter from 'koa-router'
import Axios from 'axios'

const router = new KoaRouter()

export default router.all('/api/(.*)', async (ctx, next) => {
  const path = ctx.path
  const query = ctx.request.query
  await Axios.get(
    `https://yapi.linktimecloud.com/mock/212${path}`,
    {
      params: query
    }
  ).then(rsp => {
    console.log(`https://yapi.linktimecloud.com/mock/212${path}`)
    ctx.body = {
      status: '100000',
      data: rsp.data.data || {}
    }
  })
}) 