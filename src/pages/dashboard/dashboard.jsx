import React, { Component } from 'react'
import { Layout, Menu, Breadcrumb, Row, Col, Card, notification, message } from 'antd';
import MenuUnfoldOutlined from '@ant-design/icons/MenuUnfoldOutlined';
import MenuFoldOutlined from '@ant-design/icons/MenuFoldOutlined';
import OrderedListOutlined from '@ant-design/icons/OrderedListOutlined';
import FileAddOutlined from '@ant-design/icons/FileAddOutlined';
import DashboardOutlined from '@ant-design/icons/DashboardOutlined';
import LogoutOutlined from '@ant-design/icons/LogoutOutlined';
import SettingOutlined from '@ant-design/icons/SettingOutlined';
import CalendarOutlined from '@ant-design/icons/CalendarOutlined';
import FolderOpenOutlined from '@ant-design/icons/FolderOpenOutlined';
import FileDoneOutlined from '@ant-design/icons/FileDoneOutlined';
import './dashboard.scss'
import AddPrescription from './addprescription';
import AllPrescriptions from './allprescriptions';
import AllReminders from './allreminders';
import Settings from './settings'
import { connect } from 'react-redux'
import { logoutUser, updateUser } from '../../core/actions/userActions'
import api from '../../config/api'
import axios from 'axios'
import jwt from 'jsonwebtoken';
import appDetails from '../../appdetails.json'
import setAuthorizationToken from '../../core/auth';
const { Header, Sider, Content, Footer } = Layout;
const openNotificationWithIcon = (type, msg, desc) => {
  notification[type]({
    message: msg,
    description: desc
  })
}

