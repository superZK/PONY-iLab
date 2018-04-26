import React, {Component} from 'react';
import { Table, Icon } from 'antd';
import moment from 'moment'

export default class ReportTable extends Component{

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
      markReportBtnData,     // 样品数据
      // qualificationData,  // 资质签章数据
      // qualifyList,        // 资质签章action
    } = this.props;

    // const dataSource = sampleData;
    // (dataSource || []).map(v => {
    //   v.a = qualificationData;
    // })

    // const handleExpand = (expanded, record) => {
    //   if (expanded) {
    //     qualifyList(record.siteId, record.testMethodId, record.testItemId, record.productId)
    //   }
    // }

    const expandedRowRender = (record) => {
      return (
        <div>
          {((record && record.reportCompileSignet) || []).map(_ => {
            return <p style={{lineHeight: '28px'}}>签章: <b>{_.signetName || '空'}</b></p>
          }) || '空'}
        </div>
      )
    };

    const columns = [
      {title: '订单编号', dataIndex: 'orderNo', key: 'orderNo', },
      {title: '报告编号', dataIndex: 'reportNo', key: 'reportNo', },
      {title: '报告模板', dataIndex: 'reportTemplate.name', key: 'reportTemplate.name', },
      {title: '报告审核状态', dataIndex: 'status', key: 'status', render: (text, record) => {
        return record.status || '无'
      }},
      {title: '编制时间', dataIndex: 'compileTime', key: 'compileTime', render: (text, record) => {
        return moment(record.compileTime).format('YYYY-MM-DD')
      }},
      {title: '编制人', dataIndex: 'compile.account', key: 'compile.account',},
      {title: '作废', dataIndex: 'disable', key: 'disable', render: (text, record) => {
        return text ?
          <Icon type="check-circle" style={{fontSize: 16, color : '#00A854', textAlign: 'center'}} /> :
          <Icon type="close-circle" style={{fontSize: 16, color : '#F04134', textAlign: 'center'}} />
      }}
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
        pagination={{pageSize: 5, showQuickJumper: true}}
        rowSelection={tableRowSelection}
        columns={columns}
        bordered
        // onExpand={handleExpand}    // 展开行时触发
        expandedRowRender={expandedRowRender}   // 额外展开行
        dataSource={markReportBtnData}
      />
    )
  }
}
