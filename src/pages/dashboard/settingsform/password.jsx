import React, { Component } from 'react'
import {
  Layout, Row, Col, notification, Alert, Form, Input, Button, Select,
  DatePicker
} from 'antd';
import api from '../../../config/api'
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

export default class Password extends Component {
  constructor(props) {
    super(props)
    this.formRef = React.createRef();
    this.state = {
      loading: false,
      error: null,
    }
  }

  onFinish = values => {
    const { password, newpassword } = values
    const { user } = this.props
    this.setState({
      error: null,
      loading: true
    })
    axios.post(`${api}/api/updatepassword`, {
      password,
      newpassword,
      email: user.email
    }).then((res) => {
      this.setState({
        loading: false
      })
      openNotificationWithIcon('success', 'Profile Updated!', res.data.message)
      this.formRef.current.resetFields()
    }).catch((err) => {
      if (err.response.data.err === 'Please login to continue') {
        openNotificationWithIcon('error', 'Authentication Denied!', 'Login to perform action!')
        this.props.logoutUser()
      } else {
        this.setState({
          error: err.response.data.err,
          loading: false
        })
      }
    })
  }

  onFinishFailed = errorInfo => {
    console.log(errorInfo)
    this.setState({
      loading: false,
      error: null
    })
  };

  render() {
    const { loading, error } = this.state
    const { user } = this.props
   return (
      <div>
        <h3>Change Password</h3>
        {
          error ? <div className="error-holder">
            <Alert message={`Error: ${error}`} type="error" />
          </div> : null
        }
        <Form
          onFinish={this.onFinish}
          onFinishFailed={this.onFinishFailed}
          size="large"
          ref={this.formRef}
          className="">
          <Row gutter={16}>
            <Col lg={12} sm={24} xs={24}>
              <FormItem
                name="password"
                rules={[
                  {
                    required: true,
                    message: 'This field is required'
                  }
                ]}
              >
                <Input.Password
                  placeholder="Old Paasword"
                />
              </FormItem>
            </Col>
            <Col lg={12} sm={24} xs={24}>
              <FormItem
                name="newpassword"
                rules={[
                  {
                    required: true,
                    message: 'This field is required'
                  }
                ]}
              >
                <Input.Password
                  placeholder="New Password"
                />
              </FormItem>
            </Col>
          </Row>
          
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} className="change-btn">
              change
              </Button>
          </Form.Item>
        </Form>
      </div>
    )
  }
}
