import React, {Component} from 'react';
import {Modal} from 'antd';
import BaseForm from "../../../component/public/BaseForm";
import StoreSetting from './column';

export default class ReceiveStore extends Component{
  render() {
    const {
      visible,
      editType,
      onCancel,
      storeReceive,// 物料领用 action
      storesClick,
    } = this.props;

    const materalInfoForm = StoreSetting.form.materalInfoForm;
    const materalReceiveForm = StoreSetting.form.materalReceiveForm;


    const handleSubmitSuccess = (values) => {
      console.log(values);
      // storeReceive
    }

    // 更改 editObject 数据结构
    storesClick.code = storesClick.info && storesClick.info.code;
    storesClick.name = storesClick.info && storesClick.info.name;

    return (
      <Modal
        style={{top:40}}
        width={'600px'}
        title={editType}
        visible={visible}
        // footer={null}
        onOk={handleSubmitSuccess}
        onCancel={() => onCancel()} >
        <div className="panel panel-info" style={{margin:0}}>
          <div className="panel-heading" >
            <p style={{color: 'black', width: 50, margin: '5px auto 10px'}}>物料信息</p>
            <BaseForm
              setting = {materalInfoForm}
              visible={visible}
              // colNum = {'1.5'}
              footerRule = {'确认'}
              submitTitleClass = {{display:'none'}}
              editObject={storesClick}
            />
            <p style={{color: 'black', width: 50, margin: '5px auto 10px'}}>领用信息</p>
            <BaseForm
              setting = {materalReceiveForm}
              // colNum = {'1.5'}
              footerRule = {'确认'}
              submitTitleClass = {{display:'none'}}
              // editObject={editReceive}
            />
          </div>
        </div>
      </Modal>
    )
  }
}
