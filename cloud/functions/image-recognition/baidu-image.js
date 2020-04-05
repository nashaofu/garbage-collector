const { imageClassify } = require('baidu-aip-sdk')
const { BAIDU_APP_ID, BAIDU_API_KEY, BAIDU_SECRET_KEY } = require('./env')

const client = new imageClassify(BAIDU_APP_ID, BAIDU_API_KEY, BAIDU_SECRET_KEY)

// 云函数入口函数
module.exports = async base64 => {
  const { result } = await client.advancedGeneral(base64)

  return {
    data: result.map(({ keyword, score }) => ({
      keyword,
      confidence: Math.round(score * 100)
    }))
  }
}
