// 云函数入口文件
const axios = require('axios')
const cloud = require('wx-server-sdk')
const formatOptions = require('./formatOptions')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
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
