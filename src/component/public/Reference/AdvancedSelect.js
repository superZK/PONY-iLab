import React, { Component } from 'react';
import classNames from 'classnames/bind';
import { Input, Icon, Dropdown, Table, Row, Col, Tag } from 'antd';
import ReferenceTable from './ReferenceTable';
import ReferenceTree from './ReferenceTree';
import { analysisDataIndex, findParentNodeById } from '../../../util/treeUtils';
import fetchData from '../../../util/fetchGateway';
import './index.css';

export default class AdvancedSelect extends Component {
  constructor(props){
    super(props);

    this.state = {
      value: this.props.value || [],//选择值的id
      loadData: false,//触发下拉并加载数据
      isBlur: true,//记录inputBlur是否应该生效
      downIcon: true,//记录下拉图标方向
      showDropdown: false,//记录是否显示下拉框
      inputValue: '',//Input内容
      dataSource: [],//表格数据
    }
    this.triggerChange  = this.triggerChange .bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.onPressEnter = this.onPressEnter.bind(this);
    this.onInputBlur = this.onInputBlur.bind(this);
    this.onInputValueChange = this.onInputValueChange.bind(this);
    this.emitEmpty = this.emitEmpty.bind(this);
    this.focus = this.focus.bind(this);
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.onTableRowClick = this.onTableRowClick.bind(this);
    this.onTablePrepared = this.onTablePrepared.bind(this);
  }

  loadSelectOptions(searchValue){
    if(!searchValue) return;
    let url = this.props.url + '?s=' + searchValue;
    fetchData(url).then(
      (receipt) => {
        let originData = receipt.data[0];
        let dataSource = originData.options;
        let subordinateArr = [];
        if(originData.groups.length > 0){
          originData.groups.map((item) => {
            if(item.subordinate.length > 0)
            subordinateArr =  subordinateArr.concat(item.subordinate)
          });
        }
        dataSource = dataSource.concat(subordinateArr);
        this.setState({
          dataSource,
        });
      },
      (error) => {console.log(error)}
    );
  }

