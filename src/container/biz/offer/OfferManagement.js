import React, { Component } from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { offerManagementAction } from '../../../modules';
import { Spin, Button, Row, Col, Icon } from 'antd';
import BaseTable from "../../../component/public/BaseTable";
import AdvancedTable from '../../../component/public/Table/AdvancedTable';
import SecurityButtonBox from '../../../component/public/SecurityButtonBox';
import { isInArray } from '../../../util/treeUtils';

import OfferSetting from './column';
import OfferFilter from './OfferFilter';
import AddOffer from './AddOffer';

class OfferManagement extends Component{

  render(){
    const {
      isLoading,
      editType,
      handleType,
      offerData,// 上面列表 data
      rowsList,// 上面列表 rows
      rowKeysList,// 上面列表 rowKeys
      clickList,// 上面列表 点击项
      offerListData,// 下面列表 data
      addItemProduct,// addItem query product
      addItemUpProduct,// addItem 根据列表树 查询列表
      addItemSaveProduct,//addItem product 新增报价单明细项
      addItemRowsList,//addItem product 列表rows
      addItemRowKeysList,// addItem product 列表rowKeys
    } = this.props;

    const {
      offerList,// 上面 搜索 列表action
      listOfferRows,// 上面列表 rows rowkeys
      listOfferClick,// 上面列表 点击项
      offerLists,// 下面 列表 action
      addOffer,// 新增 弹框
      offerAdd,// 新增 action
      addItemOffer,// addItem 弹框
      offerAddItem,// addItem action
      offerPAddItem,// addItem query product action
      offerPUpAddItem,// addItem 根据列表树 上级 查询列表
      offerPDownAddItem,// addItem 根据列表树 子级 查询列表
      offerPSaveAddItem,// addItem product 新增报价单明细项
      offerPSaveRowsItem,//addItem product 列表rows,rowKeys
      cancelHandle,// 返回 弹框
      cancelHandleType,// 双层弹框 返回
    } = this.props.offerManagementAction

    const offerSetting = OfferSetting.table.offer;
    const offer_sSetting = OfferSetting.table.offer_s;

    const handleTableSelect = (click) => {
      listOfferClick(click);
      offerLists(click && click.id);
    }
    const handleTablePrepare = (rows, rowkeys) => {
      listOfferRows(rows, rowkeys);
    }

    return(
      <div>
        <Spin spinning={isLoading} delay={300} >
          <div className="panel panel-info" style={{margin:0}}>
            <div className="panel-heading">
              <OfferFilter offerList={offerList} />
            </div>
            <div className="panel panel-info" style={{margin:0}}>
              <div className="panel-body">
                <Row style={{marginBottom: '10px' }}>
                  <Col span={19} offset={1}>
                    {/* <SecurityButtonBox> */}
                      <Button.Group>
                        <Button key={'biz.offer.management.add'} onClick={addOffer} icon="file-add" > 新增 </Button>
                        <Button key={'biz.offer.management.update'} icon="edit" > 修改 </Button>
                        <Button key={'biz.offer.management.delete'} icon="delete" > 删除 </Button>
                      </Button.Group>
                      <Button key={'biz.offer.management.view'} icon="eye-o" > 查看 </Button>
                    {/* </SecurityButtonBox> */}
                  </Col>
                </Row>
                <AdvancedTable
                  pagination={{pageSize:5, showQuickJumper:true}}
                  onSelect={handleTableSelect}
                  onPrepare={handleTablePrepare}
                  isExpanded={false}
                  setting={offerSetting}
                  data={offerData}
                  colNum={'1'}
                  // simpleSearchKey={[['单价','price'], ['','group'], ['','memo']]}
                  avancedSearchForm={false}
                />
                <AdvancedTable
                  mode={'Simple'}
                  pagination={{pageSize:5, showQuickJumper:true}}
                  onPrepare={false}
                  isExpanded={false}
                  setting={offer_sSetting}
                  data={offerListData}
                />
              </div>
            </div>
          </div>
          <AddOffer
            editType = {editType}
            visible = {editType === '新增'}
            handleType={handleType}
            addItemOffer={addItemOffer}//addItem 弹框
            offerAddItem={offerAddItem}//addItem action
            offerPAddItem={offerPAddItem}// addItem query product action
            addItemProduct={addItemProduct}// addItem query product
            addItemUpProduct={addItemUpProduct}//addItem 根据列表树 查询列表
            offerPUpAddItem={offerPUpAddItem}//addItem 根据列表树 上级 查询列表
            offerPDownAddItem={offerPDownAddItem}//addItem 根据列表树 子级 查询列表
            offerPSaveAddItem={offerPSaveAddItem}//addItem product 新增报价单明细项
            addItemSaveProduct={addItemSaveProduct}//addItem product 新增报价单明细项 data
            offerPSaveRowsItem={offerPSaveRowsItem}//addItem product 列表rows,rowKeys
            addItemRowsList={addItemRowsList}// addItem product 列表rows
            addItemRowKeysList={addItemRowKeysList}// addItem product 列表rowKeys
            onCancel={() => cancelHandle()}
            cancelHandleType={cancelHandleType}
          />
        </Spin>
      </div>
    );
  }
};

// bind to container

function mapStateToProps(state) {
  return {
    isLoading : state.offerManagement.get('isLoading'),
    editType : state.offerManagement.get('editType'),
    handleType: state.offerManagement.get('handleType'),
    offerData: state.offerManagement.get('offerData'),
    rowsList: state.offerManagement.get('rowsList'),
    rowKeysList: state.offerManagement.get('rowKeysList'),
    clickList: state.offerManagement.get('clickList'),
    offerListData: state.offerManagement.get('offerListData'),
    addItemProduct: state.offerManagement.get('addItemProduct'),
    addItemUpProduct: state.offerManagement.get('addItemUpProduct'),
    addItemSaveProduct: state.offerManagement.get('addItemSaveProduct'),
    addItemRowsList: state.offerManagement.get('addItemRowsList'),
    addItemRowKeysList: state.offerManagement.get('addItemRowKeysList'),
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    offerManagementAction: bindActionCreators(offerManagementAction, dispatch)
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(OfferManagement);
