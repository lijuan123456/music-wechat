// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const rp=require('request-promise')
const URL ='http://musicapi.xiecheng.live/personalized'

// 云函数入口函数
exports.main = async (event, context) => {
const getplay=await rp(URL).then((res)=>{
  return res
})
  console.log(getplay)
}
