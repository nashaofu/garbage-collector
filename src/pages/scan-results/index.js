import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtActivityIndicator, AtTabs, AtTabsPane } from 'taro-ui'
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
    navigationBarTitleText: '扫描结果'
  }

  state = {
    loading: false,
    current: 0,
    tags: []
  }

  componentWillMount() {
    const { filePath } = this.$router.params
    Taro.uploadFile({
      url: 'http://192.168.199.201:3000/image',
      filePath: filePath,
      name: 'file'
    })
      .then(({ data }) => {
        this.setState({ loading: false, tags: JSON.parse(data).tags })
      })
      .catch(() => {
        this.setState({ loading: false })
        Taro.atMessage({
          message: '图像识别失败',
          type: 'error'
        })
      })
  }

  tabClick = current => {
    this.setState({ current })
  }

  render() {
    return (
      <View className='scan-results'>
        {this.state.loading && <AtActivityIndicator mode='center' content='加载中...' />}
        <AtTabs
          current={this.state.current}
          scroll
          tabList={this.state.tags.map(tag => ({ title: tag.value }))}
          onClick={this.tabClick}
        >
          {this.state.tags.map((tag, index) => {
            return (
              <AtTabsPane key={index} current={this.state.current} index={index}>
                <View>{tag.value}</View>
              </AtTabsPane>
            )
          })}
        </AtTabs>
      </View>
    )
  }
}
