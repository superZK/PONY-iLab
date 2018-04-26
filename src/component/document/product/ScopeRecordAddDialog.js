import React, {Component} from 'react';
import { Modal } from 'antd';
import BaseTable from '../../public/BaseTable';
import Setting from '../../../config/index';

export default class ScopeRecordAddDialog extends Component {
  render(){
    const { preparedRecord, onScopeRecordSubmitSuccess, onRecordCancel, resultRecordAdd, preparedAddRecord } = this.props;
    const recordTableSetting = Setting.ProductSetting.table.resultRecordStandard;

    const handleTablePrepare = (rows, rowKeys) => {
      preparedRecord(rows, rowKeys);
    }

    const handleSubmit = () => {
      let recordIdArr = [];
      let removeIds = preparedAddRecord.map((item) => {
        recordIdArr.push(item.id);
        });
      onScopeRecordSubmitSuccess(recordIdArr);
    }

    const handleCancel = (e)  => {
      e.preventDefault();
      onRecordCancel();
    }

    return(
      <Modal
        width = '1200px'
        title = '新增结果记录标准'
        visible = {this.props.visible}
        onOk = {handleSubmit}
        onCancel = {handleCancel} >
      <BaseTable
        options={ {pagination:{pageSize:5, showQuickJumper:true,}} }
        onPrepare={handleTablePrepare}
        isExpanded={true}
        setting={recordTableSetting}
        data={resultRecordAdd ? resultRecordAdd : []}
      />
      </Modal>
    );
  }
}
