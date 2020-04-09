// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext()
  const result = await cloud.openapi.templateMessage.send({

    touser: 'OPENID',
    page: `/page/blog-comment/blog-comment?blogId=${event.blogId}`,
    data: {
      phrase1: {
        value: '评价完成'
      },
      thing2: {
        value: event.content
      }
    },
    templateId: 'yfrYTkn9y1FsSBKp5tputimgsl-IEzvtkP3oMsqo4a4',
    formId: event.formId,

  })

  return result
}



