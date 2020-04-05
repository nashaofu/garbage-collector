import Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import sorry from './sorry.svg'
import './index.scss'

export default ({ icon = sorry, children = '没有结果' }) => {
  return (
    <View className="sorry">
      <Image className="sorry-icon" src={icon} />
      <View className="sorry-text">{children}</View>
    </View>
  )
}
