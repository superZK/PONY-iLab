import React, {Component} from 'react';
import { Modal } from 'antd';
import BaseForm from "../../../component/public/BaseForm";
import OrderEntrySetting from './OrderEntryConf';

export default class SampleAddDialog extends Component {
  // componentWillUpdate(){
  //   if(this.refs.addSample)
  //   console.log(this.refs.addSample.getFieldsValue());
  // }
  render(){
    const { onFormSubmit, onFormCancel } = this.props;
    const sampleFormSetting = OrderEntrySetting.form.sample;

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
        title={'新增样品'}
        visible={this.props.visible}
        footer={null}
        onCancel={handleCancel} >
        <BaseForm
          ref = 'addSample'
          colNum = {'1.5'}
          setting = {sampleFormSetting}
          onFormSubmitSuccess = {handleFormSubmitSuccess}
          onFormSubmitFail = {handleFormSubmitFail}
          onCancel = {handleCancel}
          visible = {this.props.visible}
        />
      </Modal>
    );
  }
}
