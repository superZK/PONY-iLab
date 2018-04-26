import React, {Component} from 'react';
import {Modal} from 'antd';
import BaseForm from "../../../component/public/BaseForm";
import ReportSentSetting from './column';

export default class UnDeliveryReport extends Component{
  render() {
    const {
      visible,
      onCancel,
      account,// 获取用户名
      reportDRowKeys,// 列表选中项
      unReportSentDelivery,// action确认
    } = this.props;

    const unDeliveryReport = ReportSentSetting.form.unDeliveryReport;

    const handleSubmitSuccess = (values) => {
      const remark = values.remark;
      unReportSentDelivery(remark, reportDRowKeys)
    }

    const userN = [];
    userN.account = account;

    return (
      <Modal
        style={{top:40}}
        width={'600px'}
        title={'取消交付'}
        visible={visible}
        footer={null}
        onCancel={() => onCancel()} >
        <div className="panel panel-info" style={{margin:0}}>
          <div className="panel-heading" >
            <BaseForm
              setting = {unDeliveryReport}
              visible={visible}
              onFormSubmitSuccess = {handleSubmitSuccess}
              footerRule = {'确认'}
              editObject={userN}
            />
          </div>
        </div>
      </Modal>
    )
  }
}
