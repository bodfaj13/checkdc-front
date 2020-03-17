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

export default class Profile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      error: null,
    }
  }

  onFinish = values => {
    const { fullname, email } = values
    this.setState({
      error: null,
      loading: true
    })
    axios.post(`${api}/api/updateprofile`, {
      fullname,
      email
    }).then((res) => {
      this.setState({
        loading: false
      })
      this.props.updateUser(res.data.data)
      openNotificationWithIcon('success', 'Profile Updated!', res.data.message)
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
        <h3>Profile Setting</h3>
        {
          error ? <div className="error-holder">
            <Alert message={`Error: ${error}`} type="error" />
          </div> : null
        }
        <Form
          onFinish={this.onFinish}
          onFinishFailed={this.onFinishFailed}
          size="large"
          initialValues={{
            fullname: user.fullname,
            email: user.email
          }}
          className="">
          <Row gutter={16}>
            <Col lg={12} sm={24} xs={24}>
              <FormItem
                name="fullname"
                rules={[
                  {
                    required: true,
                    message: 'This field is required'
                  }
                ]}
              >
                <Input
                  placeholder="Fullname"
                />
              </FormItem>
            </Col>
            <Col lg={12} sm={24} xs={24}>
              <FormItem
                name="email"
                rules={[
                  {
                    required: true,
                    message: 'This field is required'
                  },
                  {
                    type: 'email',
                    message: 'The input is not valid email'
                  }
                ]}
              >
                <Input
                  placeholder="Email"
                  disabled
                />
              </FormItem>
            </Col>
          </Row>
          
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} className="update-btn">
              Update
              </Button>
          </Form.Item>
        </Form>
      </div>
    )
  }
}
