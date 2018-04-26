import React, { Component } from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { storeActions } from '../../../modules';
import { Spin, Button, Row, Input } from 'antd';
import BaseTable from "../../../component/public/BaseTable";
import AdvancedTable from '../../../component/public/Table/AdvancedTable';
import SecurityButtonBox from '../../../component/public/SecurityButtonBox';
import StoreSetting from './column';

import ReceiveStore from './ReceiveStore';// 物料领用
import ReturnStore from './ReturnStore';// 物料归还
import OrderStore from './OrderStore';// 采购单查询
import StandingBookStore from './StandingBookStore';// 物料台帐

import { AddKeyForData } from '../../../util/treeUtils';

const Search = Input.Search;

class StoreManagement extends Component{

  state = {
    val: '',
  };

  render(){
    const {
      isLoading,
      editType,
      storeData,// 上面列表数据
      storeClick,// 列表选中项
      storeMaterialData,// 下面 列表数据
      storesClick,// 下面列表 选中项
    } = this.props;

    const {
      storeList,// 上面列表 调取数据
      listStoreClick,// 上面 列表点击项
      storeMaterialListClick,// 下面列表 选中项
      receiveStoreHandle,// 物料领用 弹框
      storeReceive,// 物料领用
      returnStoreHandle,// 物料归还 弹框
      storeReturn,// 物料归还
      orderStoreHandle,// 采购单 弹框
      storeOrder,// 采购单
      standingBookStoreHandle,// 台账 弹框
      storeStandingBook,// 台账
      cancelHandle,// 弹框返回
    } = this.props.storeActions;

    const storeSetting = StoreSetting.table.store;
    const materialStoreSet = StoreSetting.table.materialStore;

    // 打印标签
    const handlePrintUrl = '';
    const openPreviewWindow = () => {
      window.open(handlePrintUrl, "_blank");
    }

    // 上面列表点击项
    const handleTableSelect = (click) => {
      listStoreClick(click);
    }

    // 下面 列表点击项
    const onClickSelect = (click) => {
      storeMaterialListClick(click);
    }

    // 搜索input onChange
    const handleChange = (e) => {
      this.setState({
        val: e.target.value,
      })
    }

    return(
      <div>
        <Spin spinning={isLoading} delay={300} >
          <Row gutter={16} style={{marginLeft: 0, marginRight: 0}}>
            <div className="panel panel-info" style={{ margin:0}}>
              <div className="panel-body">
                <div style={{marginBottom: 15, float: 'right', }}>
                  <Search
                    placeholder="编号、名称"
                    style={{width: 220, marginRight: 15}}
                    onSearch={storeList}
                    value={this.state.val}
                    onChange={handleChange}
                  />
                  <Button type="primary" onClick={() => storeList(this.state.val)}>搜索</Button>
                </div>
                <div style={{clear: 'both'}} />
                <BaseTable
                  options={ {pagination:{pageSize: 5, showQuickJumper:true,}} }
                  onPrepare={false}
                  onSelect={handleTableSelect}
                  isExpanded={false}
                  setting={storeSetting}
                  data={storeData} />
                <div style={{
                  borderBottom: '1px dashed #e9e9e9',
                  margin: '15px 0 15px 0',
                }} />
                <div style={{marginBottom: 15}}>
                  {/* <SecurityButtonBox> */}
                    <Button.Group>
                      <Button key={'mat.store.receive'} onClick={() => receiveStoreHandle()} icon="export" >领用</Button>
                      <Button key={'mat.store.return'} onClick={() => returnStoreHandle()} icon="select" >归还</Button>
                      <Button key={'mat.store.move'} icon="sync" >移库</Button>
                    </Button.Group>
                    <Button.Group>
                      <Button key={'mat.store.standingBook'} onClick={() => standingBookStoreHandle()} icon="schedule" >物料台帐</Button>
                      <Button key={'mat.store.order'} onClick={() => orderStoreHandle()} icon="bars" >查看订单</Button>
                      <Button key={'mat.store.print'} onClick={openPreviewWindow} icon="printer" >打印标签</Button>
                    </Button.Group>
                  {/* </SecurityButtonBox> */}
                </div>
                 <BaseTable
                   options={ {pagination:{pageSize:5, showQuickJumper:true,}} }
                   onPrepare={false}
                   onSelect={onClickSelect}
                   // hideRowSelection={true}
                   isExpanded={false}
                   setting={materialStoreSet}
                   data={AddKeyForData(storeClick.stores || [])}
                 />
              </div>
            </div>
          </Row>
          {/* 物料领用 */}
          <ReceiveStore
            editType = {editType}
            visible = {editType === '物料领用'}
            storeReceive = {storeReceive}
            storesClick = {storesClick}
            onCancel = {() => cancelHandle()}
           />
           {/* 物料归还 */}
           <ReturnStore
             editType = {editType}
             visible = {editType === '物料归还'}
             storesClick = {storesClick}
             onCancel={() => cancelHandle()}
          />
          {/* 采购单 */}
          <OrderStore
            editType = {editType}
            visible = {editType === '采购单'}
            data={storeMaterialData}
            onCancel={() => cancelHandle()}
         />
         {/* 物料台帐 */}
         <StandingBookStore
           editType = {editType}
           visible = {editType === '物料台帐'}
           storesClick = {storesClick}
           data={storeMaterialData}
           onCancel={() => cancelHandle()}
         />
        </Spin>
      </div>
    );
  }
};


function mapStateToProps(state) {
  return {
    isLoading : state.storeManagement.get('isLoading'),
    editType : state.storeManagement.get('editType'),
    storeData: state.storeManagement.get('storeData'),
    storeClick: state.storeManagement.get('storeClick'),
    storesClick: state.storeManagement.get('storesClick'),
    storeMaterialData: state.storeManagement.get('storeMaterialData'),
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    storeActions: bindActionCreators(storeActions, dispatch)
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(StoreManagement);
