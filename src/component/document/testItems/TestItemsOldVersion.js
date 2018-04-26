import React, {Component} from 'react';
import Setting from '../../../config/index';
import AdvancedTable from '../../public/Table/AdvancedTable';
import { Modal } from 'antd';

export default class TestItemsOldVersion extends Component {
  state = { currentItem: {} };
  render(){
    const { onConfirm, onCancel, dataSource } = this.props;
    const { currentItem } = this.state;
    const testItemTableSetting = Setting.TestItemSetting.table.testItem;
    const recordTableSetting = Setting.TestItemSetting.table.resultRecord;

    // 结果项数据来源
    const onTableRowClick = (record) => {
      this.setState({
        currentItem: record,
      })
    }

    const handleSubmit = (e) => {
      e.preventDefault();
      onConfirm();
    }

    const handleCancel = (e)  => {
      e.preventDefault();
      onCancel();
    }

    return(
      <Modal
        width = '1200px'
        title = '查看检测项目所有版本'
        visible = {this.props.visible}
        onOk = {handleSubmit}
        onCancel = {handleCancel} >
        <AdvancedTable
          mode={'Simple'}
          pagination={{pageSize:5, showQuickJumper:true}}
          onSelect={onTableRowClick}
          isExpanded={true}
          setting={testItemTableSetting}
          data={dataSource}
        />
        <AdvancedTable
          mode={'Simple'}
          pagination={{pageSize:5, showQuickJumper:true}}
          isExpanded={true}
          setting={recordTableSetting}
          data={currentItem ? currentItem.resultRecordList : []}
        />
      </Modal>
    );
  }
}