  // 根据id查询数据，通常用于显示已有id对应的label，受外部控制，优先级为：作为form的控件时，this.props.value只受form控制，value为数据对应字段的值。单独使用时，value受组件本身value属性控制。
  componentWillMount(){
    if(this.props.value.length > 0){
      let url =  this.props.url + '?i=' + this.props.value[0];
      let inputValue = '';
      fetchData(url).then(
        (receipt) => {
          let originData = receipt.data[0];
          let dataSource = originData.options;
          let subordinateArr = [];
          let renderV = [];
          if(originData.groups.length > 0){
            originData.groups.map((item) => {
              if(item.subordinate.length > 0)
                subordinateArr = subordinateArr.concat(item.subordinate)
            });
          }
          dataSource = dataSource.concat(subordinateArr);
          if(dataSource.length > 0){
            for(let i = 0; i < dataSource.length; i++){
              let dataItem = dataSource[i];
              let renderValue = [];
              this.props.renderKey.map((item) => {
                if(item.includes('.')){
                  renderValue.push(analysisDataIndex(dataItem, item));
                }else{
                  renderValue.push(dataItem[item]);
                }
              });
              renderValue = renderValue.filter(item => item !== undefined).join('_');
              renderV.push(renderValue);
            }
          }
          renderV = renderV.filter(item => item !== '').join(',');
          this.setState({
            inputValue: renderV,
          });
        },
        (error) => {console.log(error)}
      );
    }
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.value.length > 0)
      this.setState({
        value: nextProps.value,
      });
  }

  triggerChange(value){
    const { onChange } = this.props;
    if(onChange)
      onChange(value);
  }

  handleClick(){
    // 点击切换图标旋转方向并切换下拉框显示状态
    const downIcon = !this.state.downIcon;
    const showDropdown = !this.state.showDropdown;
    this.setState({
      downIcon,
      showDropdown,
    });
  }

  onPressEnter(e){
    let inputValue = e.target.value;
    this.setState({
      inputValue,
      downIcon: false,
      showDropdown: true,
      loadData: true,
    });
    this.loadSelectOptions(inputValue);
  }

  // Input失焦状态图标旋转方向恢复原状并隐藏下拉
  onInputBlur(){
    if(this.state.isBlur)
      this.setState({
        downIcon: true,
        showDropdown: false,
      });
  }
  
  onInputValueChange(e){
    this.setState({
      inputValue: e.target.value,
    });
  }

  // 清空Input内容
  emitEmpty(){
    this.setState({
      inputValue: '',
    });
  }

  // input获得焦点
  focus(){
    this.refs.input.focus();
  }

  // 当鼠标位于dropDown区域时，onInputBlur不生效
  onMouseEnter(){
    this.focus();
    this.setState({
      isBlur: false,
    });
  }

  onMouseLeave(){
    this.setState({
      isBlur: true,
    });
  }

  // 单选模式
  onTableRowClick(record, index){
    const {renderKey} = this.props;
    let renderValue = [];
    let inputValue = '';
    renderKey.map((item) => {
      if(item.includes('.')){
        renderValue.push(analysisDataIndex(record, item));
      }else{
        renderValue.push(record[item]);
      }
    });
    inputValue = renderValue.join('_');
    this.triggerChange(analysisDataIndex(record, this.props.transferKey));
    this.setState({
      inputValue,
      showDropdown: false,
      downIcon: false,
      value: [analysisDataIndex(record, this.props.transferKey)],
      dataSource: [],
    });
  }

  // 多选模式
  onTablePrepared(selectedRowKeys, selectedRows){
    const {renderKey} = this.props;
    let inputValue = '';
    let inputValueArr = [];
    let renderV = '';
    for(let i = 0; i < selectedRows.length; i++){
      let renderValue = [];
      renderKey.map((item) => {
        if(item.includes('.')){
          renderValue.push(analysisDataIndex(selectedRows[i], item));
        }else{
          renderValue.push(selectedRows[i][item]);
        }
      });
      inputValue = renderValue.join('_');
      inputValueArr.push(inputValue);
    }
    renderV = inputValueArr.join(' , ');
    this.setState({
      inputValue: renderV,
      // showDropdown: false,
      // downIcon: false,
    });
  }

  render(){
    const {
      value,
      isBlur,
      loadData,
      downIcon,
      showDropdown,
      inputValue,
      dataSource,
    } = this.state;

    let toogleIcon = classNames({
      toogleIcon: !downIcon,
    });

    let toogleDropdown = classNames({
      showDropdown: showDropdown,
      hideDropdown: !showDropdown,
    });

    return (
      <div key={'wrapper-div'} style={{display: 'inline-block', width: this.props.inputWidth}}>
        <Input
          ref={'input'}
          style={{width: this.props.inputWidth}}
          suffix={inputValue ? <Icon style={{cursor: 'pointer'}} type="close-circle" onClick={this.emitEmpty} /> : <Icon type="down" style={{transition: 'transform 0.2s'}} className={toogleIcon} />}
          value={inputValue}
          // onClick={this.handleClick}
          onBlur={this.onInputBlur}
          onPressEnter={this.onPressEnter}
          onChange={this.onInputValueChange}
        />
        <div key={'dropDown-div'} style={{width: this.props.dropDownWidth, backgroundColor: '#fff', border: '1px solid #e9e9e9', borderRadius: '5px', padding: '8px 6px', transition: 'all 5s', position: 'absolute', zIndex: 9999}} className={toogleDropdown} onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave} >
          {/* <Row>
            <Col span={8}>
              <ReferenceTree
                categoryData = {this.props.categoryData}
                selectedKeys = {this.props.selectedKeys}
                onSelect={this.props.onSelect}
                isMatch={this.props.isMatch}
                renderTitle={this.props.renderTreeNodeTitle}
              />
            </Col>
            <Col span={16}> */}
              <ReferenceTable
                onRowClick={this.onTableRowClick}
                onPrepared={this.onTablePrepared}
                scroll={{x:0, y:150}}
                setting={this.props.setting}
                data={this.state.dataSource}
              />
            {/* </Col>
          </Row> */}
        </div>
      </div>
    );
  }
}
