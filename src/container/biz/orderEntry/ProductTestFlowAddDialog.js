import React, {Component} from 'react';
import OrderEntrySetting from './OrderEntryConf';
import BaseTable from "../../../component/public/BaseTable";
import { Modal } from 'antd';

export default class ProductTestFlowAddDialog extends Component {
  state = { orderObj: {} };
  render(){
    const { orderObj } = this.state;
    const { onConfirm, onCancel, dataSource } = this.props;
    const productTestFlowTableSetting = OrderEntrySetting.table.productTestFlow;

    // 获取表格单选项
    const handleTableSelect = (row, rowKey) => {
      this.setState({
        orderObj: row,
      });
    }

    const handleSubmit = (e) => {
      e.preventDefault();
      onConfirm(orderObj);
    }

    const handleCancel = (e)  => {
      e.preventDefault();
      onCancel();
    }

    return(
      <Modal
        width = '800px'
        title = '选择检测流程'
        visible = {this.props.visible}
        onOk = {handleSubmit}
        onCancel = {handleCancel} >
      <BaseTable
        options={ {pagination:{pageSize:5, showQuickJumper:true,}} }
        isExpanded={false}
        onPrepare={handleTableSelect}
        setting={productTestFlowTableSetting}
        data={dataSource}
      />
      </Modal>
    );
  }
}

