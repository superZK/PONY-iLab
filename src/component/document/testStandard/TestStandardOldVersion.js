import React, {Component} from 'react';
import fetchData from '../../../util/fetchGateway';
import Setting from '../../../config/index';
import BaseTable from '../../public/BaseTable';
import AdvancedTable from '../../public/Table/AdvancedTable';
import { Modal } from 'antd';

export default class TestStandardOldVersion extends Component {
  state = { standardLinkedTestItems: [] }
  render(){
    const { onConfirm, onCancel, dataSource } = this.props;
    const { standardLinkedTestItems } = this.state;
    const standardTableSetting = Setting.TestStandardSetting.table.testStandard;
    const testItemTableSetting = Setting.TestItemSetting.table.testItem;

    const getTestItems = (StandardId) => {
      let url = '/doc/teststandard/query/testitem/' + StandardId;
      fetchData(url, {}).then(
        (receipt) => {
          this.setState({
            standardLinkedTestItems: receipt.data,
          });
        },
        (error) => {
          console.log(error);
        }
      )
    }

    const handleTableSelect = (record) => {
      getTestItems(record.id);
    };

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
        title = '查看检测标准所有版本'
        visible = {this.props.visible}
        onOk = {handleSubmit}
        onCancel = {handleCancel} >
      <AdvancedTable
        mode={'Simple'}
        pagination={{pageSize:5, showQuickJumper:true}}
        onSelect={handleTableSelect}
        isExpanded={true}
        setting={standardTableSetting}
        data={dataSource}
      />
      <AdvancedTable
        mode={'Simple'}
        pagination={{pageSize:5, showQuickJumper:true}}
        onPrepare={false}
        isExpanded={true}
        setting={testItemTableSetting}
        data={standardLinkedTestItems ? standardLinkedTestItems : []}
      />
      </Modal>
    );
  }
}
