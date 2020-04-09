// 云函数入口文件
const cloud = require('wx-server-sdk')
// 引入
const TcbRouter = require('tcb-router')
const rp = require('request-promise')
const BASE_URL='http://musicapi.xiecheng.live'

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  // 实例化
  const app = new TcbRouter({event})
  app.router('playlist',async(ctx,next)=>{
    ctx.body= await cloud.database().collection("playlist")
      .skip(event.start)
      .limit(event.count)
      .orderBy('createTime', 'desc')
      .get()
      .then((res) => {
        return res
      })

  })
  // 歌曲列表
  app.router('musiclist',async(ctx,next)=>{
   ctx.body=await rp(BASE_URL+'/playlist/detail?id='+parseInt(event.playlistId)).then((res)=>{
      return JSON.parse(res)
    })
  })
  // 歌曲
  app.router('musicUrl',async(ctx,next)=>{
 ctx.body=await rp(BASE_URL+`/song/url?id=${event.musicId}`).then((res)=>{
      return res
    })
  })
  // 歌词
  app.router('lyric',async(ctx,next)=>{
 ctx.body= await rp(BASE_URL+`/lyric?id=${event.musicId}`).then((res)=>{
      return res
    })
  })

  // 一句话必须有没有router不能用
 return app.serve()
}