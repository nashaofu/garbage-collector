import React, { Component } from 'react'
import classnames from 'classnames'
import Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import typesTitle from '../../types/title'
import typesImage from '../../types/image'
import typesDesc from '../../types/desc'
import requirement from '../../types/requirement'

import './index.scss'

export default class TrashTypes extends Component {
  state = {
    typesTitle,
    typesImage,
    typesDesc,
    requirement,
    color: {
      0: 'trash-types-0',
      1: 'trash-types-1',
      2: 'trash-types-2',
      3: 'trash-types-3'
    }
  }

  componentDidMount() {
    const { type } = Taro.getCurrentInstance().router.params
    Taro.setNavigationBarTitle({
      title: this.state.typesTitle[type]
    })
  }

  render() {
    const { type } = Taro.getCurrentInstance().router.params
    const requirements = this.state.requirement[type] || []

    return (
      <View className={classnames('trash-types', this.state.color[type])}>
        <View className="at-article">
          <Image className="trash-types-image" src={this.state.typesImage[type]} />
          <View className="trash-types-content at-article__p">{this.state.typesDesc[type]}</View>
          <View className="trash-types-title">{this.state.typesTitle[type]}投放要求</View>
          <View className="trash-types-list">
            {requirements.map((text, index) => {
              return (
                <View className="trash-types-list-item" key={index}>
                  {text}
                </View>
              )
            })}
          </View>
        </View>
      </View>
    )
  }
}
