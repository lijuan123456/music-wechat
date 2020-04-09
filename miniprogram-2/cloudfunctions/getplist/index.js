// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
// 初始化
const db=cloud.database();
const rp = require('request-promise')
const URL = 'http://musicapi.xiecheng.live/personalized'
const playlistCollecton = db.collection('playlist')
const MAX_LIMIT=100

// 云函数入口函数
exports.main = async (event, context) => {
  // 取到集合里所有的数据（云函数做多能取出100条数据，小程序做多能取出20调数据）
  // 这里是歌单中已有的数据
  // const list = await playlistCollecton.get()
  // 突破100条数据限制 count获取中的条数反回的是对象
  const countResult= await playlistCollecton.count()
  // 总条数number
  const total = countResult.total
  // 需要取几次
  const batchTimes = Math.ceil(total / MAX_LIMIT) 
  const tasks=[]
  for (let i = 0; i < batchTimes;i++){
    // skip从第几条开始取 limit取100条
    // 使用limit()方法来读取指定数量的数据外，还可以使用skip()方法来跳过指定数量的数据。skip方法同样接受一个数字参数作为跳过的记录条数。
   let promise=playlistCollecton.skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
    tasks.push(promise)
  }
  let list={
    data:[]
  }
  // 计算数组元素相加后的总和reduce acc表示上一次调用回调时的返回值，或者初始值 init。 cur值为数组第一项，相加之后返回值作为下一轮回调的acc值，
  if (tasks.length>0){
  list= (await Promise.all(tasks)).reduce((acc, cur)=>{
      return{
        data:acc.data.concat(cur.data)
      }
    })
  }

  // 用promise的发送异步请求 这里是插入的数据
  const playlist = await rp(URL).then((res) => {
    return JSON.parse(res).result
  })
  // list和playlist数据去重复
  const newData=[]
for(let i=0,len1=playlist.length;i<len1;i++){
  let flag=true
  for (let j = 0, len2 = list.data.length; j < len2; j++){
    if (playlist[i].id === list.data[j].id){
      flag=false
      break
      }
 }
  if (flag) {
    newData.push(playlist[i])
  }
}



  for (let i = 0, len = newData.length;i<len;i++){
    // collection取到集合， 添加数据add
    await playlistCollecton.add({
      data:{
        // 插入每一条数据
        ...newData[i],
        // 插入当前时间服务器的时间
        createTime:db.serverDate(),

      }
    }).then((res)=>{
      console.log('插入成功')
    }).catch((err)=>{
      console.log('插入失败')
    })
 }
//  数据库长度
 return newData.length
}
