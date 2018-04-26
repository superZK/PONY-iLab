/**
 * Created by Z.K. on 2018/4/12.
 */
import React, { Component } from 'react';
import { Popover, Button, Icon } from 'antd';
import './index.css';

/**
 * 表格行操作组件
 * props {
 *   trigger:         触发行为，可选 hover/focus/click(默认)   String
 *   overlayStyle:    卡片样式
 *   placement:       气泡框位置(可选项参照antd)
 *   title:           卡片标题
 *   buttonName:      按钮标题
 *   operating:       操作项数组  [{name:'新增', icon:<Icon type="edit" className='IconL' />, handler(){console.log('handler')}},{},{}]   (icon可选)
 * }
 */

export default class OperationPanel extends Component {
  constructor(props){
    super(props);
  }

  render(){
    const operatingRender = (operatings) => {
      let operatingArr = [];
      operatingArr = operatings.map((item) => {
        if(item.icon){
          return (<a className='blockA' onClick={item.handler}>{item.name}{item.icon}</a>);
        }else{
          return (<a className='blockA' onClick={item.handler}>{item.name}</a>);
        }
      });
      return (
        <div>
          {[...operatingArr]}
        </div>
      )
    }

    return(
      <Popover
        getPopupContainer={this.props.getPopupContainer || null}
        trigger={this.props.trigger || 'click'}
        overlayStyle={this.props.overlayStyle || {width: 200, zIndex: 100}}
        placement={this.props.placement || 'top'}
        content={operatingRender(this.props.operating)}
        title={this.props.title || '操作盘'}
      >
        <Button ref='button' size='small' type="primary">
          {this.props.buttonName || '操作'}
        </Button>
      </Popover>
    );
  }
}