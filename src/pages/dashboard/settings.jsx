import React, { Component } from 'react'
import {
  Layout, Row, Col, notification, Alert, Form, Input, Button, Select,
  DatePicker
} from 'antd';
import Profile from './settingsform/profile'
import Password from './settingsform/password'
import api from '../../config/api'
import axios from 'axios'
import moment from 'moment';
const { Content } = Layout;
const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

const openNotificationWithIcon = (type, msg, desc) => {
  notification[type]({
    message: msg,
    description: desc
  })
}


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
