import React, { Component } from 'react';
import { Modal } from 'antd';
import BaseForm from '../../public/BaseForm';
import Setting from '../../../config/index';


export default class UserForbidDialog extends Component {

  render() {
    const { onFormSubmit, onFormCancel, editUser, editType } = this.props;

    const forbidFormSetting = Setting.UserSetting.form.ForbidUser;// 设置form配置
    const allowFormSetting = {
			submitTitle: '确认',
			items: [],
		}

    // 表单发送请求成功与失败
    const handleFormSubmitSuccess = (value) => {
      onFormSubmit(value);
    };

    const handleFormSubmitFail = (err, values) => {
      console.log(err);
      console.log(values);
    };

    // modal与form取消
    const handleCancel = (e) => {
      e.preventDefault();
      onFormCancel();
    }

    return (
      <Modal
        title={`用户${this.props.editType}`}
        visible={this.props.visible}
        footer={null}
        onCancel={handleCancel} >
        <BaseForm
          colNum = {'3'}
          editObject = {editUser}
          setting = {this.props.editType === '锁定' ? forbidFormSetting : allowFormSetting}
          onFormSubmitSuccess = {handleFormSubmitSuccess}
          onFormSubmitFail = {handleFormSubmitFail}
          onCancel = {handleCancel}
          visible = {this.props.visible}
        />
      </Modal>
    );
  }
}

