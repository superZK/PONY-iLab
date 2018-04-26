/**
 * colNum={'1'}//表单列数控制
 * simpleSearchKey={['name', 'code']}//简易搜索规则
 * avancedSearchForm={TestUISetting.formExample}//高级搜索表单设置
 * 其余props与BaseTable相同
 */
import React, { Component } from 'react';
import TooltipSpan from './TooltipSpan';
import WrappedSearchArea from './WrappedSearchArea';
import { Table, Row, Col, Icon, Input } from 'antd';
import { replaceNodeById, analysisDataIndex, findParentNodeById } from '../../util/treeUtils';

export default class SearchableTable extends Component {
  constructor(props){
    super(props);

    this.state = {
      preparedKeys: [],
      selectedKey: '',
      expandedRowKey: '',
      filterData: [],
      showFilterData: false,
    };

    this.handleSelect = this.handleSelect.bind(this);
    this.renderExpandedRow = this.renderExpandedRow.bind(this);
    this.handleExpand = this.handleExpand.bind(this);
    this.handleDoubleClick = this.handleDoubleClick.bind(this);
  }

  componentWillReceiveProps(nextProps){
    let filterData = this.state.filterData;
    replaceNodeById(filterData, 'id', nextProps.data);
    if(this.props.data != nextProps.data){
      this.setState({
        preparedKeys: [],
        selectedKey: '',
        filterData,
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
    let doubleItemRows = [];
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

    if(preparedKeys.length > 0){
      preparedKeys.map((item) => {
        doubleItemRows.push(findParentNodeById(this.props.data, 'key', item));
      });
      if(this.props.onPrepare){
        this.props.onPrepare(doubleItemRows, preparedKeys);
      }
    }else{
      if(this.props.onPrepare){
        this.props.onPrepare([], []);
      }
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
                <label style={lableStyle}>{item.label}:</label><TooltipSpan mouseEnterDelay={0.5} longNum={item.longNum || 20} data={analysisDataIndex(record, item.key) || ''}/>
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

    // 简易搜索
    const sampleSearch = (searchValue) => {
      if(!searchValue) return;
      const originalData = this.props.data;
      const searchKey = this.props.simpleSearchKey;
      let filterData = [];
      originalData.map((item) => {
        for(let i = 0; i < searchKey.length; i++){
          if(item[searchKey[i]] && item[searchKey[i]].includes(searchValue)){
            filterData.push(item);
            continue;
          }
        }
      });
      // 过滤出去的数据需要取消勾选以及点选状态
      let preparedKeys = this.state.preparedKeys || [];
      let filterKey = filterData.map( item => item.key);
      let needShowKeys = [];
      let needShowItems = [];
      preparedKeys.map((item) => {
        if(filterKey.includes(item)){
          needShowKeys.push(item);
        }
      });
      needShowItems = filterData.filter((item) => {
        if(needShowKeys.includes(item.key))
          return item;
      });
      if(this.props.onPrepare){
        this.props.onPrepare(needShowItems, needShowKeys);
      }

      this.setState({
        filterData,
        showFilterData: true,
        preparedKeys: needShowKeys,
      });
    }

    // 高级搜索
    const avancedSearch = (formValue) => {
      const originalData = this.props.data;
      const searchKey = Object.keys(formValue);
      const searchValues = Object.values(formValue);
      // 记录form组件是否为input，是则使用模糊查询规则，不是则使用全字匹配规则
      const isInputArr = this.props.avancedSearchForm.items.map(
        (item) => {
          if(item.component.props.prefixCls === 'ant-input'){
            return true;
          }
          return false;
        }
      );
      let filterData = [];
      originalData.map((item) => {
        let match = true;
        for(let i = 0; i < searchKey.length; i++){
          if(searchValues[i] && item[searchKey[i]].toString()){
            if(isInputArr[i]){
              if(!((item[searchKey[i]]).toString()).includes(searchValues[i])){
                match = false;
              }
            }else{
              if((item[searchKey[i]]).toString() !== searchValues[i]){
                match = false;
              }
            }
          }
        }
        if(match)
          filterData.push(item);
      });
      // 过滤出去的数据需要取消勾选以及点选状态
      let preparedKeys = this.state.preparedKeys || [];
      let filterKey = filterData.map( item => item.key);
      let needShowKeys = [];
      let needShowItems = [];
      preparedKeys.map((item) => {
        if(filterKey.includes(item)){
          needShowKeys.push(item);
        }
      });
      needShowItems = filterData.filter((item) => {
        if(needShowKeys.includes(item.key))
          return item;
      });
      if(this.props.onPrepare){
        this.props.onPrepare(needShowItems, needShowKeys);
      }

      this.setState({
        filterData,
        showFilterData: true,
        preparedKeys: needShowKeys,
      });
    }

    // 重置数据,清空状态
    const resetData = () => {
      this.setState({
        showFilterData: false,
        preparedKeys: [],
        filterData: [],
      });
      if(this.props.onPrepare){
        this.props.onPrepare([], []);
      }
    }

    // 向外暴露高级搜索与简易搜索的切换状态，用于控制样式
    const searchToggle = (expand) => {
      if(this.props.searchToggle)
        this.props.searchToggle(expand);
    }

    return (
      <div>
        <WrappedSearchArea
          colNum = {this.props.colNum}
          sampleSearch={sampleSearch}
          avancedSearch={avancedSearch}
          resetData={resetData}
          searchToggle={this.props.searchToggle}
          simpleSearchKey={this.props.simpleSearchKey}
          avancedSearchFormSetting={this.props.avancedSearchForm}
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
          dataSource={this.state.showFilterData ? this.state.filterData : this.props.data}
        />
      </div>
    );
  }
}
