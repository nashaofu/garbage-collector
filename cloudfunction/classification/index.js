// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  const collection = db.collection('garbage-collector-test')

  const { result } = await cloud.callFunction({
    name: 'search',
    data: {
      search: event.name
    }
  })

  if (result.data) {
    const types = {}
    types[event.type] = db.command.inc(1)
    const data = {
      types,
      updater: db.command.push(wxContext.OPENID),
      updateTime: new Date()
    }
    const { stats } = await collection
      .where({
        _id: db.command.eq(result.data._id)
      })
      .update({
        data
      })
    if (stats.updated > 0) {
      return {
        data: {
          ...result.data,
          ...data
        }
      }
    } else {
      throw new Error('没有更新')
    }
  } else {
    const types = {
      0: 0,
      1: 0,
      2: 0,
      3: 0
    }
    types[event.type] = 1
    const { _id } = await collection.add({
      // data 字段表示需新增的 JSON 数据
      data: {
        name: event.name,
        types,
        creator: wxContext.OPENID,
        createTime: new Date(),
        updater: [wxContext.OPENID],
        updateTime: new Date()
      }
    })
    return {
      data: await collection.doc(_id).get()
    }
  }
}
