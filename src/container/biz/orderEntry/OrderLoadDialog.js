import React, {Component} from 'react';
import OrderEntrySetting from './OrderEntryConf';
import BaseTable from "../../../component/public/BaseTable";
import { Modal } from 'antd';

export default class OrderLoadDialog extends Component {
  state = { orderObj: {} };
  render(){
    const { orderObj } = this.state;
    const { onConfirm, onCancel, dataSource } = this.props;
    const orderTitleTableSetting = OrderEntrySetting.table.orderTitle;

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
        title = '加载暂存订单'
        okText = '加载'
        visible = {this.props.visible}
        onOk = {handleSubmit}
        onCancel = {handleCancel} >
      <BaseTable
        type = 'radio'
        options={ {pagination:{pageSize:5, showQuickJumper:true,}} }
        isExpanded={false}
        onPrepare={handleTableSelect}
        setting={orderTitleTableSetting}
        data={dataSource}
      />
      </Modal>
    );
  }
}

