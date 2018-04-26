import React, { Component } from 'react';
import { DatePicker } from 'antd';
import moment from 'moment';
const RangePicker = DatePicker.RangePicker;

export default class BaseRangePicker extends Component {
  constructor(props){
    super(props);
    this.state = {
      dates: this.props.value || null,
    };
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(dates, dateStrings){
    if(dates.length === 0)
      dates = '';
    this.setState({
      dates,
    })
    if(this.props.onChange)
      this.props.onChange(dates);
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.value !== this.props.value){
      const dates = nextProps.value;
      this.setState({
        dates,
      });
    }
  }
  
  render(){
    return(
      <RangePicker
        value={this.state.dates}
        ranges={{
          '当天': [moment(), moment()],
          '三天以内': [moment().subtract(2,'days'), moment()],
          '一周以内': [moment().subtract(6,'days'), moment()],
          '一月以内': [moment().subtract(1,'month'), moment()],
        }}
        onChange={this.handleChange}
      />
    );
  }
}
