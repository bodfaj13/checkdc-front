import React, { Component } from 'react'
import {
  Layout, Row, Col, notification, Alert, Form, Input, Button, Select,
  DatePicker, message
} from 'antd';
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


export default class AddPrescription extends Component {
  constructor(props) {
    super(props)
    this.formRef = React.createRef();
    this.state = {
      loading: false,
      error: null,
      intervals: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24]
    }
  }

  addIntervalToTime = (time, interval) => {
    var mainFormat = moment(time)
    var add = mainFormat.add(interval, 'hours')
    var final = moment(add).format()
    return final
  }


  onFinish = values => {
    const { name, brandname, interval, formula, startTime, desc } = values
    const { user } = this.props
    this.setState({
      error: null,
      loading: true
    })
    axios.post(`${api}/api/createprescription`, {
      createdBy: user._id,
      desc,
      formula,
      interval,
      name,
      brandname,
      startTime: moment(startTime._d).format(),
      nextReminder: this.addIntervalToTime(startTime._d, interval)
    }).then((res) => {
      this.setState({
        loading: false
      })
      this.formRef.current.resetFields()
      openNotificationWithIcon('success', 'Prescription added!', res.data.message)
      this.props.refreashGetPrescriptions()
    }).catch((err) => {
      if (err.message === 'Network Error') {
        message.error("Error: Network Error")
        this.setState({
          error: null,
          loading: false
        })
      } else {
        if (err.response.data.err === 'Please login to continue') {
          openNotificationWithIcon('error', 'Authentication Denied!', 'Login to perform action!')
          this.props.logoutUser()
        } else {
          this.setState({
            error: err.response.data.err,
            loading: false
          })
        }
      }
    })
  }

  onFinishFailed = errorInfo => {
    this.setState({
      loading: false,
      error: null
    })
  };

  render() {
    const { loading, error, intervals } = this.state

    return (
      <div className="dashboard-main-content">
        <Content
          className="site-layout-background holder"
        >
          <h2>Add Prescription</h2>
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
              <Col lg={8} sm={24} xs={24}>
                <FormItem
                  name="name"
                  rules={[
                    {
                      required: true,
                      message: 'This field is required'
                    }
                  ]}
                >
                  <Input
                    placeholder="Product Name"
                  />
                </FormItem>
              </Col>
              <Col lg={8} sm={24} xs={24}>
                <FormItem
                  name="brandname"
                  rules={[
                    {
                      required: true,
                      message: 'This field is required'
                    }
                  ]}
                >
                  <Input
                    placeholder="Product Brand"
                  />
                </FormItem>
              </Col>
              <Col lg={8} sm={24} xs={24}>
                <Form.Item
                  name="interval"
                  rules={[{ required: true, message: 'This field is required' }]}
                >
                  <Select placeholder="Usage Interval">
                    {
                      intervals.map((index) => (
                        <Option value={index} key={index}>Every {index} Hour{index > 1 ? `s` : null}</Option>
                      ))
                    }
                  </Select>
                </Form.Item>
              </Col>
              <Col lg={16} sm={24} xs={24}>
                <Form.Item
                  name="formula"
                  rules={[{ required: true, message: 'This field is required' }]}
                >
                  <Input
                    placeholder="Prescription Formula / Dosage"
                  />
                </Form.Item>
              </Col>
              <Col lg={8} sm={24} xs={24}>
                <Form.Item
                  name="startTime"
                  rules={[{ required: true, message: 'This field is required' }]}
                >
                  <DatePicker showTime placeholder="Slect Start Date" />
                </Form.Item>
              </Col>
            </Row>
            <FormItem
              name="desc"
              rules={[
                {
                  required: true,
                  message: 'This field is required'
                }
              ]}
            >
              <TextArea rows={4} placeholder="Note" />
            </FormItem>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} className="login-btn">
                ADD
              </Button>
            </Form.Item>
          </Form>
        </Content>
      </div>
    )
  }
}
