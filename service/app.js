import koa from 'koa'
import KoaBody from 'koa-body'
const logger = require('koa-logger')()
const cors = require('@koa/cors')()
import APIRoute from './routes/api'
import ConfigRoute from './routes/config'

const app = new koa()

app
  .use(async (ctx, next) => {
    try {
      await next()
    } catch (e) {
      console.log(e)
      ctx.body = e
    }
  })
  .use(logger)
  .use(cors)
  .use(KoaBody({
    multipart: true,
    parsedMethods: ['POST', 'PUT', 'PATCH', 'GET', 'HEAD', 'DELETE'],
    jsonLimit: '10mb',
    formLimit: '10mb',
    textLimit: '10mb'
  }))
  .use(ConfigRoute.routes())
  .use(APIRoute.routes())

app.listen(8888)
export default app