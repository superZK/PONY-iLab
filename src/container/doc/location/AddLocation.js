import React, {Component} from 'react';
import {Modal, message} from 'antd';
import BaseForm from "../../../component/public/BaseForm";
import LocationManageSetting from './column'

export default class AddLocation extends Component{
  render() {
    const {
      visible,
      editType,
      onCancel,
      onFormSubmit,
      prepareItems,//选中树列表 数据
      defauleSiteId,//组织id
      locationRows,//表格选中项 数据
    } = this.props;

    const locationSetting = LocationManageSetting.form.locationForm;
    const handleSubmitSuccess = (values) => {
      if(editType === '编辑') {
        values.id = locationRows && locationRows.id
      }
      if(values.siteId === '' || values.siteId === undefined) {
        return message.error('请选择组织')
      } else {
        onFormSubmit(values, editType, prepareItems.id, values.siteId, values.typeId)
      }
    }
    // 配置editObject 数据
    const item = [];
    item.siteId = defauleSiteId;
    item.sid = prepareItems && prepareItems.locationName;
    item.code = locationRows && locationRows.code;
    item.locationName = locationRows && locationRows.locationName;
    item.typeId = locationRows && locationRows.locationTypeId;
    item.describe = locationRows && locationRows.describe;
    item.id = locationRows && locationRows.id;
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
              setting = {locationSetting}
              visible={visible}
              onFormSubmitSuccess = {handleSubmitSuccess}
              footerRule = {'确认'}
              editObject={item}
            />
          </div>
        </div>
      </Modal>
    )
  }
}
