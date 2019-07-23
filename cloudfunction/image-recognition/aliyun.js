const axios = require('axios')
const formatOptions = require('./formatOptions')

module.exports = async base64 => {
  const { data } = await axios(
    formatOptions({
      url: 'https://dtplus-cn-shanghai.data.aliyuncs.com/image/tag',
      method: 'POST',
      data: JSON.stringify({
        type: 1,
        content: base64
      }),
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        date: new Date().toUTCString()
      }
    })
  )
  return {
    data: data.tags.map(({ value, confidence }) => ({
      keyword: value,
      confidence
    }))
  }
}
