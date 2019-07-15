const { URL } = require('url')
const crypto = require('crypto')

// 这里填写AK和请求
function md5(buffer) {
  const hash = crypto.createHash('md5')
  hash.update(buffer)
  return hash.digest('base64')
}

function sha1(stringToSign, secret) {
  return crypto
    .createHmac('sha1', secret)
    .update(stringToSign)
    .digest()
    .toString('base64')
}

module.exports = function formatOptions({ headers, ...options }) {
  const stringToSign = [
    options.method,
    headers.accept,
    md5(Buffer.from(options.data, 'utf8')),
    headers['content-type'],
    headers.date,
    new URL(options.url).pathname
  ].join('\n')

  return {
    ...options,
    headers: {
      ...headers,
      Authorization: `Dataplus ${process.env.AccessKeyId}:${sha1(stringToSign, process.env.AccessKeySecret)}`
    }
  }
}
