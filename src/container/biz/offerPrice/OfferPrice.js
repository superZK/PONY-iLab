import React, { Component } from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { offerPriceAction } from '../../../modules';
import { Spin, Button, Row, Col, Modal } from 'antd';
import AdvancedTable from '../../../component/public/Table/AdvancedTable';
import SecurityButtonBox from '../../../component/public/SecurityButtonBox';
import { isInArray } from '../../../util/treeUtils';
import { getPreparedItems, isAllActiveOrDisable } from '../../../util/getPreparedItems';
import SearchableSelector from '../../../component/public/SearchableSelector';

import OfferPriceSetting from './column';
import OfferPriceFilter from './OfferPriceFilter';
import AddOfferPrice from './AddOfferPrice';

class OfferPrice extends Component{

  render(){
    const {
      isLoading,
      editType,
      offerPData,// 列表data
      rowsList,// 列表rows
      rowKeysList,// 列表rowKeys
      clickList,// 列表 点击项
    } = this.props;

    const {
      offerPriceList,// 列表action
      listOfferPriceRows,// 列表rows，rowKeys
      listOfferPriceClick,// 列表 点击项
      addOfferPrice,// 新增 弹框
      offerPriceAdd,// 新增action
      editOfferPrice,// 编辑 弹框
      offerPriceDelete,// 删除
      offerPriceActive,// 激活
      offerPriceUnActive,// 禁用
      upgradeOfferPrice,// 升版 弹框
      offerPriceUpgrade,// 升版 action
      cancelHandle,// 取消弹框
    } = this.props.offerPriceAction;

    const offerPriceSetting = OfferPriceSetting.table.offerPriceList;

    const preparedProduct = (rowsList.length > 0) && (rowKeysList.length > 0) && getPreparedItems(rowsList, rowKeysList);
    // dis 编辑
    const selectDisabled = isInArray(Object.keys(clickList), 'id') || rowsList.length === 1;
    // 激活 禁用
    const isMultipleChoice = preparedProduct.length >= 1 || isInArray(Object.keys(clickList), 'id');
    const notAllSame = isAllActiveOrDisable((preparedProduct && preparedProduct.length>0) ? preparedProduct : [clickList], 'disable') === 'notAllSame';
    const allActive = isAllActiveOrDisable((preparedProduct && preparedProduct.length>0) ? preparedProduct : [clickList], 'disable') === 'allActive';
    const allDisable = isAllActiveOrDisable((preparedProduct && preparedProduct.length>0) ? preparedProduct : [clickList], 'disable') === 'allDisable';

    // 列表 点击项
    const handleTableSelect = (click) => {
      listOfferPriceClick(click);
    }
    // 列表 rows，rowKeys
    const handleTablePrepare = (rows, rowKeys) => {
      listOfferPriceRows(rows, rowKeys);
    }

    // 新增 、 编辑
    const itemId = {key: 'item.id', label: '检验项目', component: (
      <SearchableSelector
        options={{allowClear:true}}
        disabled={(editType === '新增') ? false : true}
        lazyMode={true}
        url='/doc/testitem/select/parent' />
    ), rules: [{required: true, message: ''}]};

    const methodId = {key: 'method.id', label: '检验方法', component: (
      <SearchableSelector
        options={{allowClear:true}}
        disabled={(editType === '新增') ? false : true}
        lazyMode={true}
        url='/doc/testmethod/select/parent' />
    ), rules: [{required: true, message: ''}]};

    const addOfferPriceForm = OfferPriceSetting.form.addOfferPriceForm;
    addOfferPriceForm.items[0] = itemId;
    addOfferPriceForm.items[1] = methodId;

    // 删除价格单
    const handleDelete = () => {
      Modal.confirm({
        title: '删除价格单',
        content: '是否删除当前选中的价格单？',
        onOk() {
          offerPriceDelete((rowKeysList && rowKeysList.length > 0) ? rowKeysList : [clickList.id+''])
        },
        onCancel() {cancelHandle()}
      })
    }

    // 激活/禁用价格单
    const handleActive = () => {
      Modal.confirm({
        title: '激活',
        content: '是否激活当前选中的价格单？',
        onOk() {
          offerPriceActive((rowKeysList && rowKeysList.length > 0) ? rowKeysList : [clickList.id+''])
        },
        onCancel() {cancelHandle()}
      })
    }
    const handleUnActive = () => {
      Modal.confirm({
        title: '禁用',
        content: '是否禁用当前选中的价格单？',
        onOk() {
          offerPriceUnActive((rowKeysList && rowKeysList.length > 0) ? rowKeysList : [clickList.id+''])
        },
        onCancel() {cancelHandle()}
      })
    }

    return(
      <div>
        <Spin spinning={isLoading} delay={300} >
          <div className="panel panel-info" style={{margin:0}}>
            <div className="panel-heading">
              <OfferPriceFilter
                offerPriceList={offerPriceList}
              />
            </div>
            <div className="panel panel-info" style={{margin:0}}>
              <div className="panel-body">
                <Row style={{marginBottom: '10px' }}>
                  <Col span={19} offset={1}>
                    {/* <SecurityButtonBox> */}
                      <Button.Group>
                        <Button key={'biz.offer.price.add'} onClick={addOfferPrice} icon="file-add" > 新增 </Button>
                        <Button key={'biz.offer.price.update'} disabled={!(selectDisabled)} onClick={editOfferPrice} icon="edit" > 修改 </Button>
                        <Button key={'biz.offer.price.delete'} disabled={!(isMultipleChoice)} onClick={() => handleDelete()} icon="delete" > 删除 </Button>
                      </Button.Group>
                      <Button.Group>
                        <Button key={'biz.offer.price.upgrade'} disabled={!(selectDisabled)} onClick={upgradeOfferPrice} icon="plus-circle-o" > 升版 </Button>
                        <Button key={'biz.offer.price.activate'} disabled={!(isMultipleChoice && !notAllSame && allDisable)} onClick={handleActive} icon="check-circle-o" > 激活 </Button>
                        <Button key={'biz.offer.price.disable'} disabled={!(isMultipleChoice && !notAllSame && allActive)} onClick={handleUnActive} icon="close-circle-o" > 禁用 </Button>
                      </Button.Group>
                    {/* </SecurityButtonBox> */}
                  </Col>
                </Row>
                <AdvancedTable
                  pagination={{pageSize:15, showQuickJumper:true}}
                  onSelect={handleTableSelect}
                  onPrepare={handleTablePrepare}
                  isExpanded={false}
                  setting={offerPriceSetting}
                  data={offerPData}
                  colNum={'1'}
                  // simpleSearchKey={[['单价','price'], ['','group'], ['','memo']]}
                  avancedSearchForm={false}
                />
              </div>
            </div>
          </div>
          <AddOfferPrice
            editType = {editType}
            visible = {editType === '新增' || editType === '编辑' || editType === '升级版本'}
            offerPriceAdd={offerPriceAdd}// add action
            offerPriceUpgrade={offerPriceUpgrade} // 升版 action
            addOfferPriceForm={addOfferPriceForm}
            editObject = {((rowKeysList.length > 0) ? rowsList[0] : '') || clickList}// editObject
            onCancel={() => cancelHandle()}
          />
        </Spin>
      </div>
    );
  }
};

// bind to container

function mapStateToProps(state) {
  return {
    isLoading : state.offerPrice.get('isLoading'),
    editType : state.offerPrice.get('editType'),
    offerPData: state.offerPrice.get('offerPData'),
    rowsList: state.offerPrice.get('rowsList'),
    rowKeysList: state.offerPrice.get('rowKeysList'),
    clickList: state.offerPrice.get('clickList'),
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    offerPriceAction: bindActionCreators(offerPriceAction, dispatch)
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(OfferPrice);
