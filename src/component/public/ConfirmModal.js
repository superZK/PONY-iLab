import React, {Component} from 'react';
import { Modal } from 'antd';

export default class ConfirmModal extends Component {
  render(){
    const { onConfirm, onCancel, title, information } = this.props;

    const handleSubmit = (e) => {
      e.preventDefault();
      onConfirm();
    }

    const handleCancel = (e)  => {
      e.preventDefault();
      onCancel();
    }

    return(
      <Modal
        title = {title}
        visible = {this.props.visible}
        onOk = {handleSubmit}
        onCancel = {handleCancel}
      >
        <p style={{fontSize:13}}>{information}</p>
      </Modal>
    );
  }
}
