import request from '@/utils/request'
const baseURL = 'http://localhost:3000'

export function fetchList(params){
    return request({
        params,
        url: `${baseURL}/playlist/list`,
        method: 'get'
    })
}
// 详情
export function fetchById(params){
  return request({
    params,
    url: `${baseURL}/playlist/getById`,
    method:'get',
  })
}
// 编辑
export function update(params){
  return request({
    data:{
      ...params
    },

    url:`${baseURL}/playlist/updatePlaylist`,
    method:'post',
  })
}
// 删除

export function del(params) {
    return request({
        params,
        url: `${baseURL}/playlist/del`,
        method: 'get',
    })
}
