import { View, Image } from '@tarojs/components'
import { AtInput, AtFab, AtIcon } from 'taro-ui'
import Taro, { Component, Config, CameraContext } from '@tarojs/taro'
import banner from './banner.jpg'
import './index.scss'

export default class Index extends Component {
  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '首页'
  }

  state = {
    value: ''
  }

  componentWillMount() {}

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  handleChange = value => {
    this.setState({ value })
  }

  handleSearch = () => {}

  takePhoto = () => {
    const cameraContext: CameraContext = Taro.createCameraContext()
    cameraContext.takePhoto({
      success() {
        console.log(arguments)
      }
    })
  }

  render() {
    return (
      <View className="home">
        <View className="home-banner">
          <Image className="home-banner-image" src={banner} />
          <View className="home-banner-search">
            <AtInput
              clear
              type="text"
              placeholder="你是什么垃圾呀"
              className="at-input--without-border"
              value={this.state.value}
              onChange={this.handleChange}
            >
              <View className="home-banner-search-button" onClick={this.handleSearch}>
                <AtIcon value="search" color="#000" size="20" />
              </View>
            </AtInput>
          </View>
        </View>

        <View className="home-take-photo">
          <AtFab onClick={this.takePhoto}>
            <AtIcon value="camera" color="#fff" size="24" />
          </AtFab>
        </View>
      </View>
    )
  }
}
