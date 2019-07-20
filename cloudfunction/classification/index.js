// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  if (!event.name) throw new Error('必须输入物品名称')
  if (event.type < 0 || event.type > 3) throw new Error('物品分类错误')

  const wxContext = cloud.getWXContext()
  if (!wxContext.OPENID) throw new Error('非法调用')

  const collection = db.collection('garbage-collector')

  const { result } = await cloud.callFunction({
    name: 'search',
    data: {
      search: event.name
    }
  })

  if (result.data) {
    const types = {}
    types[event.type] = _.inc(1)
    const { stats } = await collection.doc(result.data._id).update({
      data: {
        types
      }
    })
    if (stats.updated < 1) throw new Error('更新失败')
    return {
      data: await collection.doc(result.data._id).get()
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
        createTime: new Date()
      }
    })
    return {
      data: await collection.doc(_id).get()
    }
  }
}
