import React, {Component} from 'react';
import {Modal} from 'antd';
import BaseForm from "../../../component/public/BaseForm";
import ReportSentSetting from './column';

export default class DeliveryReport extends Component{
  render() {
    const {
      visible,
      onCancel,
      sentForm,            // 外层表单穿进来的value
      account,             // 获取用户名
      reportSentVerify,    // 交付 验证接口
      reportTableRowKeys,  // 列表key
    } = this.props;

    const deliveryReport = ReportSentSetting.form.deliveryReport;

    const handleSubmitSuccess = (value) => {
      const v = sentForm.getFieldsValue();
      v.remark = value.remark;
      v.compileList = reportTableRowKeys;
      reportSentVerify(value, v)
    }
    // 组织editObject 数据
    const userN = [];
    userN.account = account;

    return (
      <Modal
        style={{top:40}}
        width={'600px'}
        title={'交付报告'}
        visible={visible}
        footer={null}
        onCancel={() => onCancel()} >
        <div className="panel panel-info" style={{margin:0}}>
          <div className="panel-heading" >
            <BaseForm
              setting = {deliveryReport}
              visible={visible}
              onFormSubmitSuccess={handleSubmitSuccess}
              footerRule = {'确认'}
              editObject={userN}
            />
          </div>
        </div>
      </Modal>
    )
  }
}
