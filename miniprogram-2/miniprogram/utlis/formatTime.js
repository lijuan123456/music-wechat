module.exports=(date)=>{

let fmt='yyyy-MM-dd hh:mm:ss'
const o={
  'M+':date.getMonth()+1,//月
  'd+':date.getDate(),//日
  'h+':date.getHours(),//小时
  'm+':date.getMinutes(),//分
  's+':date.getSeconds(),//秒
}
if(/(y+)/.test(fmt)){
  // 正则中第一个 匹配成年
  fmt=fmt.replace(RegExp.$1, date.getFullYear())
}
// 遍历对象/(m+)/
for(let k in o){
    if(new RegExp('('+k+')').test(fmt)){
    fmt=fmt.replace(RegExp.$1, o[k].toString().length == 1 ? '0' + o[k] : o[k])
    }
}
// console.log(fmt)
return fmt
}
