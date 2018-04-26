import React, {Component} from 'react';
import {Modal, Button, Row, Col } from 'antd';
import BaseForm from "../../../component/public/BaseForm";
import BaseTable from '../../../component/public/BaseTable';
import SecurityButtonBox from '../../../component/public/SecurityButtonBox';

import OfferSetting from './column';
import AddItemOffer from './AddItemOffer';

export default class AddOffer extends Component{
  render() {
    const {
      visible,
      editType,
      handleType,
      addItemOffer,//addItem 弹框
      offerAddItem,//addItem action
      offerPAddItem,// addItem query product action
      addItemProduct,// addItem query product
      addItemUpProduct,//addItem 根据列表树 查询列表data
      offerPUpAddItem,//addItem 根据列表树 上级 查询列表
      offerPDownAddItem,//addItem 根据列表树 子级 查询列表
      offerPSaveAddItem,//addItem product 新增报价单明细项
      addItemSaveProduct,//addItem product 新增报价单明细项 data
      offerPSaveRowsItem,//addItem product 列表rows,rowKeys
      addItemRowsList,//addItem product 列表rows
      addItemRowKeysList,// addItem product 列表rowKeys
      onCancel,
      cancelHandleType,
    } = this.props;

    console.log(addItemRowsList, addItemRowKeysList);

    const addOfferSetting = OfferSetting.table.addOffer;
    const addFormSetting = OfferSetting.form.addForm;
    const addsFormSetting = OfferSetting.form.addsForm;

    const handleSubmitSuccess = (values) => {
      // if(editType === '编辑') {
      //   values.id = editObject && editObject.id;
      // } else if (editType === '升级版本') {
      //   offerPriceUpgrade(editObject && editObject.id);
      // }
      // offerPriceAdd(values, editType)
    }

    return (
      <div>
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
                setting = {addFormSetting}
                colNum={1}
                footerRule = {'null'}
                submitTitleClass = {{display:'none'}}
                // editObject={editObject}
              />
              <BaseForm
                setting = {addsFormSetting}
                colNum={1}
                footerRule = {'null'}
                submitTitleClass = {{display:'none'}}
                // editObject={editObject}
              />
            </div>
            <div className="panel-body">
              <Row>
                <Col span={19} offset={1}>
                  {/* <SecurityButtonBox> */}
                    <Button.Group>
                      <Button key={'biz.offer.management.addItem'} onClick={addItemOffer} icon="file-add" > 新增 </Button>
                      <Button key={'biz.offer.management.deleteItem'} icon="delete" > 删除 </Button>
                    </Button.Group>
                  {/* </SecurityButtonBox> */}
                </Col>
              </Row>
            </div>
            <BaseTable
              options={ {pagination:{pageSize:5, showQuickJumper:true,}} }
              isExpanded={false}
              onPrepare={false}
              setting={addOfferSetting}
              data={addItemSaveProduct}
            />
          </div>
        </Modal>
        <AddItemOffer
          editType = {handleType}
          visible = {handleType === '待选择项目'}
          offerPAddItem={offerPAddItem}// addItem query product action
          addItemProduct={addItemProduct}// addItem query product
          addItemUpProduct={addItemUpProduct}//addItem 根据列表树 查询列表
          offerPUpAddItem={offerPUpAddItem}//addItem 根据列表树 上级 查询列表
          offerPDownAddItem={offerPDownAddItem}//addItem 根据列表树 子级 查询列表
          offerPSaveAddItem={offerPSaveAddItem}//addItem product 新增报价单明细项
          offerPSaveRowsItem={offerPSaveRowsItem}//addItem product 列表rows,rowKeys
          addItemRowsList={addItemRowsList}// addItem product 列表rows
          addItemRowKeysList={addItemRowKeysList}// addItem product 列表rowKeys
          onCancel={() => cancelHandleType()}
        />
      </div>
    )
  }
}
