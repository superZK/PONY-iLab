import React, {Component} from 'react';
import { Modal } from 'antd';
import BaseForm from '../../public/BaseForm';
import Setting from '../../../config/index';

export default class ResultRecordEditDialog extends Component {
  render(){
    const { onFormSubmit, onRecordCancel, editRecordItem } = this.props;
    const recordFormSetting = Setting.ProductSetting.form.resultRecordStandard;

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
      onRecordCancel();
    }

    return(
      <Modal
      style={{top:40}}
      width={'1200px'}
      title={`编辑结果记录标准`}
      visible={this.props.visible}
      footer={null}
      onCancel={handleCancel} >
      <BaseForm
        colNum = {'1'}
        editObject = {editRecordItem}
        setting = {recordFormSetting}
        onFormSubmitSuccess = {handleFormSubmitSuccess}
        onFormSubmitFail = {handleFormSubmitFail}
        onCancel = {handleCancel}
        visible = {this.props.visible}
      />
    </Modal>
    );
  }
}
