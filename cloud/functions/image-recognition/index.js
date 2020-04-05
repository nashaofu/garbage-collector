// 云函数入口文件
const cloud = require('wx-server-sdk')
const baiduImage = require('./baidu-image')
const aliyunImage = require('./aliyun-image')
const { BAIDU_APP_ID, ALIYUN_ACCESS_KEY_ID } = require('./env')

cloud.init()

let i = 0

// 云函数入口函数
exports.main = async (event, context) => {
  if (!event.base64) throw new Error('没有有效的图片资源')

  const wxContext = cloud.getWXContext()
  if (!wxContext.OPENID) throw new Error('非法调用')

  if (BAIDU_APP_ID && ALIYUN_ACCESS_KEY_ID) {
    i++
    if (Number.MAX_SAFE_INTEGER <= i) i = 0
    // 分流请求
    if (i % 2 == 0) {
      return baiduImage(event.base64)
    } else {
      return aliyunImage(event.base64)
    }
  } else if (BAIDU_APP_ID && !ALIYUN_ACCESS_KEY_ID) {
    return baiduImage(event.base64)
  } else if (!BAIDU_APP_ID && ALIYUN_ACCESS_KEY_ID) {
    return aliyunImage(event.base64)
  } else {
    throw new Error('请至少支持百度图像识别、阿里云图像识别中的一种')
  }
}
