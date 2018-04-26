import React, {Component} from 'react';
import {Modal} from 'antd';
import BaseForm from "../../../component/public/BaseForm";
import ReportTemplateManageSetting from './column'

export default class AddReportTemplate extends Component{
  render() {
    const {
      visible,
      onCancel,
      onFormSubmit,
      editRows,                 // 选中的select[0]
      reportTemplateKey,        // 选中表格的key
      editType,
      currentReport,
    } = this.props;

    const reportFormSetting = ReportTemplateManageSetting.form.reportTemplate;
    const handleSubmitSuccess = (values) => {
      if(editType === '编辑报告模板') {
        values.id = editRows.id
      }
      onFormSubmit(values, editType, reportTemplateKey)
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
              setting = {reportFormSetting}
              visible={visible}
              onFormSubmitSuccess = {handleSubmitSuccess}
              footerRule = {'确认'}
              editObject={editRows || currentReport}
            />
          </div>
        </div>
      </Modal>
    )
  }
}
