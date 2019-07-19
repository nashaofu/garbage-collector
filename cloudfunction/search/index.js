// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const collection = db.collection('garbage-collector-test')
  let { data } = await collection
    .where({
      name: _.eq(event.search)
    })
    .limit(1)
    .get()

  data = data[0]
  if (data) {
    // 获得分类值最大的类别作为最终的分类
    data.type = Object.entries(data.types).reduce((max, value) => {
      if (max[1] < value[1]) max = value
      return max
    })[0]
  }

  return {
    data
  }
}
