import React, {Component} from 'react';
import { Modal } from 'antd';
import Setting from '../../../config/index';
import BaseForm from '../../public/BaseForm';


export default class ResultRecordEditDialog extends Component {

  render(){
    const { onFormSubmit, onFormCancel, editingRecordItem } = this.props;
    const resultRecordFormSetting = Setting.TestItemSetting.form.resultRecord;

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
        style={{top:40}}
        width={'1200px'}
        title={`${this.props.editType}`}
        visible={this.props.visible}
        footer={null}
        onCancel={handleCancel} >
        <BaseForm
          colNum = {'1'}
          editObject = {editingRecordItem}
          setting = {resultRecordFormSetting}
          onFormSubmitSuccess = {handleFormSubmitSuccess}
          onFormSubmitFail = {handleFormSubmitFail}
          onCancel = {handleCancel}
          visible = {this.props.visible}
        />
      </Modal>
    );
  }
}