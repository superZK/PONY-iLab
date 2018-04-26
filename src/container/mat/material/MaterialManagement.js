import React, { Component } from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { materialActions } from '../../../modules';
import { Spin, Button, Row, Col, Input } from 'antd';
import BaseTable from "../../../component/public/BaseTable";
import AdvancedTable from '../../../component/public/Table/AdvancedTable';
import SecurityButtonBox from '../../../component/public/SecurityButtonBox';

import MaterialSetting from './column';
import MaterialForm from './MaterialForm';

const Search = Input.Search;

class MaterialManagement extends Component{
  state = {
    val: '',
  };

  render(){
    const {
      isLoading,
      editType,
      materialData,// 列表数据
      materialClick,// 列表选中项
      saveListMaterial,// 入库过列表 调取数据
    } = this.props;

    const {
      materialList,// 上面列表 调取数据
      listMaterialClick,// 上面 列表点击项
      materialSave,// 试剂入库、标准物质入库 确认
    } = this.props.materialActions;


    const materialSetting = MaterialSetting.table.material;
    const materialPart = MaterialSetting.table.materialPart;

    // 打印标签
    const handlePrintUrl = '';
    const openPreviewWindow = () => {
      window.open(handlePrintUrl, "_blank");
    }

    // 上面列表点击项
    const handleTableSelect = (click) => {
      listMaterialClick(click);
    }

    // 搜索input onChange
    const handleChange = (e) => {
      this.setState({
        val: e.target.value,
      })
    }

    const item = [];
    item.code = materialClick.code;
    item.spec = materialClick.spec;
    item.unitId = materialClick.measUnit && materialClick.measUnit.id;

    return(
      <div>
        <Spin spinning={isLoading} delay={300} >
          <div className="panel panel-info" style={{ margin:0}}>
            <div className="panel-body">
              <div style={{marginBottom: 15, float: 'right', }}>
                <Search
                  placeholder="编号、名称"
                  style={{width: 220, marginRight: 15}}
                  value={this.state.val}
                  onSearch={materialList}
                  onChange={handleChange}
                />
                <Button type="primary" onClick={() => materialList(this.state.val)} >搜索</Button>
              </div>
              <div style={{clear: 'both'}} />
              <BaseTable
                options={ {pagination:{pageSize: 5, showQuickJumper:true,}} }
                onPrepare={false}
                onSelect={handleTableSelect}
                isExpanded={false}
                setting={materialSetting}
                data={materialData} />
              <div style={{
                borderBottom: '1px dashed #e9e9e9',
                margin: '15px 0 15px 0',
              }} />
              <Row>
                <Col span={6}>
                  <div className="panel panel-info" style={{marginRight:15}}>
                    <div className="panel-heading" >
                      <MaterialForm
                        item={item}
                        materialSave={materialSave}
                        materialClick={materialClick}
                      />
                    </div>
                  </div>
                </Col>
                <Col span={18}>
                  <div className="panel panel-info" style={{ margin:0}}>
                    <div className="panel-body">
                      <div style={{marginBottom: 15}}>
                        <SecurityButtonBox>
                          <Button key={'mat.material.print'} onClick={openPreviewWindow} icon="printer" >打印标签</Button>
                        </SecurityButtonBox>
                      </div>
                      <BaseTable
                        options={ {pagination:{pageSize: 10, showQuickJumper:true,}} }
                        onPrepare={false}
                        onSelect={false}
                        isExpanded={false}
                        setting={materialPart}
                        data={materialClick.stores || []} />
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        </Spin>
      </div>
    );
  }
};

// bind to container

function mapStateToProps(state) {
  return {
    isLoading : state.materialManagement.get('isLoading'),
    editType : state.materialManagement.get('editType'),
    materialData: state.materialManagement.get('materialData'),
    materialClick: state.materialManagement.get('materialClick'),
    saveListMaterial: state.materialManagement.get('saveListMaterial'),
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    materialActions: bindActionCreators(materialActions, dispatch)
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(MaterialManagement);