class Dashboard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      menuToggleIcon: false,
      collapsed: false,
      prescriptions: [],
      reminders: [],
      completedPrescriptions: [],
      pendingReminders: [],
      curentMenu: 1,
      menu: [
        {
          key: 1,
          icon: 'FileAddOutlined',
          name: 'Add Prescription',
          active: true
        },
        {
          key: 2,
          icon: 'OrderedListOutlined',
          name: 'All Prescriptions',
          active: false
        },
        {
          key: 3,
          icon: 'CalendarOutlined',
          name: 'All Reminders',
          active: false
        },
        {
          key: 4,
          icon: 'SettingOutlined',
          name: 'Settings',
          active: false
        }
      ]
    }
  }

  componentDidMount() {
    const { user } = this.props
    if (user !== null) {
      this.getPrescriptions()
      this.getReminders()
    }
  }

  componentWillMount() {
    const { user } = this.props
    if (user === null) {
      this.props.logoutUser()
      this.props.history.push('/')
      message.error('Access Denied: You need to be logged in!')
    } else {
      var userToken = jwt.sign(JSON.stringify(user), appDetails.jwtSecret)
      setAuthorizationToken(userToken)
    }
  }

  switchMenu = (index) => {
    const { menu } = this.state
    let newMenu = menu
    newMenu.map((item) => {
      item.active = false
    })
    newMenu[index].active = true
    this.setState({
      menu: newMenu,
      menuToggleIcon: false,
      curentMenu: index+1
    })
  }

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  logOut = () => {
    this.props.logoutUser()
    this.props.history.push('/')
    openNotificationWithIcon('success', 'User  logged out!', 'User logged out successfully!')
  }

  getPrescriptions = () => {
    const { user } = this.props
    const { prescriptions } = this.state
    if (prescriptions.length === 0) {
      axios.get(`${api}/api/getprescriptions`, {
        params: {
          userId: user._id
        }
      }).then((res) => {
        let sorted = res.data.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        let notDeleted = sorted.filter((item) => !item.deleted)
        let completedPrescriptions = notDeleted.filter((item) => item.completed)
        this.setState({
          prescriptions: notDeleted,
          completedPrescriptions
        })
      }).catch((err) => {
        message.error('Error getting prescriptions')
      })
    }
  }

  getReminders = () => {
    const { user } = this.props
    const { reminders } = this.state
    if (reminders.length === 0) {
      axios.get(`${api}/api/getreminders`, {
        params: {
          userId: user._id
        }
      }).then((res) => {
        let sorted = res.data.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        let pendingReminders = sorted.filter((item) => !item.used)
        this.setState({
          reminders: sorted,
          pendingReminders
        })
      }).catch((err) => {
        message.error('Error getting reminders')
      })
    }
  }

  refreashGetPrescriptions = () => {
    this.setState({
      prescriptions: []
    }, () => {
      this.getPrescriptions()
    })
  }

  refreashGetReminders = () => {
    this.setState({
      reminders: []
    }, () => {
      this.getReminders()
    })
  }

  toggleMenuIcon = () => {
    const { menuToggleIcon } = this.state
    this.setState({
      menuToggleIcon: !menuToggleIcon
    })
  }

  cloaeMobileSider = () => {
    const { menuToggleIcon } = this.state
    if(menuToggleIcon) {
      this.setState({
        menuToggleIcon: false
      })
    }
  }

  render() {
    const { prescriptions, reminders, completedPrescriptions, pendingReminders, menu, menuToggleIcon, curentMenu } = this.state
    const { user } = this.props
    let iconclass = menuToggleIcon ? 'change' : ''
    return (
      <div className="dashboard">
        <Layout className="dashboard-main">
          <Sider trigger={null} collapsible collapsed={this.state.collapsed} className="desktop-sider">
            <p className="dashboard-main-logo"><DashboardOutlined />  {this.state.collapsed ? null : 'Dashboard'}
            </p>
            <Menu theme="dark" mode="inline" defaultSelectedKeys={[`${curentMenu}`]}>
              {
                menu.map((item, index) => (
                  <Menu.Item key={item.key} onClick={() => this.switchMenu(index)} >
                    {
                      item.icon === 'FileAddOutlined' ? <FileAddOutlined /> : null
                    }
                    {
                      item.icon === 'OrderedListOutlined' ? <OrderedListOutlined /> : null
                    }
                    {
                      item.icon === 'SettingOutlined' ? <SettingOutlined /> : null
                    }
                    {
                      item.icon === 'CalendarOutlined' ? <CalendarOutlined /> : null
                    }
                    <span>{item.name}</span>
                  </Menu.Item>
                ))
              }
              <Menu.Item key="5" onClick={this.logOut}>
                <LogoutOutlined />
                <span>Logout</span>
              </Menu.Item>
            </Menu>
          </Sider>
          {
            !menuToggleIcon ? null :
              <Sider className="mobile-sider animated fadeInLeft">
                <Menu theme="dark" mode="inline" defaultSelectedKeys={[`${curentMenu}`]}>
                  {
                    menu.map((item, index) => (
                      <Menu.Item key={item.key} onClick={() => this.switchMenu(index)} >
                        {
                          item.icon === 'FileAddOutlined' ? <FileAddOutlined /> : null
                        }
                        {
                          item.icon === 'OrderedListOutlined' ? <OrderedListOutlined /> : null
                        }
                        {
                          item.icon === 'SettingOutlined' ? <SettingOutlined /> : null
                        }
                        {
                          item.icon === 'CalendarOutlined' ? <CalendarOutlined /> : null
                        }
                        <span>{item.name}</span>
                      </Menu.Item>
                    ))
                  }
                  <Menu.Item key="5" onClick={this.logOut}>
                    <LogoutOutlined />
                    <span>Logout</span>
                  </Menu.Item>
                </Menu>
              </Sider>
          }
          <Layout className="site-layout" onClick={() => this.cloaeMobileSider()}>
            <Header className="site-layout-background desktop-header">
              {React.createElement(this.state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                className: 'trigger',
                onClick: this.toggle,
              })}
            </Header>
            <Header className="site-layout-background mobile-header">
              <h3><DashboardOutlined /> Dashboard</h3>
              <div className={`nav-mobile ${iconclass}`} onClick={this.toggleMenuIcon}>
                <div className="bar1"></div>
                <div className="bar2"></div>
                <div className="bar3"></div>
              </div>
            </Header>
            <Breadcrumb className="dashboard-main-bread">
              <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
              <Breadcrumb.Item>Welcome, {user.fullname}</Breadcrumb.Item>
            </Breadcrumb>
            <div className="dashboard-main-cards">
              <Row gutter={16}>
                <Col lg={6} sm={24} xs={24}>
                  <Card className="flashcard antblue">
                    <div className="top">
                      <h3> {prescriptions.length} Total Prescription</h3>
                      <FileAddOutlined className="flashcard-icon " />
                    </div>
                  </Card>
                </Col>
                <Col lg={6} sm={24} xs={24}>
                  <Card className="flashcard warning">
                    <div className="top">
                      <h3> {reminders.length} Total Reminders</h3>
                      <CalendarOutlined className="flashcard-icon " />
                    </div>
                  </Card>
                </Col>
                <Col lg={6} sm={24} xs={24}>
                  <Card className="flashcard success">
                    <div className="top">
                      <h3> {completedPrescriptions.length} Completed Prescription</h3>
                      <FileDoneOutlined className="flashcard-icon " />
                    </div>
                  </Card>
                </Col>
                <Col lg={6} sm={24} xs={24}>
                  <Card className="flashcard danger">
                    <div className="top">
                      <h3> {pendingReminders.length} Pending Reminders</h3>
                      <FolderOpenOutlined className="flashcard-icon " />
                    </div>
                  </Card>
                </Col>
              </Row>
            </div>
            {
              menu[0].active ? <AddPrescription logoutUser={this.props.logoutUser} user={user} refreashGetPrescriptions={this.refreashGetPrescriptions} />
                : null
            }
            {
              menu[1].active ? <AllPrescriptions logoutUser={this.props.logoutUser} user={user} refreashGetPrescriptions={this.refreashGetPrescriptions} />
                : null
            }
            {
              menu[2].active ? <AllReminders logoutUser={this.props.logoutUser} user={user} refreashGetReminders={this.refreashGetReminders} />
                : null
            }
            {
              menu[3].active ? <Settings logoutUser={this.props.logoutUser} user={user} updateUser={this.props.updateUser} />
                : null
            }
          </Layout>
        </Layout>
      </div>
    )
  }
}


const mapStateToProps = (state) => ({
  user: state.userReducer.user
})

export default connect(mapStateToProps, {
  logoutUser, updateUser
})(Dashboard);

