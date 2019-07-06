import Taro, { Component } from '@tarojs/taro'
import { View, Camera, CoverView, CoverImage } from '@tarojs/components'
import camera from './camera.png'
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
      quality: 'normal',
      success: res => {
        Taro.uploadFile({
          url: 'http://127.0.0.1:3000/image',
          filePath: res.tempImagePath,
          name: 'file'
        }).then(data => {
          console.log(data)
        })
      }
    })
  }

  render() {
    return (
      <View className='scan'>
        <Camera className='scan-camera' device-position='back' flash={this.state.flash} binderror='error'>
          <CoverView className='scan-camera-area' />
          <CoverView className='scan-take-photo'>
            <CoverView className='at-fab' hover-class='at-fab-hover' onClick={this.takePhoto} aria-role='button'>
              <CoverView className='scan-take-photo-icon'>
                <CoverImage src={camera} />
              </CoverView>
            </CoverView>
          </CoverView>
        </Camera>
      </View>
    )
  }
}
