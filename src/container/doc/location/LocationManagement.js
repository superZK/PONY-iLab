import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as locationAction from '../../../action/document/location/locationAction';
import { Spin, Button, Row, Col, Modal, } from 'antd';

import fetchData from '../../../util/fetchGateway';

import SecurityButtonBox from '../../../component/public/SecurityButtonBox';
import SearchableTree from "../../../component/public/SearchableTree";
import SearchableSelector from '../../../component/public/SearchableSelector';
import BaseTable from "../../../component/public/BaseTable";
import LocationManageSetting from './column'
import AddLocation from './AddLocation'


class LocationManagement extends Component{
  state = {defaultSite: '', siteName: ''}

  // 获取当前用户组织信息首选项查询用户
  getDefaultSite = () => {
    fetchData('/sys/mode').then(
      (receipt) => {
        this.setState({
          defaultSite: receipt.data[0].siteId ? receipt.data[0].siteId : '',
          siteName: receipt.data[0].siteName ? receipt.data[0].siteName : '',
        });
        let siteName = receipt.data[0].siteName ? receipt.data[0].siteName : '';
        let siteId = receipt.data[0].siteId ? receipt.data[0].siteId : '';
        const { asyncLoadLocation } = this.props.locationAction;
        asyncLoadLocation(siteId, siteName);
      },
      (error) => {console.log(error)}
    );
  }

  componentDidMount() {
    this.getDefaultSite()
  }

  render() {
    const {
      isLoading,
      editType,
      locationTree,//树列表data
      selectedItem,//选中树列表
      locationRows,// 列表rows
      locationRowsKey,//列表rowsKey
    } = this.props;

    const {
      locationAction: {
        // asyncLoadLocation,//加载部门数据 树列表
        selectedLocation,//获取可搜索树选中节点
        // listLocation,//表格列表
        listLocationRows,//表格rows
        locationAdd,//新增弹框
        addLocation,//新增
        locationEdit,//编辑
        locationDelete,//删除
        cancelLocation,//弹框返回
      }
    } = this.props

    const locationSetting = LocationManageSetting.table.task; // 定义搜索表单
    const isDelete = locationRows.length >= 1;  // 判断删除disabled
    const isOnlyRadio = locationRows.length === 1;// 判断编辑disabled

    // 搜索树的匹配规则
    const isMatch = (item, searchValue) => {
      return (
        (item.name && item.name.includes(searchValue))
        || (item.code && item.code.includes(searchValue))
        || (item.shorthand && item.shorthand.includes(searchValue))
      );
    }
    const renderTreeNodeTitle = (item) => {
      return item.locationName + '(' + item.code + ')';
    }

    // 下拉菜单 选中select中某一节点时，发送查询部门数据请求
    const handleSelect = (value, option) => {
      // asyncLoadLocation(option.props.value, option.props.label);
      this.setState({
        defaultSite: value,
        siteName: option.props.label,
      });
    }
    // 下拉菜单
    const handleChange = (value, option) => {
      this.setState({
        defaultSite: value || '',
      });
      if(!value){
        this.setState({
          siteName: '',
        });
      }
    }
    // 搜索树点击
    const handleSelectTree = (selectedKeys) => {
      selectedLocation(selectedKeys)
    }

    // 获取表格列表rows
    const handleTablePrepare = (rows, rowKeys) => {
      listLocationRows(rows, rowKeys)
    }

    // 删除
    const handleDelete = () => {
      let hasChildren = false;
      for(let c of locationRows){
        if(c && c.subordinate && c.subordinate.length > 0){
          hasChildren = true;
          break;
        }
      }

      Modal.confirm({
        title: "删除目录",
        content: hasChildren ? "所选目录包含下级目录，将一并被删除。是否确认？" : "是否确认删除所选目录？",
        onOk(){ locationDelete(locationRowsKey) },
        onCancel(){ cancelLocation() },
      });
    }

    return (
      <div>
        <Spin spinning={isLoading} delay={300} >
          <Row gutter={16} style={{marginLeft: 0, marginRight: 0}}>
            <Col span={4}>
              <SearchableSelector
                options={{allowClear:true, style:{ width: '100%'} }}
                onSelect={handleSelect}
                onChange={handleChange}
                lazyMode={false}
                defaultValue={this.state.defaultSite}
                disabled={true}
                url='/org/site/select' />
              <SearchableTree
                maxHeight = {70}
                categoryData = {locationTree}
                // defaultExpandedKeys={[locationTree.length ? locationTree[0].id + '' : '']}
                selectedKeys = {[selectedItem && ("" + selectedItem.id)]}
                onSelect={handleSelectTree}
                isMatch={isMatch}
                renderTitle={renderTreeNodeTitle} />
            </Col>
            <Col span={20}>
              <div className="panel panel-info" style={{margin:0}}>
                <div className="panel-body">
                  <div style={{ marginBottom: 10 }}>
                    <SecurityButtonBox>
                      <Button.Group>
                        <Button key={'doc.location.management.add'} onClick={() => locationAdd()} icon="file-add" > 新增 </Button>
                        <Button key={'doc.location.management.edit'} disabled={!(isOnlyRadio)} icon="edit" onClick={() => locationEdit()} > 编辑 </Button>
                        <Button key={'doc.location.management.delete'} onClick={handleDelete} disabled={!(isDelete)} icon="delete" > 删除 </Button>
                        <Button key={'doc.location.management.retweet'} disabled icon="retweet" > 移除 </Button>
                      </Button.Group>
                    </SecurityButtonBox>
                  </div>
                  <BaseTable
                    options={ {pagination:{pageSize:10, showQuickJumper:true,}} }
                    onPrepare={handleTablePrepare}
                    isExpanded={false}
                    setting={locationSetting}
                    data={selectedItem ? selectedItem.subordinate : []}
                  />
                </div>
              </div>
            </Col>
          </Row>
          <AddLocation
            editType = {editType}
            visible = {editType === '新增' || editType === '编辑'}
            onCancel={() => cancelLocation()}
            onFormSubmit={addLocation}
            prepareItems={selectedItem}
            defauleSiteId={this.state.defaultSite}
            locationRows={locationRows[0]}
          />
        </Spin>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    isLoading: state.locationManagement.get('isLoading'),
    editType: state.locationManagement.get('editType'),
    locationTree: state.locationManagement.get('locationTree'),
    selectedItem: state.locationManagement.get('selectedItem'),
    locationRows: state.locationManagement.get('locationRows'),
    locationRowsKey: state.locationManagement.get('locationRowsKey'),
  }
}
function mapDispatchToProps(dispatch, ownProps) {
  return {
    locationAction: bindActionCreators(locationAction, dispatch),
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(LocationManagement)
