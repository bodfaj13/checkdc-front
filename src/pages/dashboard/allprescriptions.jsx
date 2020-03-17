import React, { Component } from 'react'
import {
  Layout, notification, Alert, Input, Button, Table, message
} from 'antd';
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

export default class AllPrescriptions extends Component {
  constructor(props) {
    super(props)
    this.state = {
      searchText: '',
      searchedColumn: '',
      error: null,
      prescriptions: []
    }
  }

  componentDidMount() {
    this.getPrescriptions()
  }

  refreashGetPrescriptions = () => {
    this.setState({
      prescriptions: []
    }, () => {
      this.getPrescriptions()
    })
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
        this.addkeys(notDeleted)
      }).catch((err) => {
        message.error('Error getting prescriptions')
      })
    }
  }

  addkeys = (prescriptions) => {
    let prescriptionsWithKey = []
    prescriptions.map((item) => {
      prescriptionsWithKey.push({
        key: item._id,
        ...item
      })
    })
    this.setState({
      prescriptions: prescriptionsWithKey
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

  deletePrescription = (presId) => {
    axios.post(`${api}/api/deleteprescription`, {
      presId
    }).then((res) => {
      openNotificationWithIcon('success', 'Prescription Deleted!', res.data.message)
      this.refreashGetPrescriptions()
      this.props.refreashGetPrescriptions()
    }).catch((err) => {
      if (err.response.data.err === 'Please login to continue') {
        openNotificationWithIcon('error', 'Authentication Denied!', 'Login to perform action!')
        this.props.logoutUser()
      } else {
        this.setState({
          error: err.response.data.err,
        })
      }
    })
  }

  completePrescription = (presId) => {
    axios.post(`${api}/api/completeprescription`, {
      presId
    }).then((res) => {
      openNotificationWithIcon('success', 'Prescription Updated!', res.data.message)
      this.refreashGetPrescriptions()
      this.props.refreashGetPrescriptions()
    }).catch((err) => {
      if (err.response.data.err === 'Please login to continue') {
        openNotificationWithIcon('error', 'Authentication Denied!', 'Login to perform action!')
        this.props.logoutUser()
      } else {
        this.setState({
          error: err.response.data.err,
        })
      }
    })
  }

  render() {
    const { error, prescriptions } = this.state
    const columns = [
      {
        title: 'Name',
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
        dataIndex: 'interval',
        key: 'interval',
        render: (text, record) => (
          <span>
            <span className='bold-text'>Interval: </span>
            {`Every ${record.interval} ${record.interval > 1 ? 'hours' : 'hour'}`}
          </span>
        )
      },
      {
        title: 'Start Time',
        dataIndex: 'startTime',
        key: 'startTime',
        defaultSortOrder: 'ascend',
        sorter: (a, b) => new Date(b.startTime) - new Date(a.startTime),
        render: (text, record) => (
          <span>
            <span className='bold-text'> Start Time: </span>
            {moment(record.startTime).format('LLL')}
          </span>
        )
      },
      {
        title: 'Completed',
        dataIndex: 'completed',
        key: 'completed',
        render: (text, record) => (
          <span>
            <span className='bold-text'> Completed: </span>
            {record.completed ? 'Yes' : 'No'}
          </span>
        )
      },
      {
        title: 'Action',
        dataIndex: 'action',
        render: (text, record) => (
          <span>
            <Button disabled={record.completed} type="primary" onClick={() => this.completePrescription(record._id)}>
              Mark as Completed
            </Button>
            <Button type="danger" onClick={() => this.deletePrescription(record._id)}>
              Delete
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
          <h2>All Prescription</h2>
          {
            error ? <div className="error-holder">
              <Alert message={`Error: ${error}`} type="error" />
            </div> : null
          }
          <Table columns={columns} dataSource={prescriptions} size="small"
            expandable={{
              expandedRowRender: record => <div className="other-details">
                <div className="detail-holder">
                  <h4>Product Brand: </h4>
                  {record.brandname}
                </div>
                <div className="detail-holder">
                  <h4>formula: </h4>
                  {record.formula}
                </div>
                {
                  record.completed ? null :
                    <div className="detail-holder">
                      <h4>Next reminder time: </h4>
                      {moment(this.getRoundedTime(record.nextReminder)).format('LLL')}
                    </div>
                }
                <div className="detail-holder">
                  <h4>Description: </h4>
                  {record.desc}
                </div>
                <div className="detail-holder">
                  <h4 className="bold">This prescription was created at:</h4> {moment(record.createdAt).format('LLL')}
                </div>
              </div>
            }} />
        </Content>
      </div>
    )
  }
}
