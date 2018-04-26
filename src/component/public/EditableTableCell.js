import React, { Component } from 'react';
import SearchableSelector from './SearchableSelector';
import BaseInputNumber from './BaseInputNumber';
import { Input, Icon, } from 'antd';

export default class EditableTableCell extends Component {
  state = {
    value: this.props.value,
    editable: true,
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.value !== this.props.value){
      this.setState({
        value : nextProps.value,
        editable: true,
      });
    }
  }

  render() {
    const {
      value,
      editable,
    } = this.state;

    const {
      canEdit,//从表格配置columns通过状态等条件控制可编辑状态的切换
      URL,//综合表格可编辑单元格传过来的url，防止与结果录入节点传递的props：url 冲突
    } = this.props;

    // 文本区操作
    const handleTextChange = (e) => {
      const value = e.target.value;
      this.setState({ value });
    }

    const check = () => {
      this.setState({ editable: false });
      if (this.props.onChange)
      this.props.onChange(this.state.value);
    }

    const edit =() => {
      this.setState({ editable: true });
    }

    // 选择区操作
    const handleChangeOption = (option) => {
      let value = option || null;
      this.setState({ value });
      if (this.props.onChange)
      this.props.onChange(value);
    }

    const checkSelect = (label) => {
      this.setState({
        editable: false,
        value: label,
       });
    }

  // 整数区操作
    const handleNumberChange = (value) => {
      this.setState({value})
    }

    const checkNumber = (value) => {
      this.setState({
        editable: false,
        value: value + '',
      })
      this.props.onChange(value);
    }

    const component = () => {
      switch(this.props.resultType){
        case '文本':
          return(
            <Input
              value={value}
              onChange={handleTextChange}
              onPressEnter={check}
              onBlur={check}
            />
          );
        case '选择':
          return(
            <SearchableSelector
              options={{allowClear:true}}
              disabled={false}
              lazyMode={false}
              value={this.state.value}
              onChange={handleChangeOption}
              onBlur={checkSelect}
              url={this.props.url || this.props.URL}
            />
          );
        case '整数':
          return(
            <BaseInputNumber
              value={value === 'undefined' ? '' : value}
              max={this.props.max}
              min={this.props.min}
              onChange={handleNumberChange}
              onBlur={checkNumber}
            />
          );
        default:
          return(
            <Input
              value={value}
              onChange={handleTextChange}
              onPressEnter={check}
              onBlur={check}
            />
          );
      }
    }

    // 通过状态控制组件可编辑性
    const editableByProcessName = (status, canEdit, editable) => {
      const editableCOMP = (editable ?
        <div className="editable-cell-input-wrapper">
          {component()}
          <Icon
            type="check"
            className="editable-cell-icon-check"
            onClick={check}
          />
        </div>
        :
        (this.props.resultType === '选择'
        ? <div>
            <SearchableSelector
              options={{allowClear:true}}
              disabled={true}
              lazyMode={false}
              value={this.state.value}
              onChange={handleChangeOption}
              onBlur={checkSelect}
              url={this.props.url || this.props.URL}
            />
            <Icon
              type="edit"
              className="editable-cell-icon"
              onClick={edit}
            />
          </div>
        : <div className="editable-cell-text-wrapper">
            {value === 'undefined' ? '' : value || ' '}
            <Icon
              type="edit"
              className="editable-cell-icon"
              onClick={edit}
            />
          </div>
        ));

      const notEditableCOMP = (<div className="editable-cell-text-wrapper">{value || ' '}</div>);
      //以状态判断可编辑性，配合使用的是EditableTable组件，目前只是用在结果录入节点，存在局限性，打算弃用

      switch(status){
        case null:
        case '':
          return editableCOMP;
        case '录入':
          return editableCOMP;
        case '待审':
          return notEditableCOMP;
        case '己审核':
          return notEditableCOMP;
        case '退回':
          return editableCOMP;
        case '重测':
          return notEditableCOMP;
        default:
          return editableCOMP;
      }


      //以columns中传递过来的canEdit：boolean  为依据切换可编辑性，具体判断逻辑在columns中完成，配合综合表格组件使用
      if(canEdit){
        return editableCOMP;
      }else{
        return notEditableCOMP;
      }
    }

    return (
      <div className="editable-cell">
      {
        editableByProcessName(this.props.status, this.props.canEdit, editable)
      }
    </div>);
  }
}
