import React, { Component } from 'react'
import { Layout, notification, Alert, Input, Button, Table, message } from 'antd';
import api from '../../config/api'
import axios from 'axios'
import Highlighter from 'react-highlight-words';
import SearchOutlined from '@ant-design/icons/SearchOutlined';
import moment from 'moment'
const { Content } = Layout;
const openNotificationWithIcon = (type, msg, desc) => {
  notification[type]({
    message: msg,
    description: desc
  })
}

export default class AllReminders extends Component {
  constructor(props) {
    super(props)
    this.state = {
      searchText: '',
      searchedColumn: '',
      error: null,
      reminders: []
    }
  }

  componentDidMount() {
    this.getReminders()
  }

  refreashGetReminders = () => {
    this.setState({
      reminders: []
    }, () => {
      this.getReminders()
    })
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
        this.addkeys(sorted)
      }).catch((err) => {
        message.error('Error getting reminders')
      })
    }
  }

  addkeys = (reminders) => {
    let remindersWithKey = []
    // eslint-disable-next-line
    reminders.map((item) => {
      remindersWithKey.push({
        key: item._id,
        name: item.prescription.name,
        ...item
      })
    })
    this.setState({
      reminders: remindersWithKey
    })
  }

  getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Button
          type="primary"
          onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          icon={<SearchOutlined />}
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
          Reset
        </Button>
      </div>
    ),
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },
    render: text =>
      this.state.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[this.state.searchText]}
          autoEscape
          textToHighlight={text.toString()}
        />
      ) : (
          text
        ),
  });

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  handleReset = clearFilters => {
    clearFilters();
    this.setState({ searchText: '' });
  };

  getRoundedTime = (time) => {
    var mainFormat = moment(time)
    var secs = mainFormat.second()
    var justMinutes = mainFormat.subtract(secs, 'seconds')
    var remainder = 1 - (justMinutes.minute() % 1);
    var dateTime = moment(justMinutes).add(remainder, "minutes")
    var final = dateTime.format()
    return final
  }

  markAsUsed = (presId) => {
    axios.post(`${api}/api/markreminder`, {
      presId
    }).then((res) => {
      openNotificationWithIcon('success', 'Reminder Updated!', res.data.message)
      this.refreashGetReminders()
      this.props.refreashGetReminders()
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
          })
        }
      }
    })
  }

  render() {
    const { error, reminders } = this.state
    const columns = [
      {
        title: 'Name of Prescription',
        dataIndex: 'name',
        key: 'name',
        width: '35%',
        ...this.getColumnSearchProps('name'),
        render: (text, record) => (
          <span>
            <span className='bold-text'>Product Name: </span>
            {record.name}
          </span>
        )
      },
      {
        title: 'Usage Interval',
        dataIndex: ['prescription', 'interval'],
        key: 'interval',
        render: (text, record) => (
          <span>
            <span className='bold-text'>Interval: </span>
            {`Every ${record.prescription.interval} ${record.prescription.interval > 1 ? 'hours' : 'hour'}`}
          </span>
        )
      },
      {
        title: 'Time To Use',
        dataIndex: 'timetoUse',
        key: 'timetoUse',
        defaultSortOrder: 'ascend',
        sorter: (a, b) => new Date(b.timetoUse) - new Date(a.timetoUse),
        render: (text, record) => (
          <span>
            <span className='bold-text'>Time To Use: </span>
            {moment(this.getRoundedTime(record.timetoUse)).format('LLL')}
          </span>
        )
      },
      {
        title: 'Used',
        dataIndex: 'used',
        key: 'used',
        render: (text, record) => (
          <span>
            <span className='bold-text'>Used: </span>
            {record.used ? 'Yes' : 'No'}
          </span>
        )
      },
      {
        title: 'Action',
        dataIndex: 'action',
        render: (text, record) => (
          <span>
            <Button disabled={record.used} type="primary" onClick={() => this.markAsUsed(record._id)}>
              Mark as Used
            </Button>
          </span>
        )
      }
    ]
    return (
      <div className="dashboard-main-content">
        <Content
          className="site-layout-background holder"
        >
          <h2>All Reminders</h2>
          {
            error ? <div className="error-holder">
              <Alert message={`Error: ${error}`} type="error" />
            </div> : null
          }
          <Table columns={columns} dataSource={reminders} size="small"
            expandable={{
              expandedRowRender: record => <div className="other-details">
                {
                  record.prescription.deleted ?
                    <Alert message="You have deleted this prescription" type="error" className="warining" />
                    : null
                }
                {
                  record.prescription.completed ?
                    <Alert message="You have completed this prescription" type="success" className="warining" />
                    : null
                }
                <div className="detail-holder">
                  <h4>Product Brand: </h4>
                  {record.prescription.brandname}
                </div>
                <div className="detail-holder">
                  <h4>formula: </h4>
                  {record.prescription.formula}
                </div>
                {
                  record.prescription.completed ? null :
                    <div className="detail-holder">
                      <h4>Next reminder time: </h4>
                      {moment(this.getRoundedTime(record.prescription.nextReminder)).format('LLL')}
                    </div>
                }
                <div className="detail-holder">
                  <h4>Description: </h4>
                  {record.prescription.desc}
                </div>
                <div className="detail-holder">
                  <h4 className="bold">This prescription was created at:</h4> {moment(record.prescription.createdAt).format('LLL')}
                </div>
              </div>
            }} />
        </Content>
      </div>
    )
  }
}
