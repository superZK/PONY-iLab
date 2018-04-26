/**
 * Created by Z.K. on 2018/3/2
 */
import React, { Component } from 'react';
import { Select } from 'antd';
const Option = Select.Option;

/**
 * data: [Array[Array]]
 *       [['调度完成', 1],['调度未完成', 2],['已交付', 3],['未交付', 4],['已完成', 5],['未完成', 6]]  ===>>>
 *       [<Option value="1">调度完成</Option>,<Option value="2">调度未完成</Option>,...]
 */

export default class LocalDataSelect extends Component {
  constructor(props){
    super(props);
    this.state = {
      value : this.props.value || '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.renderOption = this.renderOption.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.value !== this.props.value){
      const value = nextProps.value;
      this.setState({
        value,
      });
    }
  }

  handleChange = (value) => {
    this.setState({
      value,
    });
    if(this.props.onChange)
      this.props.onChange(value);
  }

  renderOption = (data) => {
    return data.map(item => 
      <Option value={`${item[1]}`}>{item[0]}</Option>
    );
  }
  
  render(){
    const {
      data,//option数据来源
    } = this.props;
    return (
      <Select
        style = {{width: '100%'}}
        allowClear = {true}
        value = {this.state.value}
        onChange = {this.handleChange}
      >
        {this.renderOption(data)}
      </Select>
    );
  }
}