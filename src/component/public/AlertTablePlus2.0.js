import React, { Component } from 'react';
import TagGroup from './TagGroup';
import { Table, Row, Col, Icon, Input, Alert, Tag, } from 'antd';
import { uniqueObj, unique, removeNodeById } from '../../util/treeUtils.js';

export default class AlertTablePlusForVerify extends Component {
  constructor(props){
    super(props);

    this.state = {
      preparedKeys: [],
      selectedKey: '',
      expandedRowKey: '',
      preparedRows: [{key:'1', name:'无任何勾选项'}],
    };

    this.handleSelect = this.handleSelect.bind(this);
    this.renderExpandedRow = this.renderExpandedRow.bind(this);
    this.handleExpand = this.handleExpand.bind(this);
    this.handleDoubleClick = this.handleDoubleClick.bind(this);
  }

  componentWillReceiveProps(nextProps){
    if(this.props.data != nextProps.data){
      this.setState({
        // preparedKeys: [],
        selectedKey: '',
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

  /*
    勾选表格数据时如何判断是增加还是减少勾选项，通过selectedRowKeys和this.state.preparedKeys数组长度的对比，假如表格组件维护的selectedRowKeys长度小于this.state.preparedKeys本地状态维护的长度，则肯定是减少勾选项
  */
  handlePrepare(selectedRowKeys, selectedRows){
    let preparedKeys = selectedRowKeys;
    let preparedRows = [];
    // 控制preparedKeys
    if(selectedRowKeys.length < this.state.preparedKeys.length){
      preparedKeys = selectedRowKeys;
    }else{
      preparedKeys = preparedKeys.concat(this.state.preparedKeys);
    }
    // 控制preparedRows
    if(this.state.preparedRows[0].name === '无任何勾选项'){
      preparedRows = preparedRows.concat(selectedRows);
    }else if(selectedRowKeys.length < this.state.preparedKeys.length){
      let deleteItemKey = this.state.preparedKeys.filter(item => selectedRowKeys.indexOf(item) === -1);
      removeNodeById(this.state.preparedRows, 'key', deleteItemKey)
      preparedRows = this.state.preparedRows;
    }else{
      preparedRows = this.state.preparedRows.concat(selectedRows);
    }
    preparedRows = uniqueObj(preparedRows, 'key');
    preparedKeys = unique(preparedKeys);
    if(preparedRows.length === 0){
      preparedRows = [{key:'1', name:'无任何勾选项'}];
    }
    this.setState({
      preparedKeys,
      preparedRows,
    });
    if(this.props.onPrepare){
      this.props.onPrepare(preparedRows, preparedKeys);
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

    const filterPreparedKeys = (removeId) => {
      const afterFilterPreparedKeys = this.state.preparedKeys.filter(key => key !== removeId);
      const afterFilterPreparedRows = this.state.preparedRows.filter(row => row.key !== removeId);
      this.setState({
        preparedKeys: afterFilterPreparedKeys,
        preparedRows: afterFilterPreparedRows.length > 0 ? afterFilterPreparedRows : [{key:'无任何勾选项',name:'无任何勾选项'}],
      });
      //tag与表格勾选项联动，保证出现在审核modal的数据条数正确
      if(this.props.onPrepare)
        this.props.onPrepare(afterFilterPreparedRows, afterFilterPreparedKeys);
    }

    return (
      <div>
        <Alert
          type="info"
          showIcon={true}
          closable={true}
          message={<TagGroup
            filterPreparedKeys={filterPreparedKeys}
            renderKey={this.props.renderKey}
            data={this.state.preparedRows}
          />}
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
