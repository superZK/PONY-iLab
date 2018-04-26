import React, {Component} from 'react';
import { Modal } from 'antd';


export default class TransformUnitAddDialog extends Component {
  render(){
    const { onTransformAdd, onTransformAddCancel } = this.props;

    const handleSubmit = (e) => {
      e.preventDefault();
      onTransformAdd();
    }

    const handleCancel = (e)  => {
      e.preventDefault();
      onTransformAddCancel();
    }

    return(
      <Modal
        title = '新增全部度量单位转换关系'
        visible = {this.props.visible}
        onOk = {handleSubmit}
        onCancel = {handleCancel} >
        <p>确认要为当前度量单位新增全部转换关系？</p>
      </Modal>
    );
  }
}
