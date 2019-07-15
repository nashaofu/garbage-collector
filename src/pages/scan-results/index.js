import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtActivityIndicator, AtTag, AtSearchBar } from 'taro-ui'
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
    tags: [],
    value: ''
  }

  componentWillMount() {
    const { filePath } = this.$router.params
    Taro.getFileSystemManager().readFile({
      filePath, // 选择图片返回的相对路径
      encoding: 'base64', // 编码格式
      success: ({ data }) => {
        //成功的回调
        Taro.cloud
          .callFunction({
            name: 'aliyun-image',
            data: {
              base64: data
            }
          })
          .then(({ tags }) => {
            this.setState({ loading: false, tags })
          })
          .catch(() => {
            this.setState({ loading: false })
            Taro.atMessage({
              message: '图像识别失败',
              type: 'error'
            })
          })
      }
    })
  }

  tagClick = ({ name }) => {
    this.setState({ value: '' })
    Taro.navigateTo({
      url: `/pages/discern-result/index?search=${name}`
    })
  }

  handleChange = value => {
    this.setState({ value })
  }

  handleSearch = () => {
    Taro.navigateTo({
      url: `/pages/discern-result/index?search=${this.state.value}`
    })
    this.setState({ active: '' })
  }

  render() {
    return (
      <View className='scan-results'>
        {this.state.loading && <AtActivityIndicator mode='center' content='加载中...' />}
        <View className='scan-results-tags'>
          {this.state.tags.map((tag, index) => {
            return (
              <AtTag circle key={index} type='primary' name={tag.value} onClick={this.tagClick}>
                {tag.value}
              </AtTag>
            )
          })}
        </View>
        <AtSearchBar
          placeholder='没有找到，试试手动搜索！'
          value={this.state.value}
          onChange={this.handleChange}
          onConfirm={this.handleSearch}
          onActionClick={this.handleSearch}
        />
      </View>
    )
  }
}
