import React, {Component} from 'react';
import { Modal } from 'antd';
import BaseForm from "../../../component/public/BaseForm";
import SearchableSelector from '../../../component/public/SearchableSelector';
import QualificationManageSetting from './column';
import moment from 'moment';
import { analysisDataIndex } from '../../../util/treeUtils';

export default class AddQualification extends Component{
  state = {
    siteId: '',
  }

  render() {
    const {
      siteId,
    } = this.state;

    const {
      visible,
      onCancel,
      onEndSubmit,
      editObject,
    } = this.props;

    const editSiteId = analysisDataIndex(editObject, 'dept.site.id') ? analysisDataIndex(editObject, 'dept.site.id') : '';

    const siteSelect = {key: 'dept.site.id', label: '组织', component: (
      <SearchableSelector
        options={{allowClear:true}}
        disabled={true}
        lazyMode={false}
        url='/org/site/select' />
    ), rules: []};

    const deptSelect = {key: 'dept.id', label: '部门', component: (
      <SearchableSelector
        options={{allowClear:true}}
        disabled={true}
        lazyMode={false}
        url={`/org/dept/select/506501?siteId=${editSiteId}&`} />
    ), rules: []};

    const qualifySetting = QualificationManageSetting.form.editQualify;
    qualifySetting.items[0] = siteSelect;
    qualifySetting.items[1] = deptSelect;

    let editObject1 = editObject || {};
    if(editObject1) {
      editObject1.qualificationTypeId = editObject1.qualificationType && editObject1.qualificationType.id + '';
      editObject1.siteId = editObject1.site && editObject1.site.id +'';
      editObject1.effectDate = moment(editObject1.effectDate).format('YYYY-MM-DD');
      editObject1.expiryDate = moment(editObject1.expiryDate).format('YYYY-MM-DD');
    } else {
      editObject1.qualificationTypeId = '';
      editObject1.siteId = ''
      editObject1.effectDate = '';
      editObject1.expiryDate = '';
    }

    // 表单发送请求成功与失败
    const handleSubmitSuccess = (values) => {
      values.id = editObject.id;
      values.activation = editObject.activation;
      if ((values.qualificationTypeId).constructor == Array) {
        (values.qualificationTypeId).join('');
      }
      const deptId = analysisDataIndex(values, 'dept.id');
      onEndSubmit(values, deptId, values.qualificationTypeId, values.testMethodId, values.testItemId)
    }

    return (
      <Modal
        style={{top:40}}
        width={'600px'}
        title={'编辑资质'}
        footer={null}
        visible={visible}
        onCancel={() => onCancel()} >
        <div className="panel panel-info" style={{margin:0}}>
          <div className="panel-heading" style={{height: 400}}>
            <BaseForm
              ref = 'qualificationForm'
              setting = {qualifySetting}
              visible={visible}
              onFormSubmitSuccess = {handleSubmitSuccess}
              submitTitleClass = {{transform: 'translate(-25px, 35px)'}}
              footerRule = {'确认'}
              editObject={editObject1}
            />
          </div>
        </div>
      </Modal>
    )
  }
}
