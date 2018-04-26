import React, {Component} from 'react';
import { Modal } from 'antd';
import BaseForm from '../../public/BaseForm';
import Setting from '../../../config/index';

export default class TestItemsEditDialog extends Component {

  render(){
    const { onFormSubmit, onFormCancel, editItem } = this.props;
    const testItemFormSetting = Setting.TestItemSetting.form.testItem;

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
        width={'1300px'}
        title={`检测项目${this.props.editType}`}
        visible={this.props.visible}
        footer={null}
        onCancel={handleCancel} >
        <BaseForm
          colNum = {'1'}
          editObject = {editItem}
          setting = {testItemFormSetting}
          onFormSubmitSuccess = {handleFormSubmitSuccess}
          onFormSubmitFail = {handleFormSubmitFail}
          onCancel = {handleCancel}
          visible = {this.props.visible}
        />
      </Modal>
    );
  }
}

