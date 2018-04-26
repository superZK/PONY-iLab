import React, {Component} from 'react';
import fetchData from '../../../util/fetchGateway';
import Setting from '../../../config/index';
import AdvancedTable from '../../public/Table/AdvancedTable';
import { Modal } from 'antd';


export default class TestMethodOldVersion extends Component {
  state = { methodLinkedTestItems: [] }
  render(){
    const { onConfirm, onCancel, dataSource } = this.props;
    const { methodLinkedTestItems } = this.state;
    const methodTableSetting = Setting.TestMethodSetting.table.testMethod;
    const testItemTableSetting = Setting.TestItemSetting.table.testItem;

    const getTestItems = (MethodId) => {
      let url = '/doc/testmethod/query/testitem/' + MethodId;
      fetchData(url, {}).then(
        (receipt) => {
          this.setState({
            methodLinkedTestItems: receipt.data,
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
        title = '查看检测方法所有版本'
        visible = {this.props.visible}
        onOk = {handleSubmit}
        onCancel = {handleCancel} >
      <AdvancedTable
        mode={'Simple'}
        pagination={{pageSize:5, showQuickJumper:true}}
        onSelect={handleTableSelect}
        isExpanded={true}
        setting={methodTableSetting}
        data={dataSource}
      />
      <AdvancedTable
        mode={'Simple'}
        pagination={{pageSize:5, showQuickJumper:true}}
        isExpanded={true}
        setting={testItemTableSetting}
        data={methodLinkedTestItems ? methodLinkedTestItems : []}
      />
      </Modal>
    );
  }
}
