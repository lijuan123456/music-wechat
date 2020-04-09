import request from '@/utils/request'
const baseURL = 'http://localhost:3000'
// 获取列表
export function fetchList(){
  return request({
    url:`${baseURL}/swiper/list`,
    method:'get'
  })
}
// 删除
export function del(params) {
    return request({
        params,
        url: `${baseURL}/swiper/del`,
        method: 'get',
    })
}