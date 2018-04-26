  import React, { Component } from 'react';
  import { DatePicker } from 'antd';
  import moment from 'moment';
  /**
   * 定义DatePicker配置
   * format 展示日期格式 YYYY-MM-DD || YYYY-MM-DD HH:mm:ss 等
   * disabledDate 定义不可选择的日期 (currentDate: moment) => boolean
   * placeholder
   */
  export default class BaseDatePicker extends Component {
    state = {
      values: this.props.value ? moment(this.props.value, 'YYYY-MM-DD') : null,
    };

    componentWillReceiveProps(nextProps) {
      if (nextProps.value !== '' && this.props.value !== nextProps.value) {
        this.setState({
          ...this.state,
          values: moment(nextProps.value, 'YYYY-MM-DD')
        })
      }else if(!nextProps.value){
        this.setState({
          values: '',
        });
      }
    }

    render() {
      const { values } = this.state
      const {format, disabledDate, placeholder} = this.props

      const onChange=(value) => {
        if(!value){
          this.setState({
            values: '',
          });
          if(this.props.onChange){
            this.props.onChange('');
          }
        }else{
          this.setState({values: moment(value,'YYYY-MM-DD')});
          if(this.props.onChange){
            this.props.onChange(moment(value,'YYYY-MM-DD'));
          }
        }
        
      }

      return (
        <DatePicker
          style={{width: '100%'}}
          format={format || 'YYYY-MM-DD'}
          disabledDate={disabledDate}
          placeholder={placeholder}
          value={values}
          onChange={onChange}
        />
      )
    }
  }
