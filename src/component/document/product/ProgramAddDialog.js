import React, {Component} from 'react';
import { Modal } from 'antd';
import BaseForm from '../../public/BaseForm';
import SearchableSelector from '../../public/SearchableSelector';
import Setting from '../../../config/index';

export default class ProgramAddDialog extends Component {
  render(){
    const { onFormSubmit, onRecordCancel, editRecordItem, editType } = this.props;
    const testProgramFormSetting = Setting.ProductSetting.form.testProgram;
    testProgramFormSetting.items[1] = editRecordItem && editRecordItem.testPlanName === '全项' && editType === '编辑检测方案' ?
    {key: 'productGradeId', label: '检测等级', component: (
      <SearchableSelector
        options={{allowClear:true}}
        disabled={true}
        lazyMode={false}
        url='/doc/categories/select/1012' />), rules: []} :
    {key: 'productGradeId', label: '检测等级', component: (
      <SearchableSelector
        options={{allowClear:true}}
        disabled={false}
        lazyMode={false}
        url='/doc/categories/select/1012' />), rules: [{required: true, message: '检测等级不能为空'}]};

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

    if(editRecordItem && editRecordItem !== 'undefined') {
      editRecordItem.testPlanId = editRecordItem.testPlan && editRecordItem.testPlan.id;
      editRecordItem.productGradeId = editRecordItem.productGrade && editRecordItem.productGrade.id;
    }

    return(
      <Modal
        width={'800px'}
        title={`${this.props.editType}`}
        visible = {this.props.visible}
        footer={null}
        onCancel = {handleCancel} >
        <BaseForm
          colNum = {'1.5'}
          editObject = {editRecordItem}
          setting = {testProgramFormSetting}
          onFormSubmitSuccess = {handleFormSubmitSuccess}
          onFormSubmitFail = {handleFormSubmitFail}
          onCancel = {handleCancel}
          visible = {this.props.visible}
        />
      </Modal>
    );
  }
}
