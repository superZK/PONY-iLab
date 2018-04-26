import React, {Component} from 'react';
import {Modal} from 'antd';
import BaseForm from "../../../component/public/BaseForm";

export default class AddOfferPrice extends Component{
  render() {
    const {
      visible,
      editType,
      onCancel,
      offerPriceAdd,// add action
      editObject,
      offerPriceUpgrade,// 升版 action
      addOfferPriceForm,
    } = this.props;

    const handleSubmitSuccess = (values) => {
      if(editType === '编辑') {
        values.id = editObject && editObject.id;
      } else if (editType === '升级版本') {
        offerPriceUpgrade(editObject && editObject.id);
      }
      offerPriceAdd(values, editType)
    }

    return (
      <Modal
        style={{top:40}}
        width={'600px'}
        title={editType}
        visible={visible}
        footer={null}
        onCancel={() => onCancel()} >
        <div className="panel panel-info" style={{margin:0}}>
          <div className="panel-heading" >
            <BaseForm
              setting = {addOfferPriceForm}
              visible={visible}
              onFormSubmitSuccess = {handleSubmitSuccess}
              footerRule = {'确认'}
              editObject={editObject}
            />
          </div>
        </div>
      </Modal>
    )
  }
}
