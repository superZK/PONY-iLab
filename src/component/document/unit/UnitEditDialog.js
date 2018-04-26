import React, {Component} from 'react';
import { Modal } from 'antd';
import BaseForm from '../../public/BaseForm';
import Setting from '../../../config/index';

export default class UnitEditDialog extends Component {
  render(){
    const { onFormSubmit, onFormCancel, editUnit } = this.props;

    const unitFormSetting = Setting.UnitSetting.form.unit;
    
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
        title={`度量单位${this.props.editType}`}
        visible={this.props.visible}
        footer={null}
        onCancel={handleCancel} >
        <BaseForm
          colNum = {'3'}
          editObject = {editUnit}
          setting = {unitFormSetting}
          onFormSubmitSuccess = {handleFormSubmitSuccess}
          onFormSubmitFail = {handleFormSubmitFail}
          onCancel = {handleCancel}
          visible = {this.props.visible}
        />
      </Modal>
    );
  }
}
