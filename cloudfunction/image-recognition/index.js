// 云函数入口文件
const cloud = require('wx-server-sdk')
const baiduImage = require('./baidu-image')
const aliyunImage = require('./aliyun-image')

cloud.init()

let i = 0

// 云函数入口函数
exports.main = async (event, context) => {
  if (!event.base64) throw new Error('没有有效的图片资源')

  const wxContext = cloud.getWXContext()
  if (!wxContext.OPENID) throw new Error('非法调用')

  i++
  if (i > 100000) i = 0
  // 分流请求
  if (i % 2 == 0) {
    return baiduImage(event.base64)
  } else {
    return aliyunImage(event.base64)
  }
}
