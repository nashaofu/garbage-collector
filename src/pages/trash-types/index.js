import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import khsw from './khsw.jpg'
import yhlj from './yhlj.jpg'
import slj from './slj.jpg'
import glj from './glj.jpg'
import './index.scss'

export default class TrashTypes extends Component {
  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config = {
    navigationBarTitleText: ''
  }

  state = {
    types: {
      khsw: '可回收垃圾',
      yhlj: '有害垃圾',
      slj: '湿垃圾',
      glj: '干垃圾'
    },
    images: {
      khsw,
      yhlj,
      slj,
      glj
    }
  }

  componentWillMount() {
    const { type } = this.$router.params
    Taro.setNavigationBarTitle({
      title: this.state.types[type]
    })
    Taro.getImageInfo({
      src: this.state.images[type],
      success: res => {
        console.log(res)
      }
    })
  }

  render() {
    const { type } = this.$router.params
    return (
      <View className="trash-types">
        <Image className="trash-types-image" mode="widthFix" src={this.state.images[type]} />
      </View>
    )
  }
}
