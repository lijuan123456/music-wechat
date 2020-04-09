// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
// 加载路由
const TcbRouter=require('tcb-router')
// 初始化
const db=cloud.database()
// 查询那个数据库
const blogCollection=db.collection('blog')
//每次查询条数
const MAX_LIMIT=100

// 云函数入口函数
exports.main = async (event,context) => {
  const app=new TcbRouter({
    event
  })
  app.router('list',async (ctx,next)=>{
    const keyword=event.keyword
    let w={}
    if (keyword.trim()!=''){
        w={
          // 模糊查询
          content:db.RegExp({
            // 传过来的值
            regexp: keyword,
            // 不区分大小写
            options:'i'
          })
        }
    }
    // orderBy排序 get才能取到值 skip从第几条查询 limit查多少条
    //为了增加查询效率用空间换时间 在云开发-》数据库-》索引管理 添加索引
   let blogList= await blogCollection.where(w).skip(event.start).limit(event.count)
    .orderBy('createTime','desc').get().then((res)=>{
      return res.data
    })
    ctx.body = blogList
  })
// 正文
  app.router('detail',async(ctx,next)=>{
    let blogId=event.blogId
    // 详情查询
    let detail= await blogCollection.where({
      _id: blogId

    }).get().then((res)=>{
      return res.data
    })
    // 评论表查询
    const countResult=await blogCollection.count()
    const total=countResult.total
    let commentList={
      data:[]
    }
    if(total>0){
      // 取几次 每次最多100条
      const batchTime = Math.ceil(total / MAX_LIMIT) 
      const tasks=[]
      for (let i = 0; i < batchTime;i++){
        // skip(i*MAX_LIMIT)每次从第几条开始取 limit(MAX_LIMIT)每次去几条  where更具博客ID查询
        let promise=db.collection('blog-comment').skip(i*MAX_LIMIT).limit(MAX_LIMIT).where({
          blogId:blogId
        }).orderBy('createTime','desc').get()
        // 把结果push进去
        tasks.push(promise)
      }
      if(tasks.length>0){
        // reduce()累加器
        commentList = (await Promise.all(tasks)).reduce((acc,cur)=>{
        return{
            data:acc.data.concat(cur.data)
        }
      })
      }
    }
    ctx.body={
      commentList,
      detail,
    }
  })
  //  我的发现
  const wxContext=cloud.getWXContext() //获取openID
  app.router('getListByOpenid',async(ctx,next)=>{
 ctx.body= await blogCollection.where({
       _openid:wxContext.OPENID
     }).skip(event.start).limit(event.count).orderBy('createTime','desc').get().then((res)=>{
       return res.data
     })
  })
  return app.serve()
}