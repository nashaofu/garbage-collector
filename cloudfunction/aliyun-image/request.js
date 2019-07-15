const axios = require('axios')
const formatOptions = require('./formatOptions')

module.exports = content =>
  axios(
    formatOptions({
      url: 'https://dtplus-cn-shanghai.data.aliyuncs.com/image/tag',
      method: 'POST',
      data: JSON.stringify({
        type: 1,
        content
      }),
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        date: new Date().toUTCString()
      }
    })
  )
