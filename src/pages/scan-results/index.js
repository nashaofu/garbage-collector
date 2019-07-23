import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtActivityIndicator, AtTag, AtSearchBar, AtMessage } from 'taro-ui'
import Sorry from '../../components/sorry'
import './index.scss'

export default class ScanResults extends Component {
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
    loading: true,
    tags: [],
    value: ''
  }

  componentWillMount() {
    const { filePath } = this.$router.params
    if (!filePath) return Taro.navigateBack({ delta: 1 })

    Taro.getFileSystemManager().readFile({
      filePath, // 选择图片返回的相对路径
      encoding: 'base64', // 编码格式
      success: ({ data }) => {
        // 按条件不同分发到不同服务
        Taro.cloud
          .callFunction({
            name: 'image-recognition',
            data: {
              base64: data
            }
          })
          .then(({ result }) => {
            this.setState({ loading: false, tags: result.data.tags })
          })
          .catch(() => {
            this.setState({ loading: false })
            Taro.atMessage({
              message: '图像识别失败',
              type: 'error'
            })
          })
      },
      fail: () => {
        this.setState({ loading: false })
        Taro.atMessage({
          message: '获取图片失败',
          type: 'error'
        })
      }
    })
  }

  componentDidHide() {
    this.setState({ loading: false, value: '' })
  }

  tagClick = ({ name }) => {
    if (!name) return
    this.setState({ value: '' })
    Taro.navigateTo({
      url: `/pages/discern-result/index?search=${name}`
    })
  }

  handleChange = value => {
    this.setState({ value })
  }

  handleSearch = () => {
    if (!this.state.value) return
    Taro.navigateTo({
      url: `/pages/discern-result/index?search=${this.state.value}`
    })
  }

  render() {
    if (this.state.loading) {
      return (
        <View className="scan-results">
          {this.state.loading && <AtActivityIndicator mode="center" size={36} content="加载中..." />}
          <AtMessage />
        </View>
      )
    }

    return (
      <View className="scan-results">
        <View className="scan-results-tags">
          {this.state.tags.map((tag, index) => {
            return (
              <View key={index} className="scan-results-tags-item">
                <AtTag circle type="primary" name={tag.value} onClick={this.tagClick}>
                  {tag.value}
                </AtTag>
              </View>
            )
          })}
          {!this.state.tags.length && (
            <View className="scan-results-tags-empty">
              <Sorry>没有识别结果</Sorry>
            </View>
          )}
        </View>
        <AtSearchBar
          placeholder="试试手动搜索！"
          value={this.state.value}
          onChange={this.handleChange}
          onConfirm={this.handleSearch}
          onActionClick={this.handleSearch}
        />
        <AtMessage />
      </View>
    )
  }
}
