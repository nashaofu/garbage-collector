import { AtFab, AtIcon } from 'taro-ui'
import Taro, { Component } from '@tarojs/taro'
import { View, Camera } from '@tarojs/components'
import './index.scss'

export default class Scan extends Component {
  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config = {
    navigationBarTitleText: '扫描物品'
  }

  state = {
    flash: 'off'
  }

  componentDidMount() {
    this.cameraContext = Taro.createCameraContext()
  }

  takePhoto = () => {
    this.cameraContext.takePhoto({
      quality: 'low',
      success: res => {
        console.log(res)
      }
    })
  }

  render() {
    return (
      <View className='scan'>
        <Camera className='scan-camera' device-position='back' flash={this.state.flash} binderror='error' />
        <View className='scan-take-photo'>
          <AtFab onClick={this.takePhoto}>
            <AtIcon value='camera' color='#fff' size='24' />
          </AtFab>
        </View>
      </View>
    )
  }
}
