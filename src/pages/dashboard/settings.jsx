import React, { Component } from 'react'
import {
  Layout
} from 'antd';
import Profile from './settingsform/profile'
import Password from './settingsform/password'
const { Content } = Layout;

export default class Settings extends Component {
  render() {
    return (
      <div className="dashboard-main-content">
        <Content
          className="site-layout-background holder">
          <h2>Setting</h2>
          <Profile logoutUser={this.props.logoutUser} user={this.props.user} updateUser={this.props.updateUser} />
          <Password logoutUser={this.props.logoutUser} user={this.props.user} />
        </Content>
      </div>
    )
  }
}
