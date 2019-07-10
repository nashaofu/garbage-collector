import { WebView } from '@tarojs/components'
import Taro, { Component } from '@tarojs/taro'
import './index.scss'

export default class DiscernResult extends Component {
  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config = {
    navigationBarTitleText: '识别结果'
  }

  state = {
    search: ''
  }

  componentWillMount() {
    const { search } = this.$router.params
    this.setState({ search })
  }

  componentDidHide() {
    this.setState({ search: '' })
  }

  render() {
    const url = `http://trash.lhsr.cn/sites/feiguan/trashTypes_2/TrashQuery_h5.aspx?kw=${encodeURI(this.state.search)}`

    if (!this.state.search) return null
    return <WebView className='discern-result' src={url} />
  }
}
