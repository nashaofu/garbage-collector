// 云函数入口文件
const request = require('./request')
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {

  console.log(event)
  const { data } = await request(event.base64)

  return data
}
