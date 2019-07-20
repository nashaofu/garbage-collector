// 云函数入口文件
const axios = require('axios')
const cloud = require('wx-server-sdk')
const formatOptions = require('./formatOptions')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  if (!event.base64) throw new Error('没有有效的图片资源')

  const wxContext = cloud.getWXContext()
  if (!wxContext.OPENID) throw new Error('非法调用')

  const { data } = await axios(
    formatOptions({
      url: 'https://dtplus-cn-shanghai.data.aliyuncs.com/image/tag',
      method: 'POST',
      data: JSON.stringify({
        type: 1,
        content: event.base64
      }),
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        date: new Date().toUTCString()
      }
    })
  )
  return {
    data
  }
}
