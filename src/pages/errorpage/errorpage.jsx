import React, { Component } from 'react'

import { Result, Button } from 'antd';
import './errorpage.scss'

export default class Errorpage extends Component {

  gotoHome = () => {
    this.props.history.push('/')
  }

  render() {
    return (
      <div className="errorpage">
        <div className="errorpage-main">
          <Result
            status="404"
            title="404"
            subTitle="Ops, We can't find the page you're looking for!"
            extra={<Button size="large" type="primary" onClick={() => this.gotoHome()}>Back Home</Button>}
          />
        </div>
      </div>
    )
  }
}
