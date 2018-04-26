import React, { Component } from 'react';
import EditableTableCell from './EditableTableCell';
import { Table, Row, Col, Icon, Input, Alert, } from 'antd';

export default class AlertTable extends Component {
  constructor(props){
    super(props);

    this.state = {
      preparedKeys: [],
      selectedKey: '',
      expandedRowKey: '',
    };

    this.handleSelect = this.handleSelect.bind(this);
    this.renderExpandedRow = this.renderExpandedRow.bind(this);
    this.handleExpand = this.handleExpand.bind(this);
    this.handleDoubleClick = this.handleDoubleClick.bind(this);
  }

  componentWillReceiveProps(nextProps){
    if(this.props.data != nextProps.data){
      this.setState({
        preparedKeys: [],
        selectedKey: [],
      });
    }
    if(this.props.visible && this.props.visible !== nextProps.visible){
      this.setState({
        preparedKeys: [],
        selectedKey: [],
      });
    }
  }

  handleSelect(record, index){
    let selectedKey = record.key;
    this.setState({selectedKey});
    if(this.props.onSelect){
      this.props.onSelect(record);
    }
  }

  handlePrepare(selectedRowKeys, selectedRows){
    let preparedKeys = selectedRows.map( item => item.key );
    this.setState({preparedKeys});
    if(this.props.onPrepare){
      this.props.onPrepare(selectedRows, selectedRowKeys);
    }
  }

  handleExpand(expanded, record) {
    this.setState({
      expandedRowKey: (expanded ? record.key : ''),
    });
  }

  handleDoubleClick(record, index, e){
    e.preventDefault();
    let doubleItemKeys = record.key;
    let preparedKeys = this.state.preparedKeys;
    let spliceIndex = -2;
    spliceIndex = preparedKeys.findIndex(item => item === doubleItemKeys);
    if(spliceIndex >= 0){
      preparedKeys.splice(spliceIndex, 1);
    }else{
      preparedKeys.push(doubleItemKeys);
    }
    this.setState({
      preparedKeys,
    });
    if(this.props.onPrepare){
      this.props.onPrepare(record, doubleItemKeys);
    }
  }

  renderExpandedRow(record){
    let config = (this.props.setting.expand) ? this.props.setting.expand : [];
    if(!config || config.length === 0) return '';
    const lableStyle = {color: '#99a9bf', fontSize: '14px', marginRight: '5px'};
    const spanStyle = {width: '200px',  float: 'right', border: '1px solid #ccc', borderRadius:'4px', marginRight: '10px', textAlign: 'center', height: '19px' };
    const radioStyle = {width: '200px', float: 'right', marginRight: '10px', textAlign: 'center', height: '19px', };
    return (
      <div>
        <Row gutter={16} style={{textAlign: 'right'}}>
          {config.map( (item) => {
            // 根据不同值类型，渲染不同span
            if(typeof(record[item.key]) === 'boolean'){
              return(
                <Col span={8} >
                  <label style={lableStyle}>{item.label}:</label><span style={radioStyle}>{record[item.key]  ? <Icon type="check-circle" style={{fontSize: 16, color : '#00A854'}}/> : <Icon type="close-circle" style={{fontSize: 16, color : '#F04134'}}/> }</span>
                </Col>
              )
            }else{
              return (
              <Col span={8} >
                <label style={lableStyle}>{item.label}:</label><span style={spanStyle}>{record[item.key]}</span>
              </Col>
              );
            }
          } )}
        </Row>
      </div>
    );
  }

  render() {
    const tableRowSelection = {
      type: this.props.type || 'checkbox',
      selectedRowKeys: this.state.preparedKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        this.handlePrepare(selectedRowKeys, selectedRows);
      }
    };

    const getRowStyle = (record, index) => {
      // 隔行变色
      if(index%2==0){
        if(record.key === this.state.selectedKey){
          return 'rowClickClass';
        }
        return 'tableOddClass';
      }else if(record.key === this.state.selectedKey){
        return 'rowClickClass';
      }
    }

    // 根据id生成key，在结果录入中不需要根据id生成key
    const rowKey = (record) => {
      if(!this.props.notNeedIdToKey){
        return record.id + '';
      }
    }

    const Expanded = (this.props.isExpanded) ? {
      expandedRowKeys: [this.state.expandedRowKey],
      onExpand : this.handleExpand,
      expandedRowRender : this.renderExpandedRow,
    } : {};

    const selectAll = () => {
      let preparedKeys = this.props.data.map(item => item.key);
      this.setState({
        preparedKeys,
      });
      if(this.props.onPrepare){
        this.props.onPrepare(this.props.data, preparedKeys);
      }
    }

    const clearAll = () => {
      this.setState({
        preparedKeys: [],
      });
      if(this.props.onPrepare){
        this.props.onPrepare([], []);
      }
    }

    return (
      <div>
        <Alert
          type="info"
          showIcon={true}
          closable={true}
          message={<span>已选择{this.state.preparedKeys.length || 0}项。{this.state.preparedKeys.length === this.props.data.length ? <a onClick={clearAll} >清空全部</a> : <a onClick={selectAll}>选择全部{this.props.data.length || 0}项</a>}</span>}
        />
        <Table
          {...this.props.options}
          {...Expanded}
          bordered
          size='small'
          rowSelection={this.props.hideRowSelection ? null : tableRowSelection}
          onRowClick={this.handleSelect}
          onRowDoubleClick={this.handleDoubleClick}
          rowClassName={getRowStyle}
          columns={this.props.setting.column || []}
          dataSource={this.props.data}
        />
      </div>
    );
  }
}
