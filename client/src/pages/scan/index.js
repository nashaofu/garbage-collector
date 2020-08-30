import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, Camera, CoverView, CoverImage } from '@tarojs/components'
import camera from './camera.png'
import './index.scss'

export default class Scan extends Component {
  state = {
    flash: 'off',
    visible: false
  }

  componentDidMount() {
    this.cameraContext = Taro.createCameraContext()
  }

  componentDidShow() {
    this.setState({ visible: true })
  }
  componentDidHide() {
    this.setState({ visible: false })
  }

  takePhoto = () => {
    if (this.state.loading) return
    this.cameraContext.takePhoto({
      quality: 'low',
      success: res => {
        Taro.navigateTo({
          url: `/pages/scan-results/index?filePath=${res.tempImagePath}`
        })
      }
    })
  }

  render() {
    if (!this.state.visible) return null
    return (
      <View className="scan">
        <Camera className="scan-camera" device-position="back" flash={this.state.flash} binderror="error">
          <CoverView className="scan-camera-area" />
          <CoverView className="scan-take-photo">
            <CoverView className="at-fab" hover-class="at-fab-hover" onClick={this.takePhoto} aria-role="button">
              <CoverView className="scan-take-photo-icon">
                <CoverImage src={camera} />
              </CoverView>
            </CoverView>
          </CoverView>
        </Camera>
      </View>
    )
  }
}
