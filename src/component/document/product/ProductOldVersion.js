import React, {Component} from 'react';
import { Modal } from 'antd';
import BaseTable from '../../public/BaseTable';
import AdvancedTable from '../../public/Table/AdvancedTable';
import Setting from '../../../config/index';

export default class ProductOldVersion extends Component {
  state = { currentItem: {} };
  render(){
    const { onConfirm, onCancel, dataSource } = this.props;
    const { currentItem } = this.state;
    const productTableSetting = Setting.ProductSetting.table.product;
    const programTableSetting = Setting.ProductSetting.table.testProgram;
    const productSearchSetting = Setting.ProductSetting.form.searchForm;

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
        title = '检测项目版本'
        visible = {this.props.visible}
        onOk = {handleSubmit}
        onCancel = {handleCancel} >
      <AdvancedTable
        mode={'Search'}
        pagination={{pageSize:5, showQuickJumper:true}}
        onSelect={onTableRowClick}
        onPrepare={false}
        isExpanded={false}
        setting={productTableSetting}
        data={dataSource}
        colNum={'1'}
        simpleSearchKey={[['名称','name'],['','nameEN'],['','testInvoicesName'], ['代码','code'], ['快捷码','shorthand'], ['同义词','synonyms']]}
        avancedSearchForm={productSearchSetting}
      />
      <BaseTable
        options={ {pagination:{pageSize:5, showQuickJumper:true,}} }
        isExpanded={false}
        setting={programTableSetting}
        data={currentItem ? currentItem.productTest : []}
      />
      </Modal>
    );
  }
}
