// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const collection = db.collection('garbage-collector-test')
  const { data } = await collection
    .where({
      name: db.command.eq(event.search)
    })
    .limit(1)
    .get()

  return {
    data: data[0]
  }
}
