// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

const result= await cloud.openapi.wxacode.getUnlimited({
 
   scene: wxContext.OPENID,
  //  修改小程序码样式
//   lineColor:{
//  'r':211,
//  'g':60,
//  'b':57
//   },
  // isHyaline:true
  //  page:''
 })
  // result返回时个二进制的数据
const upload= await cloud.uploadFile({
    cloudPath:'qrcode/'+Date.now()+'-'+Math.random()+'.png',
    fileContent:result.buffer
  })
  return upload.fileID
}