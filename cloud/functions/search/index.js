// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  if (!event.search) throw new Error('物品名称不能为空')

  const collection = db.collection('garbage-collector')
  let { data } = await collection
    .where({
      name: _.eq(event.search)
    })
    .limit(1)
    .get()

  return {
    data: data[0]
  }
}
