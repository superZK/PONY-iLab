import React, {Component} from 'react';
import {Modal} from 'antd';
import BaseForm from "../../../component/public/BaseForm";
import SampleManagementSetting from './column'
import moment from 'moment';

export default class AddSampling extends Component{
  render() {
    const {
      visible,
      onCancel,
      onFormSubmit,
      editType,
      editRows,//选中的select[0]
      sampleClick,//表格点击项
    } = this.props;

    const sampleFormSetting = SampleManagementSetting.form.samplingForm;
    const handleSubmitSuccess = (values) => {
      values.operateDate ? moment(values.operateDate).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD')
      if(editType === '编辑') {
        values.id = (editRows && editRows.id) ? editRows.id : sampleClick.id;
      }
      onFormSubmit(values, editType)
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
              colNum={3}
              setting={sampleFormSetting}
              visible={visible}
              onFormSubmitSuccess={handleSubmitSuccess}
              footerRule={'确认'}
              editObject={editRows || sampleClick}
            />
          </div>
        </div>
      </Modal>
    )
  }
}
