import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as qualificationActions from '../../../action/document/qualification/qualificationAction';
import { Spin, Button, Row, Col, Modal, } from 'antd';
import './styles.css';
import { getPreparedItems, isAllActiveOrDisable } from '../../../util/getPreparedItems';
import { isInArray } from '../../../util/treeUtils';

import SecurityButtonBox from '../../../component/public/SecurityButtonBox';
import SearchableSelector from '../../../component/public/SearchableSelector';
import BaseForm from '../../../component/public/BaseForm';
import BaseTable from "../../../component/public/BaseTable";
import QualificationManageSetting from './column'
import AddQualification from './AddQualification'
import EditQualification from './EditQualification'
import ConnectProduct from './ConnectProduct'


class QualificationManagement extends Component{

  state = {
    siteId: '0',
    deptId: '',
  }

  componentDidMount() {
    this.props.qualificationManagementTitle()
  }

  render() {
    const {
      siteId,
      deptId,
    } = this.state;

    const {
      isLoading,
      editType,
      temporaryStoredTitle,     // 已暂存的资质抬头
      temporaryStoredTitleAdd,  // 新增表格列表
      rowKeysAdd,               // 新增表格列表rowKeys
      selectRowsKey,            // 首页列表rowKeys
      selectRows,               // 首页列表rows
      selectClick,              // 首页列表 点击项
      rowKeysConnect,           // 关联产品获取到的表格rowKeys
      rowsConnect,              // 关联产品获取到的表格rows
      temporaryStoredTitleProduct,   // 关联产品中表格数据
    } = this.props;

    const {
      qualificationManagementTitle,    // 暂存资质认证搜索抬头
      qualificationListKey,            // 首页列表rows和rowKeys
      qualificationListClick,          // 首页列表 点击项
      addQualification,                // 新增资质的modal
      qualificationAdd,                // 新增资质按钮
      cancelQualification,             // 取消操作
      qualificationAddTitle,           // 新增暂存搜索抬头
      qualificationKey,                // 传过去的表格rows和rowKeys
      editQualification,               // 编辑按钮modal
      qualificationEdit,               // 编辑资质
      qualificationDelete,             // 删除资质
      qualifyActive,                   // 激活资质
      connectProduct,                  // 关联产品modal
      qualificationConnect,            // 关联产品
      connectProductKey,               // 关联产品穿过去的rows和rowKeys
      connectProductTitle,             // 关联产品暂存搜索抬头
    } = this.props;

    // 组织更改后，清空部门选项
    const handleSiteChange = (value) =>{
      this.setState({
        siteId: value || '',
      });
      this.refs.BaseForm.setFieldsValue({deptId: ''});
    }

    const siteSelect = {key: 'siteId', label: '组织', component: (
      <SearchableSelector
        options={{allowClear:true}}
        onChange={handleSiteChange}
        disabled={false}
        lazyMode={false}
        url='/org/site/select' />
    ), rules: [{ message: '请选择组织'}]};

    const deptSelect = {key: 'deptId', label: '部门', component: (
      <SearchableSelector
        options={{allowClear:true}}
        disabled={false}
        lazyMode={false}
        url={'/org/dept/select/506501?siteId=' + siteId} />
    ), rules: [{message: '请选择部门'}]};
    
    const QualifyTitleFormSetting = QualificationManageSetting.form.qualifyTitle; // 定义搜索表单
    QualifyTitleFormSetting.items[0] = siteSelect;
    QualifyTitleFormSetting.items[1] = deptSelect;
    const TaskTableSetting = QualificationManageSetting.table.task;//定义检测任务表格配置

    const preparedProduct = (selectRows.length > 0) && (selectRowsKey.length > 0) && getPreparedItems(selectRows, selectRowsKey);
    const selectDisabled = isInArray(Object.keys(selectClick), 'id') || selectRows.length === 1;
    const isMultipleChoice = preparedProduct.length >= 1 || isInArray(Object.keys(selectClick), 'id');
    const notAllSame = isAllActiveOrDisable((preparedProduct && preparedProduct.length>0) ? preparedProduct : [selectClick]) === 'notAllSame';
    const allActive = isAllActiveOrDisable((preparedProduct && preparedProduct.length>0) ? preparedProduct : [selectClick]) === 'allActive';
    const allDisable = isAllActiveOrDisable((preparedProduct && preparedProduct.length>0) ? preparedProduct : [selectClick]) === 'allDisable';


    // 获取资质勾选项key
    const handleTablePrepare = (rows, rowKeys) => {
      qualificationListKey(rows, rowKeys)
    }

    // 获取资质点击项
    const handleRowClick = (record) => {
      qualificationListClick(record)
    }

    // 暂存资质认证搜索抬头
    const handleFormSubmitSuccess = (v) => {
      if(v) {
        qualificationManagementTitle(v.deptId, v.qualificationTypeId, v.testMethodId, v.testItemId, v.productId)
      }
    }

    // 删除资质
    const handleDelete = () => {
      Modal.confirm({
        title: '删除资质',
        content: '是否删除当前选中的资质？',
        onOk() {
          qualificationDelete((selectRowsKey && selectRowsKey.length > 0) ? selectRowsKey : [selectClick.id+''])
        },
        onCancel() {cancelQualification()}
      })
    }

    // 激活/禁用资质
    const handleActive = () => {
      Modal.confirm({
        title: '激活',
        content: '是否激活当前选中的资质？',
        onOk() {
          qualifyActive((selectRowsKey && selectRowsKey.length > 0) ? selectRowsKey : [selectClick.id+''])
        },
        onCancel() {cancelQualification()}
      })
    }
    const handleUnActive = () => {
      Modal.confirm({
        title: '禁用',
        content: '是否禁用当前选中的资质？',
        onOk() {
          qualifyActive((selectRowsKey && selectRowsKey.length > 0) ? selectRowsKey : [selectClick.id+''])
        },
        onCancel() {cancelQualification()}
      })
    }

    return (
      <div>
        <Spin spinning={isLoading} delay={300} >
          <div className="panel panel-info" style={{margin:0}}>
            <div className="panel-heading" style={{height:140}}>
              <BaseForm
                ref = 'BaseForm'
                colNum = {'1'}
                setting = {QualifyTitleFormSetting}
                footerRule = {'确认'}
                onFormSubmitSuccess = {handleFormSubmitSuccess}
                submitTitleClass = {{marginLeft:10, transform: 'translate(-8px, 0px)'}}
              />
            </div>
            <div className="panel-body">
              <Row style={{marginBottom: 15}}>
                <Col span={19} offset={1}>
                  <SecurityButtonBox>
                    <Button.Group>
                      <Button key={'doc.qualification.management.add'} icon="file-add" onClick={() => addQualification()}> 新增 </Button>
                      <Button key={'doc.qualification.management.edit'} icon="edit" disabled={!(selectDisabled)} onClick={() => editQualification()}> 编辑 </Button>
                      <Button key={'doc.qualification.management.delete'} icon="delete" disabled={!(isMultipleChoice)} onClick={() => handleDelete()}> 删除 </Button>
                    </Button.Group>
                    <Button.Group>
                      <Button key={'doc.qualification.management.active'} icon="check-circle-o" disabled={!(isMultipleChoice && !notAllSame && allDisable)} onClick={handleActive}> 激活 </Button>
                      <Button key={'doc.qualification.management.unactive'} icon="close-circle-o" disabled={!(isMultipleChoice && !notAllSame && allActive)} onClick={handleUnActive}> 禁用 </Button>
                    </Button.Group>
                    <Button.Group>
                      <Button key={'doc.qualification.management.relatedProducts'} icon="pushpin-o" disabled={!(selectDisabled)} onClick={() => connectProduct()}>关联产品</Button>
                      <Button key={'doc.qualification.management.export'} icon="export" disabled>导出</Button>
                    </Button.Group>
                  </SecurityButtonBox>
                </Col>
              </Row>
              <BaseTable
                onSelect={handleRowClick}
                onPrepare={handleTablePrepare}
                isExpanded={false}
                setting={TaskTableSetting}
                data={temporaryStoredTitle}
              />
            </div>
          </div>
          <AddQualification
            visible={editType === '新增资质'}
            onCancel={() => cancelQualification()}
            onEndSubmit={qualificationAdd}
            qualificationKey={qualificationKey}                 //传过去的表格rows和rowKeys
            rowKeysAdd={rowKeysAdd}                             //获取到的key值
            qualificationAddTitle={qualificationAddTitle}       // 新增搜索action数据暂存
            temporaryStoredTitleAdd={temporaryStoredTitleAdd}   // 新增表格列表数据
           />
           <EditQualification
             visible={editType === '编辑资质'}
             onCancel={() => cancelQualification()}
             onEndSubmit={qualificationEdit}
             editObject={selectRows[0] || selectClick}
           />
           <ConnectProduct
             visible={editType === '关联产品'}
             editType = {editType}
             onEndSubmit={qualificationConnect}               // 关联产品最后点击事件
             editObject={selectRows[0] || selectClick}        // 获取到disabled表单中的内容
             selectRows={(selectRows && selectRows.length > 0) ? selectRows : [selectClick]}         // 首页列表rows
             onCancel={() => cancelQualification()}
             connectProductKey={connectProductKey}            // 传过去的rows和rowKeys
             rowKeysConnect={rowKeysConnect}                  // 获取到的rowKeys
             rowsConnect={rowsConnect}                        // 获取到的rows
             connectProductTitle={connectProductTitle}        // 暂存搜索抬头
             temporaryStoredTitleProduct={temporaryStoredTitleProduct}  // 关联产品中表格列表数据
           />
        </Spin>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    isLoading: state.qualificationManagement.get('isLoading'),
    editType: state.qualificationManagement.get('editType'),
    temporaryStoredTitle: state.qualificationManagement.get('temporaryStoredTitle'),
    temporaryStoredTitleAdd: state.qualificationManagement.get('temporaryStoredTitleAdd'),
    rowKeysAdd: state.qualificationManagement.get('rowKeysAdd'),
    selectRows: state.qualificationManagement.get('selectRows'),
    selectRowsKey: state.qualificationManagement.get('selectRowsKey'),
    selectClick: state.qualificationManagement.get('selectClick'),
    temporaryStoredTitleProduct: state.qualificationManagement.get('temporaryStoredTitleProduct'),
    rowKeysConnect: state.qualificationManagement.get('rowKeysConnect'),
    rowsConnect: state.qualificationManagement.get('rowsConnect'),

  }
}
function mapDispatchToProps(dispatch, ownProps) {
  return bindActionCreators(qualificationActions, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(QualificationManagement)
