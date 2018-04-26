import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as reportTemplateAction from '../../../action/document/reportTemplate/reportTemplateAction';
import { Spin, Button, Row, Col, Modal, } from 'antd';
import './styles.css';
import { getPreparedItems, isAllActiveOrDisable } from '../../../util/getPreparedItems';

import SecurityButtonBox from '../../../component/public/SecurityButtonBox';
import SearchableTree from "../../../component/public/SearchableTree";
import BaseTable from "../../../component/public/BaseTable";
import BaseUpload from "../../../component/public/BaseUpload";
import ReportTemplateManageSetting from './column'
import AddReportTemplate from './AddReportTemplate'


class ReportTemplateManagement extends Component{

  componentDidMount() {
    this.props.searchTrees('1018', '报告模板');
  }

  render() {
    const {
      isLoading,
      editType,
      searchTree,              // 搜索树节点
      reportTemplateData,      // 列表数据
      reportTemplateKey,       // 选中树的key值
      selectRowKeys,           // 列表选中rowkeys
      selectRows,              // 列表选中rows
      currentReport,           // 列表点击 选中项
      uploadData,              // 上传文件列表
      uploadRows,              // 上传文件列表rows
      uploadRowKeys,           // 上传文件列表rowKeys
    } = this.props;

    const {
      reportTemplatList,           // 搜索列表数据
      reportTemplatListKey,        // action中获取表格选项的row, rowkeys
      getCurrentReport,            // 获取列表模板点击节点
      addReportTemplate,           // 新增弹框modal
      editReportTemplate,          // 编辑弹框modal
      reportTemplatAdd,            // 新增/编辑 确认
      cancelReportTemplat,         // 返回
      uploadModalReport,           // 上传文件的modal弹框开启
      uploadReportTemplat,         // 上传文件确认
      reportTemplatDelete,         // 删除
      uploadReportListKey,         // 上传文件勾选项
      uploadReportTemplatList,     // 上传文件列表
      uploadReportTemplatDelete,   // 删除上传文件
      reportTemplateMainF,
      reportTemplateActive,        // 激活 / 禁用
    } = this.props

    const reportTableSetting = ReportTemplateManageSetting.table.task; // 定义搜索表单
    const reportTableUploadSetting = ReportTemplateManageSetting.table.upload; // 定义搜索表单

    const preparedProduct = getPreparedItems(selectRows, selectRowKeys);
    const isEditForm = (Object.keys(currentReport).length > 0) || (selectRows.length === 1);       // 判断编辑disabled
    const isMultipleChoice = (selectRows.length >= 1) || (JSON.stringify(currentReport) !== '{}');  // 判断删除disabled
    const notAllSame = isAllActiveOrDisable(preparedProduct) === 'notAllSame';
    const allActive = isAllActiveOrDisable(preparedProduct) === 'allActive';
    const allDisable = isAllActiveOrDisable(preparedProduct) === 'allDisable';
    const isMultipleUpload = uploadRows.length >= 1;  // 判断上传文件删除disabled
    const isMainT = uploadRows.length === 1;          // 判断主文件 disabled

    let selectedId = (selectRowKeys && Number.parseInt(selectRowKeys[0], 10)) || (currentReport.id);
    // const uploadUrl = '/upload' + '?categoryTypeId=' + '1018' + '&typeId=' + reportTemplateKey + '&id=' + selectedId;
    const uploadUrl = '/upload?type=report//design&id=' + selectedId;

    // 搜索树的匹配规则
    const isMatch = (item, searchValue) => {
      return (
        (item.name && item.name.includes(searchValue))
        || (item.code && item.code.includes(searchValue))
        || (item.shorthand && item.shorthand.includes(searchValue))
      );
    }

    const renderTreeNodeTitle = (item) => {
      return item.code + "-" + item.name;
    }

    // 获取模板勾选项key 并查询文件列表
    const handleTablePrepare = (rows, rowKeys) => {
      reportTemplatListKey(rows, rowKeys)
      if(rows.length === 1) {
        uploadReportTemplatList(rowKeys.toString())
      }
    }
    // 获取上传文件勾选项
    const handleTablePrepares = (rows, rowKeys) => {
      uploadReportListKey(rows, rowKeys)
    }

    // 获取模板 表格点击项
    const handleTableSelect = (record) => {
      getCurrentReport(record);
      uploadReportTemplatList(record.id)
    };

    // 删除报告模板
    const handleDelete = () => {
      const keysR = (selectRowKeys && selectRowKeys.length > 0) ? selectRowKeys : [currentReport.id+'']
      Modal.confirm({
        title: '删除报告模板',
        content: '是否删除当前选中的报告模板？',
        onOk() {
          reportTemplatDelete(keysR)
        },
        onCancel() {cancelReportTemplat()}
      })
    }

    // 激活 / 禁用 报告模板
    const handleActive = () => {
      Modal.confirm({
        title: '激活',
        content: '是否激活当前选中的报告模板？',
        onOk() {
          reportTemplateActive(selectRowKeys)
        },
        onCancel() {cancelReportTemplat()}
      })
    }
    const handleUnActive = () => {
      Modal.confirm({
        title: '禁用',
        content: '是否禁用当前选中的报告模板？',
        onOk() {
          reportTemplateActive(selectRowKeys)
        },
        onCancel() {cancelReportTemplat()}
      })
    }

    // 上传文件确认
    const handleSubmit = (values) => {
      let arr = [];
      (values.reportTemplateFile || []).map(item => {
        return arr.push(item.name)
      });
      values = arr;
      uploadReportTemplat(values, selectedId)
    }

    // 删除上传文件
    const handleUploadDelete = () => {
      Modal.confirm({
        title: '删除上传文件',
        content: '是否删除当前选中的上传文件？',
        onOk() {
          // uploadReportTemplatDelete(uploadRowKeys, '1018', reportTemplateKey+'', selectedId)
          uploadReportTemplatDelete(uploadRowKeys, selectedId)
        },
        onCancel() {cancelReportTemplat()}
      })
    }

    // 设置主文件
    const handleMainFile = () => {
      const uploadRowKey = uploadRowKeys && Number.parseInt(uploadRowKeys[0], 10);
      reportTemplateMainF(selectedId, uploadRowKey)
    }

    return (
      <div>
        <Spin spinning={isLoading} delay={300} >
          <Row gutter={16} style={{marginLeft: 0, marginRight: 0}}>
            <Col span={4}>
              <SearchableTree
                categoryData = {searchTree}
                selectedKeys = {["" + reportTemplateKey]}
                onSelect={reportTemplatList}
                isMatch={isMatch}
                renderTitle={renderTreeNodeTitle}
                />
            </Col>
            <Col span={20}>
              <div className="panel panel-info" style={{margin:0}}>
                <div className="panel-body">
                  <div style={{ marginBottom: 10 }}>
                    <SecurityButtonBox>
                      <Button.Group>
                        <Button key={'rpt.doc.template.management.add'} disabled={!reportTemplateKey} icon="file-add" onClick={() => addReportTemplate()} > 新增 </Button>
                        <Button key={'rpt.doc.template.management.edit'} icon="edit" disabled={!isEditForm} onClick={() => editReportTemplate()} > 编辑 </Button>
                        <Button key={'rpt.doc.template.management.delete'} icon="delete" disabled={!(isMultipleChoice)} onClick={handleDelete} > 删除 </Button>
                      </Button.Group>
                      <Button.Group>
                        <Button key={'rpt.doc.template.management.active'} icon="check-circle-o" disabled={!(isMultipleChoice && !notAllSame && allDisable)} onClick={handleActive}> 激活 </Button>
                        <Button key={'rpt.doc.template.management.unactive'} icon="close-circle-o" disabled={!(isMultipleChoice && !notAllSame && allActive)} onClick={handleUnActive}> 禁用 </Button>
                      </Button.Group>
                    </SecurityButtonBox>
                  </div>
                  <BaseTable
                    options={ {pagination:{pageSize:5, showQuickJumper:true,}} }
                    onSelect={handleTableSelect}
                    onPrepare={handleTablePrepare}
                    isExpanded={false}
                    setting={reportTableSetting}
                    data={reportTemplateData}
                  />
                  <div style={{ marginBottom: 10, marginTop: 10 }}>
                    <SecurityButtonBox>
                      <Button.Group>
                        <Button key={'rpt.doc.template.management.upload'} icon="upload" disabled={!isEditForm} onClick={() => uploadModalReport()}> 上传文件 </Button>
                        <Button key={'rpt.doc.template.management.mainFile'} icon="setting" disabled={!(isMainT)} onClick={handleMainFile}> 设置主文件 </Button>
                        <Button key={'rpt.doc.template.management.uploadDelete'} icon="delete" disabled={!(isMultipleUpload)} onClick={handleUploadDelete} > 删除 </Button>
                      </Button.Group>
                    </SecurityButtonBox>
                    <BaseUpload
                      visible={editType === '上传文件'}
                      onCancel={() => cancelReportTemplat()}
                      editObject={selectRows[0]}
                      url={uploadUrl}
                      fileListLength={5}                 // 限制上传文件的数量
                      onFromSubmitSuccess={handleSubmit}
                      formKey={'reportTemplateFile'}/>
                  </div>
                  <BaseTable
                    options={ {pagination:{pageSize:5, showQuickJumper:true,}} }
                    isExpanded={false}
                    onPrepare={handleTablePrepares}
                    setting={reportTableUploadSetting}
                    data={uploadData}
                  />
                </div>
              </div>
            </Col>
          </Row>
          <AddReportTemplate
            visible={editType === '新增报告模板' || editType === '编辑报告模板'}
            onCancel={() => cancelReportTemplat()}
            onFormSubmit={reportTemplatAdd}
            editType={editType}
            editRows={selectRows[0]}     //传过去的表格rows
            currentReport={currentReport}
            reportTemplateKey={reportTemplateKey}
           />
        </Spin>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    isLoading: state.reportTemplateManagement.get('isLoading'),
    editType: state.reportTemplateManagement.get('editType'),
    searchTree: state.reportTemplateManagement.get('searchTree'),
    reportTemplateData: state.reportTemplateManagement.get('reportTemplateData'),
    reportTemplateKey: state.reportTemplateManagement.get('reportTemplateKey'),
    selectRows: state.reportTemplateManagement.get('selectRows'),
    selectRowKeys: state.reportTemplateManagement.get('selectRowKeys'),
    currentReport: state.reportTemplateManagement.get('currentReport'),
    uploadData: state.reportTemplateManagement.get('uploadData'),
    uploadRows: state.reportTemplateManagement.get('uploadRows'),
    uploadRowKeys: state.reportTemplateManagement.get('uploadRowKeys'),
  }
}
function mapDispatchToProps(dispatch, ownProps) {
  return bindActionCreators(reportTemplateAction, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(ReportTemplateManagement)
