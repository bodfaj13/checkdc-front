import React, { Component } from 'react'
import { Form, Input, Button, notification, Alert, message } from 'antd';
import api from '../../config/api'
import axios from 'axios'
// import jwt from 'jsonwebtoken';
// import appDetails from '../../appdetails.json'
import './signupform.scss'
const FormItem = Form.Item;
const openNotificationWithIcon = (type, msg, desc) => {
  notification[type]({
    message: msg,
    description: desc
  })
}


export default class SignupForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      error: null
    }
  }

  onFinish = values => {
    const { fullname, email, password } = values
    this.setState({
      error: null,
      loading: true
    })
    axios.post(`${api}/api/signup`, {
      fullname,
      email,
      password
    }).then((res) => {
      this.setState({
        loading: false
      })
      openNotificationWithIcon('success', 'User created', res.data.message)
      this.props.toggleGateway()
    }).catch((err) => {
      if(err.message === 'Network Error') {
        message.error("Error: Network Error")
        this.setState({
          error: null,
          loading: false
        })
      } else {
        this.setState({
          error: err.response.data.err,
          loading: false
        })
      }
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
      <div className="signup">
        <h2>Sign Up</h2>
        {
          error ? <div className="error-holder">
            <Alert message={`Error: ${error}`} type="error" />
          </div> : null
        }
        <Form
          onFinish={this.onFinish}
          onFinishFailed={this.onFinishFailed}
          size="large"
          className="signup-form">
          <FormItem
            name="fullname"
            rules={[
              {
                required: true,
                message: 'Please input your fullname'
              }
            ]}
          >
            <Input
              placeholder="Fullname"
            />
          </FormItem>
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
            <Button type="primary" htmlType="submit" loading={loading} block className="signup-btn">
              SIGN UP
          </Button>
          </Form.Item>
        </Form>
        <div className="signup-action">
          <p>Already have an account? <button onClick={(e) => this.gateway(e)}>Login</button> </p>
        </div>
      </div>
    )
  }
}


