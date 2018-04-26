import React, {Component} from 'react';
import { Table } from 'antd';

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
      sampleData,         // 样品数据
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
          {(record && record.qualificationList && record.qualificationList.length > 0) ?
            ((record && record.qualificationList) || []).map(_ => {
              return <p style={{lineHeight: '28px'}}>资质: <b>{_.qualificationTypeName || '空'}</b></p>
            }) :
            <span>空</span>
          }
        </div>
      )
    };

    const columns = [
      {title: '订单编号', dataIndex: 'orderNo', key: 'orderNo', },
      {title: '样品名称', dataIndex: 'testName', key: 'testName', },
      {title: '样品编号', dataIndex: 'serialNo', key: 'serialNo', },
      {title: '检测项目', dataIndex: 'testItemName', key: 'testItemName', },
      {title: '报告结果', dataIndex: 'finalResult', key: 'finalResult', },
      {title: '是否合格', dataIndex: 'inSpec', key: 'inSpec',
        render: (text, record) => record.inSpec ? '合格' : '不合格'
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
        pagination={{pageSize: 5, showQuickJumper: true}}
        rowSelection={tableRowSelection}
        columns={columns}
        bordered
        // onExpand={handleExpand}    // 展开行时触发
        expandedRowRender={expandedRowRender}   // 额外展开行
        dataSource={sampleData}
      />
    )
  }
}
