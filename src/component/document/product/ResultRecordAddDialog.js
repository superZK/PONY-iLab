import React, {Component} from 'react';
import { Modal } from 'antd';
import BaseTable from '../../public/BaseTable';
import Setting from '../../../config/index';

export default class ResultRecordAddDialog extends Component {
  render(){
    const { preparedRecord, onRecordSubmitSuccess, onRecordCancel, resultRecordAdd, preparedAddRecord, } = this.props;
    const recordTableSetting = Setting.ProductSetting.table.resultRecordStandard;

    const handleTablePrepare = (rows, rowKeys) => {
      preparedRecord(rows, rowKeys);
    }

    const handleSubmit = () => {
      let resultArr = [];
      let removeIds = preparedAddRecord.map((item) => {
        let obj = {};
        obj.resultRecordId = item.id;
        obj.resultTypeId = item.resultId;
        obj.roundRuleId = item.roundRuleId;
        obj.resultsFileId = item.resultsFileId;
        resultArr.push(obj);
        });
      onRecordSubmitSuccess(resultArr);
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
