import React, { Component } from 'react';
import classNames from 'classnames/bind';
import { Table, Row, Col, Icon } from 'antd';
import TooltipSpan from '../Table/TooltipSpan';
import { analysisDataIndex } from '../../../util/treeUtils';
import './index.css';

export default class ReferenceTable extends Component {
  constructor(props){
    super(props);
    this.state = {
      preparedKeys: [],
    }
    
    this.handleRowClick = this.handleRowClick.bind(this);
    this.handlePrepare = this.handlePrepare.bind(this);
    this.renderColumns = this.renderColumns.bind(this);
    this.switchRenderType = this.switchRenderType.bind(this);
  }

  // 生成columns配置
  renderColumns(setting){
    let columns = [];
    setting.map((item) => {
      let obj = {};
      obj.className = item.className || null;
      obj.title = item.title;
      obj.dataIndex = item.dataIndex;
      obj.width = item.width || null;
      obj.fixed = item.fixed || false;
      obj.render = item.needAdvancedRender ? (text, record) => {return this.switchRenderType(item, text, record)} : text => text || '空';
      columns.push(obj);
    });
    return columns;
  }

  // 根据表格编辑类型选择表格编辑函数
  switchRenderType(columnItem, text, record){
    let value = analysisDataIndex(record, columnItem.dataIndex);
    switch(columnItem.renderType){
      case '图标':
        return (
          this.switchIcon(value, columnItem.render.showIconRule)
        );
      case '文字提示':
        return (
          <TooltipSpan
            spanClass={columnItem.render.spanClass || {}}
            mouseEnterDelay={columnItem.render.mouseEnterDelay || 0.5}
            longNum={columnItem.render.longNum || 20}
            data={value}
          />
        );
    }
  }

  handleRowClick(record, index, event){
    const { onRowClick } = this.props;
    if(onRowClick)
      onRowClick(record, index);
  }

  handlePrepare(selectedRowKeys, selectedRows){
    this.setState({
      preparedKeys: selectedRowKeys,
    });
  }

  render(){
    const {
      preparedKeys,
    } = this.state;

    const {
      onPrepared,
      onRowClick,
    } = this.props;

    const tableRowSelection = {
      selectedRowKeys: preparedKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        this.handlePrepare(selectedRowKeys, selectedRows);
        if(onPrepared)
          onPrepared(selectedRowKeys, selectedRows);
      }
    }

    return(
      <Table
        {...this.props.options}
        pagination={false}
        size='small'
        // rowSelection={tableRowSelection}
        onRowClick={this.handleRowClick}
        scroll={this.props.scroll || {x:0, y:0}}
        columns={this.renderColumns(this.props.setting.column)}
        dataSource={this.props.data}
      />
    );
  }
}