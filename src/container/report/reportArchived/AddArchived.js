import React, {Component} from 'react';
import {Modal, message} from 'antd';
import BaseTable from "../../../component/public/BaseTable";
import ReportArchivedSetting from './column';
import AddArchiveForm from './AddArchiveForm';
import { unique, uniqueObj } from '../../../util/treeUtils';

export default class AddArchived extends Component{
  render() {
    const {
      visible,
      onCancel,
      onFormSubmit,//确认action
      reportTableRows,
      reportTableRowKeys,
      reportNumber,//扫描 报告action
      reportNumData,//扫描出的内容
    } = this.props;

    const ArchiveSetting = ReportArchivedSetting.table.archive;

    const handleSubmitSuccess = () => {
      let values = this.refs.addArchivedForm.getFieldsValue();
      if(values.reportContainerTypeId === '') {
        return message.error('请选择存放分类')
      }
      if(values.locationId === '') {
        return message.error('请选择存放位置')
      }
      if(values.reportContainerTypeId !== '' && values.locationId !== '') {
        (reportTableRows.length > 0) && reportTableRows.map(item => {
          if(!(item.location === null || item.location === undefined || item.location === '')) {
            if(item.id) {
              const filterData = unique(reportTableRowKeys).filter(v => v+'' !== item.id+'');
              onFormSubmit(values.reportContainerTypeId, values.locationId, filterData);
            }
          } else {
            onFormSubmit(values.reportContainerTypeId, values.locationId, unique(reportTableRowKeys))
          }
        })
      }
    }

    // 扫描数据 push
    (reportNumData.length > 0) && reportNumData.map(item => {
      if(item && item !== null) {
        reportTableRows.push(item);
        reportTableRowKeys.push(item.id + '');
      }
    });
    // 数组去重
    (reportTableRows && reportTableRows.length > 0) ? uniqueObj(reportTableRows, 'id') : '';
    (reportTableRowKeys && reportTableRowKeys.length > 0) ? unique(reportTableRowKeys) : '';

    // 配置editObject 数据
    const editObject = [];
    (reportTableRows.length > 0) && reportTableRows.map(item => {
      if(!(item.location === null || item.location === undefined || item.location === '')) {
        if(item.id) {
          const filterData = unique(reportTableRowKeys).filter(v => v+'' !== item.id+'');
          console.log(filterData);
        }
      } else {
        editObject.normalStatus = unique(reportTableRowKeys).length || 0;
      }
    })

    return (
      <Modal
        style={{top:40}}
        width={'1200px'}
        title={'报告归档'}
        visible={visible}
        onOk={handleSubmitSuccess}
        onCancel={() => onCancel()} >
        <div className="panel panel-info" style={{margin:0}}>
          <div className="panel-heading" >
            <AddArchiveForm
              ref='addArchivedForm'
              reportNumber={reportNumber}
              // onFormSubmitSuccess={handleSubmitSuccess}
              item={editObject} />
          </div>
          <div style={{margin: '10px auto'}}>
            <BaseTable
              options={ {pagination:{pageSize:10, showQuickJumper:true,}} }
              hideRowSelection
              isExpanded={false}
              setting={ArchiveSetting}
              data={reportTableRows}
             />
          </div>
        </div>
      </Modal>
    )
  }
}
