import classnames from 'classnames'
import { View, Image } from '@tarojs/components'
import Taro, { Component } from '@tarojs/taro'
import { AtCard, AtButton, AtActionSheet, AtActionSheetItem, AtActivityIndicator, AtMessage } from 'taro-ui'
import Sorry from '../../components/sorry'
import typesTitle from '../../types/title'
import typesImage from '../../types/image'
import typesDesc from '../../types/desc'
import requirement from '../../types/requirement'

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
    loading: true,
    loadingText: '正在查询分类信息...',
    search: '',
    type: null,
    isOpened: false,
    typesTitle,
    typesImage,
    typesDesc,
    requirement,
    color: {
      0: 'discern-result-0',
      1: 'discern-result-1',
      2: 'discern-result-2',
      3: 'discern-result-3'
    }
  }

  componentWillMount() {
    const { search } = this.$router.params
    if (!search) return Taro.navigateBack({ delta: 1 })
    this.setState({ search })
    Taro.cloud
      .callFunction({
        name: 'search',
        data: {
          search
        }
      })
      .then(({ result }) => {
        let type = null
        if (result.data) {
          // 获得分类值最大的类别作为最终的分类
          const key = Object.entries((result.data || {}).types).reduce((max, value) => {
            if (max[1] < value[1]) max = value
            return max
          })[0]
          type = parseInt(key)
        }

        this.setState({
          type,
          loading: false
        })
      })
      .catch(() => {
        this.setState({ loading: false })
        Taro.atMessage({
          message: '查询分类信息失败',
          type: 'error'
        })
      })
  }

  componentDidHide() {
    this.setState({
      loading: true,
      loadingText: '正在查询分类信息...',
      search: '',
      type: null
    })
  }

  openActionSheet = () => {
    this.setState({ isOpened: true })
  }

  closeActionSheet = () => {
    this.setState({ isOpened: false })
  }

  selectType = type => {
    this.setState({
      isOpened: false,
      loading: true,
      loadingText: '正在设置分类信息...'
    })
    Taro.cloud
      .callFunction({
        name: 'classification',
        data: {
          type,
          name: this.state.search
        }
      })
      .then(() => {
        this.setState({
          type,
          loading: false,
          loadingText: '正在查询分类信息...'
        })
      })
      .catch(() => {
        Taro.atMessage({
          message: '设置分类信息失败',
          type: 'error'
        })
        this.setState({
          loading: false,
          loadingText: '正在查询分类信息...'
        })
      })
  }

  render() {
    const {
      color,
      loading,
      loadingText,
      search,
      type,
      typesTitle,
      typesImage,
      typesDesc,
      isOpened,
      requirement
    } = this.state

    const requirements = requirement[type] || []

    return (
      <View className={classnames('discern-result', color[type])}>
        <AtCard className="discern-result-card" title={search} extra={typesTitle[type]} note="垃圾分类，关爱环境！">
          {type != null && (
            <View className="at-article">
              <Image className="discern-result-image" src={typesImage[type]} />
              <View className="discern-result-content at-article">
                <View className="discern-result-desc at-article__p">{typesDesc[type]}</View>
                <View className="discern-result-title">{typesTitle[type]}投放要求</View>
                <View className="discern-result-list">
                  {requirements.map((text, index) => {
                    return (
                      <View className="discern-result-list-item" key={index}>
                        {text}
                      </View>
                    )
                  })}
                </View>
                <AtButton className="discern-result-button" loading={loading} onClick={this.openActionSheet}>
                  分类信息错误，修改分类
                </AtButton>
              </View>
            </View>
          )}
          {type == null && (
            <View>
              <Sorry>没有匹配到分类信息</Sorry>
              <AtButton className="discern-result-button" loading={loading} onClick={this.openActionSheet}>
                手动选择分类
              </AtButton>
            </View>
          )}
          <AtActionSheet isOpened={isOpened} title="请选择分类" cancelText="取消" onClose={this.closeActionSheet}>
            {Object.keys(typesTitle).map(key => {
              return (
                <AtActionSheetItem key={key} onClick={() => this.selectType(parseInt(key))}>
                  {typesTitle[key]}
                </AtActionSheetItem>
              )
            })}
          </AtActionSheet>
          {loading && (
            <View className="discern-result-lodaing">
              <AtActivityIndicator mode="center" size={36} content={loadingText} />
            </View>
          )}
        </AtCard>
        <AtMessage />
      </View>
    )
  }
}
