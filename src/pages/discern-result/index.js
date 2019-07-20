import { View, Image } from '@tarojs/components'
import Taro, { Component } from '@tarojs/taro'
import { AtCard, AtButton, AtActionSheet, AtActionSheetItem, AtActivityIndicator, AtMessage } from 'taro-ui'
import Sorry from '../../components/sorry'
import khsw from '../../images/khsw.jpg'
import yhlj from '../../images/yhlj.jpg'
import slj from '../../images/slj.jpg'
import glj from '../../images/glj.jpg'

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
    typesTitle: {
      0: '可回收物',
      1: '有害垃圾',
      2: '湿垃圾',
      3: '干垃圾'
    },
    typesImage: {
      0: khsw,
      1: yhlj,
      2: slj,
      3: glj
    },
    typesDesc: {
      0: '可回收物就是可以再生循环的垃圾。本身或材质可再利用的纸类、硬纸板、玻璃、塑料、金属、塑料包装，与这些材质有关的如：报纸、杂志、广告单及其它干净的纸类等皆可回收。',
      1: '有害垃圾指废电池、废灯管、废药品、废油漆及其容器等对人体健康或者自然环境造成直接或者潜在危害的生活废弃物。常见包括废电池、废荧光灯管、废灯泡、废水银温度计、废油漆桶、过期药品等。有害有毒垃圾需特殊正确的方法安全处理。',
      2: '湿垃圾又称为厨余垃圾、有机垃圾，即易腐垃圾，指食材废料、剩菜剩饭、过期食品、瓜皮果核、花卉绿植、中药药渣等易腐的生物质生活废弃物。湿垃圾是居民日常生活及食品加工、饮食服务、单位供餐等活动中产生的垃圾，包括丢弃不用的菜叶、剩菜、剩饭、果皮、蛋壳、茶渣、骨头、动物内脏、鱼鳞、树叶、杂草等，其主要来源为家庭厨房、餐厅、饭店、食堂、市场及其他与食品加工有关的行业。',
      3: '干垃圾即其它垃圾，指除可回收物、有害垃圾、厨余垃圾（湿垃圾）以外的其它生活废弃物。生活垃圾的具体分类标准可根据经济社会发展水平、生活垃圾特性和处置利用需要予以调整。其他垃圾危害较小，但无再次利用价值，如建筑垃圾类，生活垃圾类等，一般采取填埋、焚烧、卫生分解等方法，部分还可以使用生物解决，如放蚯蚓等。是可回收垃圾、厨余垃圾、有害垃圾剩余下来的一种垃圾。'
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
    const { loading, loadingText, search, type, typesTitle, typesImage, typesDesc, isOpened } = this.state

    return (
      <View className="discern-result">
        <AtCard className="discern-result-card" title={search} extra={typesTitle[type]} note="垃圾分类，人人有责！">
          {type != null && (
            <View>
              <Image className="discern-result-image" src={typesImage[type]} />
              <View className="discern-result-content at-article">
                <View className="at-article_h1">名称：{search}</View>
                <View className="at-article_h1">类别：{typesTitle[type]}</View>
                <View className="at-article__p">{typesDesc[type]}</View>
                <AtButton className="discern-result-button" onClick={this.openActionSheet}>
                  分类信息错误，修改分类
                </AtButton>
              </View>
            </View>
          )}
          {type == null && (
            <View>
              <Sorry>没有匹配到分类信息</Sorry>
              <AtButton className="discern-result-button" onClick={this.openActionSheet}>
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
