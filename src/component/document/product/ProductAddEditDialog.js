import React, {Component} from 'react';
import { Modal } from 'antd';
import BaseForm from '../../public/BaseForm';
import Setting from '../../../config/index';

export default class ProductAddEditDialog extends Component {
  render(){
    const { onFormSubmit, onFormCancel, editItem } = this.props;
    const productFormSetting = Setting.ProductSetting.form.product;

    // 表单发送请求成功与失败
    const handleFormSubmitSuccess = (value) => {
      onFormSubmit(value);
    };

    const handleFormSubmitFail = (err, values) => {
      console.log(err);
      console.log(values);
    };

    const handleCancel = (e)  => {
      e.preventDefault();
      onFormCancel();
    }

    return(
      <Modal
        style={{top:50}}
        title = {`产品${this.props.editType}`}
        visible = {this.props.visible}
        footer={null}
        onCancel = {handleCancel} >
        <BaseForm
          colNum = {'3'}
          editObject = {editItem}
          setting = {productFormSetting}
          onFormSubmitSuccess = {handleFormSubmitSuccess}
          onFormSubmitFail = {handleFormSubmitFail}
          onCancel = {handleCancel}
          visible = {this.props.visible}
        />
      </Modal>
    );
  }
}

