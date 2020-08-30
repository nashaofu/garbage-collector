import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { AtSearchBar, AtFab, AtIcon, AtGrid, AtDivider } from 'taro-ui'
import images from '../../types/image'
import banner from './banner.jpg'
import './index.scss'

export default class Home extends Component {
  state = {
    value: '',
    grid: Object.keys(images).map(key => ({
      image: images[key],
      type: key
    }))
  }

  componentDidHide() {
    this.setState({ value: '' })
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

  goTrashTypes = ({ type }) => {
    Taro.navigateTo({
      url: `/pages/trash-types/index?type=${type}`
    })
  }

  goScan = () => {
    Taro.navigateTo({
      url: '/pages/scan/index'
    })
  }

  render() {
    return (
      <View className="home">
        <View className="home-container">
          <View className="home-banner">
            <Image className="home-banner-image" src={banner} />
            <View className="home-banner-search">
              <AtSearchBar
                placeholder="你是什么垃圾呀"
                value={this.state.value}
                onChange={this.handleChange}
                onConfirm={this.handleSearch}
                onActionClick={this.handleSearch}
              />
            </View>
          </View>
          <AtGrid className="home-container-grid" onClick={this.goTrashTypes} columnNum={2} data={this.state.grid} />
          <View className="home-container-divider">
            <AtDivider content="没有更多了" fontColor="#619088" fontSize="24" />
          </View>
        </View>
        <View className="home-scan">
          <AtFab onClick={this.goScan}>
            <AtIcon value="camera" color="#fff" size="24" />
          </AtFab>
        </View>
      </View>
    )
  }
}
