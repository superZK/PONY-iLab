import React, {Component} from 'react';
import {Modal, Row, Col } from 'antd';
import BaseForm from "../../../component/public/BaseForm";
import BaseTable from '../../../component/public/BaseTable';

import OfferSetting from './column';
import OfferTree from './OfferTree';

export default class AddItemOffer extends Component{
  render() {
    const {
      visible,
      editType,
      offerPAddItem,// addItem query product action
      addItemProduct,// addItem query product
      addItemUpProduct,//addItem 根据列表树 查询列表data
      offerPUpAddItem,//addItem 根据列表树 上级 查询列表
      offerPDownAddItem,//addItem 根据列表树 子级 查询列表
      offerPSaveAddItem,//addItem product 新增报价单明细项
      offerPSaveRowsItem,//addItem product 列表rows,rowKeys
      addItemRowsList,//addItem product 列表rows
      addItemRowKeysList,// addItem product 列表rowKeys
      onCancel,
    } = this.props;

    const addItemFormSetting = OfferSetting.form.addItemForm;
    const addItemSetting = OfferSetting.table.addItemOffer;

    // onOk 确认
    const handleSubmitSuccess = (values) => {
      console.log(values);
      // if(editType === '编辑') {
      //   values.id = editObject && editObject.id;
      // } else if (editType === '升级版本') {
      //   offerPriceUpgrade(editObject && editObject.id);
      // }
      // offerPriceAdd(values, editType)
      offerPSaveAddItem(addItemRowKeysList.length > 0 ? addItemRowKeysList : '')
    }

    // form 确认
    const handleFormSubmitSuccess = (values) => {
      console.log(values);
      offerPAddItem(values);
    }

    const handlePrepare = (rows, rowKeys) => {
      offerPSaveRowsItem(rows, rowKeys);
    }

    return (
      <Modal
        style={{top:40}}
        width={'1200px'}
        title={editType}
        visible={visible}
        onOk={handleSubmitSuccess}
        onCancel={() => onCancel()} >
        <div className="panel panel-info" style={{margin:0}}>
          <div className="panel-heading" >
            <BaseForm
              setting = {addItemFormSetting}
              colNum={1}
              footerRule = {'确认'}
              onFormSubmitSuccess = {handleFormSubmitSuccess}
              // editObject={editObject}
            />
          </div>
          <div className="panel-body">
            <Row>
              <Col span={4}>
                <OfferTree
                  maxHeight = {50}
                  searchData={addItemProduct}
                  offerPUpAddItem={offerPUpAddItem}//addItem 根据列表树 上级 查询列表
                  offerPDownAddItem={offerPDownAddItem}//addItem 根据列表树 子级 查询列表
                />
              </Col>
              <Col span={20}>
                <BaseTable
                  options={ {pagination:{pageSize:5, showQuickJumper:true,}} }
                  isExpanded={false}
                  onPrepare={handlePrepare}
                  setting={addItemSetting}
                  data={addItemUpProduct}
                />
              </Col>
            </Row>
          </div>
        </div>
      </Modal>
    )
  }
}
