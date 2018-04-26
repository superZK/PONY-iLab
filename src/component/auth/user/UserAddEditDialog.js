import React, { Component } from 'react';
import { Modal } from 'antd';
import SearchableSelector from '../../public/SearchableSelector';
import BaseForm from '../../public/BaseForm';
import Setting from '../../../config/index';


export default class UserAddEditDialog extends Component {
  state = {
    formSiteId: '',
  }

  render() {
    const { formSiteId } = this.state;
    const { onFormSubmit, onFormCancel, editItem, editType, } = this.props;

    // 获取select选中的siteId（注意函数声明变量提升）
    const handleSiteChange = (value) => {
      this.setState({
        formSiteId: value || '',
      });
    }

    // 设置form配置，并更换为正确的组件
    const formSetting = Setting.UserSetting.form.AddEditUser;
    let userFormSetting = formSetting;
    let siteSearchSelect = {
    component:<SearchableSelector
      options={{allowClear:true}}
      onChange={handleSiteChange}
      disabled={false}
      lazyMode={false}
      url='/org/site/select' />
    }
    let deptSearchSelect = {
    component:<SearchableSelector
      options={{allowClear:true}}
      disabled={false}
      lazyMode={false}
      url={formSiteId ? '/org/dept/select/?siteId=' + formSiteId : '/org/dept/select'} />
    }
    userFormSetting.items[0].component = siteSearchSelect.component;
    userFormSetting.items[1].component = deptSearchSelect.component;

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
        style={{top:50}}
        title={`用户信息${this.props.editType}`}
        visible={this.props.visible}
        footer={null}
        onCancel={handleCancel} >
        <BaseForm
          colNum = {'3'}
          editObject = {editItem}
          setting = {userFormSetting}
          onFormSubmitSuccess = {handleFormSubmitSuccess}
          onFormSubmitFail = {handleFormSubmitFail}
          onCancel = {handleCancel}
          visible = {this.props.visible}
        />
      </Modal>
    );
  }
}

