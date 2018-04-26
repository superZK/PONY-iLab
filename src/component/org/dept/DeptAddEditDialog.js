import React, {Component} from 'react';
import { Modal, Input } from 'antd';
import BaseForm from '../../public/BaseForm';
import Setting from '../../../config/index';
import SearchableSelector from '../../../component/public/SearchableSelector';

export default class DeptAddEditDialog extends Component {
  render() {
    const { onFormSubmit, onFormCancel, editItem, defaultSite, siteName } = this.props;
    const deptFormSetting = Setting.DeptSetting.form.Dept;

    // 表单发送请求成功与失败
    const handleFormSubmitSuccess = (value) => {
      onFormSubmit(value);
    };

    const handleFormSubmitFail = (err, values) => {
      console.log(err);
      console.log(values);
    };

    const handleCancel = (e) => {
      e.preventDefault();
      onFormCancel();
    }

    return (
      <Modal
        style={{top:40}}
        title={`部门${this.props.editType}`}
        visible={this.props.visible}
        footer={null}
        onCancel={handleCancel} >
        <div style={{marginLeft: 85, marginBottom:33}}>
          <label>组织：</label><Input disabled value={siteName} style={{width: 284, height:32}}/>
        </div>
        <BaseForm
          colNum = {'3'}
          editObject = {editItem}
          setting = {deptFormSetting}
          onFormSubmitSuccess = {handleFormSubmitSuccess}
          onFormSubmitFail = {handleFormSubmitFail}
          onCancel = {handleCancel}
          visible = {this.props.visible}
        />
      </Modal>
    );
  }
}

