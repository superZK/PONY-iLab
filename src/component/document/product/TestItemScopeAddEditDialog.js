import React, {Component} from 'react';
import { Modal } from 'antd';
import BaseForm from '../../public/BaseForm';
import Setting from '../../../config/index';
import { AddKeyForData } from '../../../util/treeUtils';

export default class TestItemScopeAddEditDialog extends Component {

  render(){
    const { onFormSubmit, onFormCancel, editItem, testProgram, editType } = this.props;
    const productTestFlowFormSetting = Setting.ProductSetting.form.productTestFlow;
    const productTestItemFormSetting = Setting.ProductSetting.form.productTestItem;
    const setting = this.props.editType === '编辑' ? productTestItemFormSetting : productTestFlowFormSetting;

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
        width = {'1200'}
        title={`${this.props.editType}检测项目`}
        visible={this.props.visible}
        footer={null}
        onCancel={handleCancel} >
        <BaseForm
            colNum = {'1.5'}
            editObject = {editItem}
            setting = {setting}
            onFormSubmitSuccess = {handleFormSubmitSuccess}
            onFormSubmitFail = {handleFormSubmitFail}
            onCancel = {handleCancel}
            visible = {this.props.visible}
          />
      </Modal>
    );
  }
}
