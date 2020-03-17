import React, { Component } from 'react'
import { Form, Input, Button, notification, Alert } from 'antd';
import api from '../../config/api'
import axios from 'axios'
import jwt from 'jsonwebtoken';
import appDetails from '../../appdetails.json'
import setAuthorizationToken from '../../core/auth';
import './loginform.scss'
const FormItem = Form.Item;
const openNotificationWithIcon = (type, msg, desc) => {
  notification[type]({
    message: msg,
    description: desc
  })
}


export default class LoginForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      error: null
    }
  }

  onFinish = values => {
    const { email, password } = values
    this.setState({
      error: null,
      loading: true
    })
    axios.post(`${api}/api/signin`, {
      email,
      password,
    }).then((res) => {
      this.setState({
        loading: false
      })
      const decodeData = jwt.verify(res.data.token, appDetails.jwtSecret)
      this.props.loginUser(decodeData)
      setAuthorizationToken(res.data.token)
      openNotificationWithIcon('success', 'User  Authenticated!', res.data.message)
      this.props.history.push('/dashboard')
    }).catch((err) => {
      this.setState({
        error: err.response.data.err,
        loading: false
      })
    })
  }

  onFinishFailed = errorInfo => {
    this.setState({
      loading: false,
      error: null
    })
  };

  gateway = (e) => {
    e.preventDefault()
    this.props.toggleGateway()
  }

  render() {
    const { loading, error } = this.state

    return (
      <div className="login">
        <h2>Login</h2>
        {
          error ? <div className="error-holder">
            <Alert message={`Error: ${error}`} type="error" />
          </div> : null
        }
        <Form
          onFinish={this.onFinish}
          onFinishFailed={this.onFinishFailed}
          size="large"
          className="login-form">
          <FormItem
            name="email"
            rules={[
              {
                required: true,
                message: 'Please input your email'
              },
              {
                type: 'email',
                message: 'The input is not valid email'
              }
            ]}
          >
            <Input
              placeholder="Email Address"
            />
          </FormItem>
          <FormItem
            name="password"
            rules={[
              {
                required: true,
                message: 'Please input your password'
              }
            ]}
          >
            <Input.Password
              placeholder="Password"
            />
          </FormItem>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block className="login-btn">
              LOGIN
          </Button>
          </Form.Item>
        </Form>
        <div className="login-action">
          <p>Don't have an account? <a href="#" onClick={(e) => this.gateway(e)}>Sign Up</a> </p>
        </div>
      </div>
    )
  }
}


