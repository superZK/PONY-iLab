import React, {Component} from 'react';
import { Tooltip, Button } from 'antd';

export default class TooltipSpan extends Component {
  render(){
    const {
      spanClass,
      data,
      mouseEnterDelay,
      longNum,
    } = this.props;

    const dataLength = (data || []).length;
    const longNums = longNum || 15;
    const isLongSpan = dataLength > longNums;

    return(
      <Tooltip mouseEnterDelay={mouseEnterDelay}  placement="topRight" title={data}>
        <span style={spanClass ? spanClass : {width: '200px',  float: 'right', border: '1px solid #ccc', borderRadius:'4px', marginRight: '10px', textAlign: 'center', height: '19px' }}>{isLongSpan && data ? `${data.slice(0, longNums)}...` : data}</span>
      </Tooltip>
    );
  }
}
