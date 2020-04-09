const rp = require('request-promise')
const APPID = 'wx526986fe12fb518d'
const APPSECRET = 'c15ae9a9388b9af1c036c210dd5780f2'
const URL = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${APPID}&secret=${APPSECRET}`
const fs = require('fs')
const path = require('path')
// path.resolve() 方法会把一个路径或路径片段的序列解析为一个绝对路径。
// __dirname 总是指向被执行 js 文件的绝对路径
const fileName = path.resolve(__dirname, './access_token.json')

const updateAccessToken = async () => {
	// 发送请求
    const resStr = await rp(URL)
    const res = JSON.parse(resStr)
    // console.log(res)
    // 写文件
    if (res.access_token) {
		// fileName文件路径名称  第二个参数写入的值 
        fs.writeFileSync(fileName, JSON.stringify({
            access_token: res.access_token,
            createTime: new Date()
        }))
    } else {
        await updateAccessToken()
    }
}

const getAccessToken = async () => {
    // 读取文件
	// 第一个参数读取那个文件 要有第二个参数否则返回时二进制的数
	
    try {
        const readRes = fs.readFileSync(fileName, 'utf8')
		// 字符串转json
        const readObj = JSON.parse(readRes)
		 // 读取出的时间戳
        const createTime = new Date(readObj.createTime).getTime()
		// 当前时间戳
        const nowTime = new Date().getTime()
		// 判断有没有超过2个小时
        if ((nowTime - createTime) / 1000 / 60 / 60 >= 2) {
            await updateAccessToken()
            await getAccessToken()
        }
        return readObj.access_token 
    } catch (error) {
        await updateAccessToken()
        await getAccessToken()
    }
}

setInterval(async () => {
    await updateAccessToken()
}, (7200 - 300) * 1000)

// updateAccessToken()
// console.log(getAccessToken())
module.exports = getAccessToken
