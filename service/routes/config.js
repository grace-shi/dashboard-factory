import fs from 'fs'
import path from 'path'
import KoaRouter from 'koa-router'

const router = new KoaRouter()

router.get('/api/config/:type', async (ctx, next) => {
  const { type } = ctx.request.params
  const data = fs.readFileSync(path.join('configs', `${type}.json`), 'utf8')
  ctx.body = {
    data: JSON.parse(data)
  }
})

router.put('/api/config/:type', async (ctx, next) => {
  const { params: { type }, body: { data } } = ctx.request
  fs.writeFileSync(path.join('configs', `${type}.json`), JSON.stringify(data, null, 2))
  ctx.body = {
    data: { status: 1 }
  }
})

router.post('/api/config/:type', async (ctx, next) => {
  const { params: { type } } = ctx.request
  fs.copyFileSync(path.join('configs', 'default', `${type}.json`), path.join('configs', `${type}.json`))
  ctx.body = {
    data: { status: 1 }
  }
})

export default router