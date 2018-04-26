import React, {Component} from 'react';
import { Modal } from 'antd';
import Setting from '../../../config/index';
import BaseForm from '../../public/BaseForm';

export default class TestStandardAddEditDialog extends Component {
  render(){
    const { onFormSubmit, onFormCancel, editItem } = this.props;
    const testStandardFormSetting = Setting.TestStandardSetting.form.testStandard;

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
        width={'1200px'}
        title={`检测标准${this.props.editType}`}
        visible={this.props.visible}
        footer={null}
        onCancel={handleCancel} >
        <BaseForm
          colNum = {'1'}
          editObject = {editItem}
          setting = {testStandardFormSetting}
          onFormSubmitSuccess = {handleFormSubmitSuccess}
          onFormSubmitFail = {handleFormSubmitFail}
          onCancel = {handleCancel}
          visible = {this.props.visible}
        />
      </Modal>
    );
  }
}
