import React, {Component} from 'react';
import { Table } from 'antd';
import moment from 'moment'

export default class SampleTable extends Component{

  constructor(props) {
    super(props);
    this.state = {
      preparedKeys: [],
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps) {
      this.setState({
        preparedKeys: [],
      })
    }
  }

  render() {
    const {
      reportVerifyData,         // 样品数据
    } = this.props;

    const expandedRowRender = (record) => {
      return (
        <div>
          {(record && record.reportCompileSignet && record.reportCompileSignet.length > 0) ?
            ((record && record.reportCompileSignet) || []).map(_ => {
              return <p style={{lineHeight: '28px'}}>签章: <b>{_.signetName || '空'}</b></p>
            }) :
            <span>空</span>
          }
        </div>
      )
    };

    const columns = [
      {title: '订单编号', dataIndex: 'orderNo', key: 'orderNo', },
      {title: '报告编号', dataIndex: 'reportNo', key: 'reportNo', },
      {title: '报告模板', dataIndex: 'reportTemplate.name', key: 'reportTemplate.name', },
      {title: '报告审核状态', dataIndex: 'process', key: 'process',
        render: (text) => (text !== null) ? '待审' : '空'
      },
      {title: '编制时间', dataIndex: 'compileTime', key: 'compileTime', render: (text, record) => {
        return moment(record.compileTime).format('YYYY-MM-DD')
      }},
      {title: '编制人', dataIndex: 'compile', key: 'compile',
        render: (text, record) => text ? text.account : '空'
      }
    ]

    const tableRowSelection = {
      type: 'Checkbox',
      selectedRowKeys: this.state.preparedKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        let preparedKeys = selectedRows.map( item => item.key );
        this.setState({preparedKeys});
        if(this.props.onPrepare){
          this.props.onPrepare(selectedRows, selectedRowKeys);
        }
      }
    }

    return (
      <Table
        size='small'
        pagination={{pageSize: 10, showQuickJumper: true}}
        rowSelection={tableRowSelection}
        columns={columns}
        bordered
        // onExpand={handleExpand}    // 展开行时触发
        expandedRowRender={expandedRowRender}   // 额外展开行
        dataSource={reportVerifyData}
      />
    )
  }
}
