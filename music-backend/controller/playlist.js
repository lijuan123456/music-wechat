const Router = require('koa-router')
const router = new Router()
const callCloudFn = require('../utils/callCloudFn')
// const ENV='test-lhq1m'
// const rp=require('request-promise')
const callCloudDB = require('../utils/callCloudDB.js')
// post 


// get 请求取数据 
router.get('/list', async (ctx, next) => {
	const query = ctx.request.query
	const res = await callCloudFn(ctx, 'music', {
		$url: 'playlist',
		start: parseInt(query.start),
		count: parseInt(query.count)
	})
	let data = []
	if (res.resp_data) {
		data = JSON.parse(res.resp_data).data
	}
	ctx.body = {
		data,
		code: 20000,
	}
})


router.get('/getById', async(ctx, next)=>{
    const query = `db.collection('playlist').doc('${ctx.request.query.id}').get()`
    const res = await callCloudDB(ctx, 'databasequery', query)
    ctx.body = {
        code: 20000,
        data: JSON.parse(res.data)
    }
})
// 编辑
router.post('/updatePlaylist', async(ctx, next)=>{
    const params = ctx.request.body
    const query = `
        db.collection('playlist').doc('${params._id}').update({
            data: {
                name: '${params.name}',
                copywriter: '${params.copywriter}'
            }
        })
    `
    const res = await callCloudDB(ctx, 'databaseupdate', query)
    ctx.body = {
        code: 20000,
        data: res
    }
})
// 删除

router.get('/del', async(ctx, next)=>{
    const params = ctx.request.query
    const query = `db.collection('playlist').doc('${params.id}').remove()`
    const res = await callCloudDB(ctx, 'databasedelete', query)
    ctx.body = {
        code: 20000,
        data: res
    }
})
// 导出

module.exports = router
