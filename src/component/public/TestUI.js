import React, {Component} from 'react';
import { CSSTransitionGroup } from 'react-transition-group';
import {HotKeys} from 'react-hotkeys';
import { Modal, Form, Input, Radio, Row, Col, Button, Tag, Icon } from 'antd';
import AdvancedSelect from '../public/Reference/AdvancedSelect';
import BaseForm from './BaseForm';
import OperationPanel from '../public/OperationPanel/OperationPanel';
import Setting from '../../config';
const keyMap = {
  'moveUp': 'w',
};
const { TestUISetting } = Setting;

class TestUI extends Component{
  render(){
    const handlers = {
      'moveUp': (event) => console.log('Move up hotkey called!')
    }
    return (
      <HotKeys keyMap={keyMap} handlers={handlers}>
        <OperationPanel
          operating={[{name:'新增',icon:<Icon type="edit" className='IconL' />,handler(){console.log('handler')}},{name:'编辑',icon:<Icon type="edit" className='IconL' />,handler(){console.log('handler')}},{name:'删除',handler(){console.log('handler')}}]}
          onClick={() => {alert('点击了')}}
        />
      </HotKeys>
    );
  }

}
export default Form.create()(TestUI);
