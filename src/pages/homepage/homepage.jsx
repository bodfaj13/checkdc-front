import React, { Component } from 'react'
import { Card } from 'antd';
import LoginForm from '../../components/login/loginform'
import SignupForm from '../../components/signup/signupform'
import { connect } from 'react-redux'
import { loginUser } from '../../core/actions/userActions'
import './homepage.scss'

class Homepage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showLogin: true
    }
  }

  toggleGateway = () => {
    const { showLogin } = this.state 
    this.setState({
      showLogin: !showLogin
    })
  }

  render() {
    const { showLogin } = this.state
    return (
      <div className="homapage">
        <div className="homapage-main">
          <img src="/img/drug.svg" alt="" className="app-logo"/>
          <h2 className="app-name"> Prescription Reminder</h2>
          <Card className="gateway">
            {
              showLogin ? <LoginForm toggleGateway={this.toggleGateway} loginUser={this.props.loginUser} history={this.props.history}/> : <SignupForm toggleGateway={this.toggleGateway}/>
            }
          </Card>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  user: state.userReducer.user
})

export default connect(mapStateToProps, {
  loginUser
})(Homepage);