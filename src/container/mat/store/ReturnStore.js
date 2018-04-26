import React, {Component} from 'react';
import {Modal} from 'antd';
import BaseForm from "../../../component/public/BaseForm";
import StoreSetting from './column';

export default class ReturnStore extends Component{
  render() {
    const {
      visible,
      editType,
      onCancel,
      storesClick,
    } = this.props;

    const materalInfoForm = StoreSetting.form.materalInfoForm;
    const materalReturnForm = StoreSetting.form.materalReturnForm;


    const handleSubmitSuccess = (values) => {
      console.log(values);
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
              footerRule = {'确认'}
              submitTitleClass = {{display:'none'}}
              editObject={storesClick}
            />
            <p style={{color: 'black', width: 50, margin: '5px auto 10px'}}>归还信息</p>
            <BaseForm
              setting = {materalReturnForm}
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
