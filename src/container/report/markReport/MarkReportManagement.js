import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as markReportAction from '../../../action/report/markReport/markReportAction';
import { Spin, Button, Row, Col, Modal, Icon } from 'antd';
import './styles.css';
import { isAllActiveOrDisable } from '../../../util/getPreparedItems';

import SecurityButtonBox from '../../../component/public/SecurityButtonBox';

import SearchableSelector from '../../../component/public/SearchableSelector';
import SearchableTree from '../../../component/public/SearchableTree';
import BaseTable from "../../../component/public/BaseTable";
import AdvancedTable from '../../../component/public/Table/AdvancedTable';
import MarkReportForm from './MarkReportForm';
// import SampleTable from './SampleTable';
// import ReportTable from './ReportTable';

import MarkReportSetting from './column';


class MarkReportManagement extends Component{

  componentDidMount() {
    const {searchTrees, markReportSignatureList} = this.props.markReportAction
    searchTrees();
    markReportSignatureList();
    // markReportBtnList();
  }

  render() {
    const {
      reportTemplateData,        // 报告模板列表数据
      signatureData,              // 签章列表数据
      isLoading,
      searchData,                // 树 整体内容
      markReportKey,             // 选中订单树的key
      sampleData,                // 存储样品列表数据
      selectRows,                // 列表rows
      selectRowKeys,             // 列表rowkeys
      // templateRows,              // 获取报告模板的rows
      templateRowKeys,           // 获取报告模板的rowsKey
      qualificationRowKeys,      // 获取签章的rowsKey
      markReportBtnData,         // 编制报告  返回数据
      reportTableRows,           // 报告rows
      reportTableRowKeys,        // 报告rowkeys
    } = this.props;

    const {
      markReportAction: {
        markReportListKey,             // 样品列表rows 和 rowkeys
        markReportSampleList,          // 搜索树 列表 样品
        markReportBtnList,             // 报告编制 列表 查询
        rowsMarkreportTemplate,        // 获取报告模板的rowsKey
        rowsMarkreportQualification,   // 获取签章的rowsKey
        markReportTemplateList,        // 报告模板列表
        markReportBtn,                 // 编制报告按钮
        markReporTableRows,            // 报告 rows
        markReportDelete,              // 编制报告删除
        voidMarkReportBtn,             // 编制报告作废
        markReportDone,                // 编制报告完成
        cancelMarkReport,              // 弹框 取消
      }
    } = this.props

    // 表格列表setting
    const orderTableSet = MarkReportSetting.table.orderTable;
    const markReportTableListSet = MarkReportSetting.table.markReportListTable;
    const markReportTableSet = MarkReportSetting.table.markReportTable;

    // 订单样品 保存结果项 id
    const taskIds = (selectRows && selectRows.length > 0) && selectRows.map(v => {
      return v.taskReportInputId+''
    })

    const reportButton = (templateRowKeys.length > 0) && (qualificationRowKeys.length > 0) && (selectRowKeys.length > 0);
    const isMultipleChoice = reportTableRows.length >= 1;
    const disableReport = reportTableRows.length <= 0;

    const notAllSame = isAllActiveOrDisable(reportTableRows, 'disable') === 'notAllSame';
    const allDisable = isAllActiveOrDisable(reportTableRows, 'disable') === 'allDisable';

    const templateKey = templateRowKeys && Number.parseInt(templateRowKeys[0], 10)
    const reportKey = reportTableRowKeys && Number.parseInt(reportTableRowKeys[0], 10)

    // 报告预览disabled
    const isTemplate = templateRowKeys.length === 1 && taskIds.length >= 1;
    // 查看PDF disabled
    const isReportT = reportTableRowKeys.length === 1;

    // 报告预览
    const preViewUrl = '/report/reportcompile/preview/html?reportTemplateId=' + templateKey + '&taskReportInputIds=' + taskIds;
    const openPreviewWindow = () => {
      window.open(preViewUrl, "_blank");
    }
    // 查看PDF
    const handlePDFUrl = '/report/reportcompile/preview/pdf?reportCompileId=' + reportKey;
    const openPreviewWindowPDF = () => {
      window.open(handlePDFUrl, "_blank");
    }

    // 样品表格中勾选项
    const handleSampleTable = (rows, rowKeys) => {
      markReportListKey(rows, rowKeys);
    }

    // 获取报告编号勾选项key 并查询文件列表
    const handleReportTable = (rows, rowKeys) => {
      markReporTableRows(rows, rowKeys);
    }

    // 删除报告模板
    const handleDelete = () => {
      Modal.confirm({
        title: '删除编制报告',
        content: '是否删除当前选中的编制报告？',
        onOk() {
          markReportDelete(reportTableRowKeys)
        },
        onCancel() {cancelMarkReport()}
      })
    }
    // 作废编制报告
    const handleDisable = () => {
      Modal.confirm({
        title: '作废编制报告',
        content: '是否把当前选中的编制报告作废？',
        onOk() {
          voidMarkReportBtn(reportTableRowKeys)
        },
        onCancel() {cancelMarkReport()}
      })
    }

    // 编制报告 按钮
    const handleMarkReport = () => {
      let arr = [];
      (selectRows || []).map(_ => arr.push(_.orderNo));
      let obj = {};
      obj.reportTemplateIds = templateRowKeys;
      obj.signetIds = qualificationRowKeys;
      obj.taskReportInputIds = selectRowKeys;
      obj.orderNo = arr[0];
      obj.sid = markReportKey;
      markReportBtn(obj)
    }

    // 编制报告  完成按钮
    const handleMarkReportDone = () => {
      markReportDone(reportTableRowKeys)
    }

    // 点击树时调取的接口
    // const handleSelect = (selectedKeys, info) => {
    //   console.log(selectedKeys);
    //   markReportSampleList(selectedKeys);
    //   markReportBtnList(selectedKeys)
    // }
    // 搜索树的匹配规则
    // const isMatch = (item, searchValue) => {
    //   if(item && item.orderNo) {
    //     return (
    //       (item.name && item.name.includes(searchValue))
    //       || (item.code && item.code.includes(searchValue))
    //       || (item.shorthand && item.shorthand.includes(searchValue))
    //       || (item.orderNo && item.orderNo.includes(searchValue))
    //     )
    //   } else {
    //     return (
    //       (item.testName && item.testName.includes(searchValue))
    //       || (item.serialNo && item.serialNo.includes(searchValue))
    //     )
    //   }
    // }
    // 配置树的title名
    // const renderTreeNodeTitle = (item) => {
    //   if (item && item.orderNo) {
    //     return item.orderNo || item.name;
    //   } else {
    //     return item.testName + ' : ' + item.serialNo;
    //   }
    // }

    // 左侧表格列表
    // const handleTablePrepare = (rows, rowKeys) => {
    //   console.log(rows, rowKeys);
    // }
    // 左侧列表点击项
    const handleTableSelect = (click) => {
      markReportSampleList(click && click.id);
      markReportBtnList(click && click.id);
    }

    // 报告领域select
    const handleSearchSelect = (value, option) => {
      markReportTemplateList(value)
    }

    return (
      <div>
        <Spin spinning={isLoading} delay={300} >
          <Row gutter={16} style={{marginLeft: 0, marginRight: 0}}>
            <Col span={4}>
                {/* <SearchableTree
                  categoryData={searchData}          // 存储树 内容
                  onSelect={handleSelect}          // 搜索树列表
                  selectedKeys={[markReportKey + '']}  // 设置选中树节点
                  isMatch={isMatch}
                  renderTitle={renderTreeNodeTitle}
                  maxHeight={80} /> */}
              <AdvancedTable
                mode={'Search'}
                hideRowSelection={true}
                pagination={{pageSize:10, showQuickJumper:true}}
                onSelect={handleTableSelect}
                onPrepare={false}
                isExpanded={false}
                setting={markReportTableListSet}
                data={searchData}
                colNum={'1'}
                simpleSearchKey={[['订单编号','orderOrderNo'],['样品名称','testName'], ['样品编号','serialNo']]}
                avancedSearchForm={false}
                disabledA={true}
              />
            </Col>
            <Col span={20}>
              <Row style={{ margin: '10px 5px'}}>
                <Col xs={7}>
                  <SecurityButtonBox>
                    <Button.Group>
                      <Button key={'rpt.make.report'} icon="file" disabled={!(reportButton)} onClick={handleMarkReport}>编制报告</Button>
                      {/* <Button key={'rpt.make.doneReport'} icon="check" disabled>编制完成</Button> */}
                      <Button key={'rpt.make.preView'} icon="file-text" disabled={!(isTemplate)} onClick={openPreviewWindow}>报告预览</Button>
                    </Button.Group>
                  </SecurityButtonBox>
                </Col>
                <Col xs={14}>
                  <Row>
                    <label style={{marginLeft: 6}}>报告领域 : &nbsp;&nbsp;</label>
                    <SearchableSelector
                      options={{allowClear:true}}
                      disabled={false}
                      lazyMode={false}
                      onSelect={handleSearchSelect}
                      url='/doc/categories/select/1018' />
                  </Row>
                </Col>
              </Row>
              <div className="panel panel-info" style={{margin:0}}>
                <div className="panel-heading">
                  <MarkReportForm
                    signatureData={signatureData}                         // 签章data
                    reportTemplateData={reportTemplateData}               // 报告模板data
                    markReportTemplateList={markReportTemplateList}        // 列表action
                    rowsMarkreportTemplate={rowsMarkreportTemplate}        // 报告模板
                    rowsMarkreportQualification={rowsMarkreportQualification} // 签章
                   />
                </div>
                <div style={{margin: '10px auto'}}>
                  {/* <SampleTable
                    sampleData={sampleData}               // 样品数据
                    onPrepare={handleSampleTable}
                   /> */}
                   <BaseTable
                     options={{pagination: {pageSize:5, showQuickJumper:true}}}
                     isExpanded={false}
                     onPrepare={handleSampleTable}
                     setting={orderTableSet}
                     data={sampleData} />
                </div>
                <div style={{
                  borderBottom: '1px dashed #e9e9e9',
                  margin: '14px 0 24px 0',
                }} />
                <div style={{ margin: '10px 5px'}}>
                  <SecurityButtonBox>
                    <Button.Group>
                      <Button key={'rpt.make.reportDone'} icon="check" disabled={!(!disableReport && !notAllSame && allDisable)} onClick={handleMarkReportDone} >编制完成</Button>
                      <Button key={'rpt.make.checkPDF'} icon="file-pdf" disabled={!(isReportT)} onClick={openPreviewWindowPDF}>查看PDF</Button>
                    </Button.Group>
                    <Button.Group>
                      <Button key={'rpt.make.disabled'} icon="exclamation-circle-o" disabled={!(isMultipleChoice && !notAllSame && allDisable)} onClick={handleDisable}>作废</Button>
                      <Button key={'rpt.make.delete'} icon="delete" disabled={!(isMultipleChoice)} onClick={handleDelete}>删除</Button>
                    </Button.Group>
                  </SecurityButtonBox>
                </div>
                {/* <ReportTable
                  markReportBtnData={markReportBtnData}
                  onPrepare={handleReportTable}
                 /> */}
                 <BaseTable
                   options={{pagination: {pageSize:5, showQuickJumper:true}}}
                   isExpanded={false}
                   onPrepare={handleReportTable}
                   setting={markReportTableSet}
                   data={markReportBtnData} />
              </div>
            </Col>
          </Row>
        </Spin>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    reportTemplateData: state.markReportManagement.get('reportTemplateData'),
    signatureData: state.markReportManagement.get('signatureData'),
    isLoading: state.markReportManagement.get('isLoading'),
    searchData: state.markReportManagement.get('searchData'),
    markReportKey: state.markReportManagement.get('markReportKey'),
    sampleData: state.markReportManagement.get('sampleData'),
    selectRows: state.markReportManagement.get('selectRows'),
    selectRowKeys: state.markReportManagement.get('selectRowKeys'),
    // templateRows: state.markReportManagement.get('templateRows'),
    templateRowKeys: state.markReportManagement.get('templateRowKeys'),
    qualificationRowKeys: state.markReportManagement.get('qualificationRowKeys'),
    markReportBtnData: state.markReportManagement.get('markReportBtnData'),
    reportTableRows: state.markReportManagement.get('reportTableRows'),
    reportTableRowKeys: state.markReportManagement.get('reportTableRowKeys'),
  }
}
function mapDispatchToProps(dispatch, ownProps) {
  return {
    markReportAction: bindActionCreators(markReportAction, dispatch),
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(MarkReportManagement)
