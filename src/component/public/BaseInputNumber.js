import React, { Component } from 'react';
import { InputNumber, Tooltip } from 'antd';

export default class BaseInputNumber extends Component {

  // max 最大值
  // min 最小值
  // measUnitName 制定输入框展示的格式 (暂不使用)
  // step 每次改变步数的大小，可以是小数
  // onChange
  // value

  constructor(props){
    super(props);
    this.state = {
      values: this.props.value || '',
      visibel: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== undefined) {
      this.setState({
        visibel: true,
        values: nextProps.value
      })
    }
  }

  render() {
    const {max, min, step} = this.props
    const {values, visibel} = this.state

    const onChange = (value) => {
      this.setState({values: value});
      if(this.props.onChange) {
        this.props.onChange(value)
      }
    }

    // 取消焦点事件
    const onBlur = () => {
      if (this.props.onBlur)
        this.props.onBlur(values)
    }

    // Tooltip的text文本
    const text = <span>{'请输入' + min + '-' + max + '之间的数值'}</span>

    // 输入框展示值的格式
    // const renderFormatter = (value) => {
    //   if (this.props.measUnitName) {
    //     return `${value}${this.props.measUnitName}`
    //   }
    // }

    return (
      <Tooltip
        placement="top"
        title={text}
        visibel={visibel}
        autoAdjustOverflow
        trigger='focus'>
        <InputNumber
          {...this.props}
          {...this.state}
          value={values}
          onChange={onChange}
          onBlur={onBlur}
          // formatter={renderFormatter}   // 输入框展示值的格式
          step={step}             // 每步改变的大小
          // defaultValue={min}      // 默认的value
          min={min}               // 最小值
          max={max} />
      </Tooltip>
    )
  }
}
