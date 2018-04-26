import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as reportSentAction from '../../../action/report/reportSent/reportSentAction';
import { Spin, Button, Row, Col, Icon } from 'antd';
import './styles.css';
import fetchData from '../../../util/fetchGateway';

import { isAllActiveOrDisable } from '../../../util/getPreparedItems';

import BaseTable from "../../../component/public/BaseTable";
import SecurityButtonBox from '../../../component/public/SecurityButtonBox';
import ApproveLogDialog from "../../../component/public/wf/ApproveLogDialog";
import ReportSentSetting from './column';
import moment from 'moment';

import ReportSentForm from './ReportSentForm';
import DeliveryReport from './DeliveryReport';// 交付报告 弹窗
import UnDeliveryReport from './UnDeliveryReport';// 取消交付 弹框
import ReportSentFormFilter from './ReportSentFormFilter';// 查询form


class ReportSentManagement extends Component{
  state = {
    account: '',
  }

  // 获取用户信息
  getSeverInfo = () => {
    fetchData('/sys/mode', {}).then(
      (receipt) => {
        this.setState({
          account: receipt.data && receipt.data[0] ? receipt.data[0].account : '',
        });
      },
      (error) => {console.log(error)}
    );
  }

  render() {
    const {
      isLoading,
      editType,
      reportSentData,            // 报告 书库
      reportTableRows,           // 报告表格 rows
      reportTableRowKeys,        // 报告表格 rowkeys
      currentReport,             // 报告表格 点击项
      reportMethodData,          // 交付方式
      reportGoodsData,           // 交付物
      deliveryData,              // 交付记录列表 save返回数据
      reportDRows,               // 交付记录列表 rows
      reportDRowKeys,            // 交付记录列表 rowKeys
    } = this.props;

    const {
      reportSentAction: {
        reportSentList,                // 报告列表
        reportSentTableRows,           // 报告 rows
        reportSentTableSelect,         // 报告点击项
        reportMethodList,              // 交付方式
        reportGoodsList,               // 交付物
        deliveryReport,                // 交付报告 弹框
        reportSentVerify,              // 交付报告 验证
        reportApprovedMemo,            // 审核记录弹框
        reportDeliveryRows,            // 交付记录列表 rows
        reportSentDeliveryR,           // 交付记录列表
        unDeliveryReport,              // 取消交付 弹框
        unReportSentDelivery,          // 取消交付 确认
        cancelReportSent,              // 弹框 取消
      },
    } = this.props

    const {account} = this.state;

    const reportDList = ReportSentSetting.table.report;// 报告列表
    const DeliveryTable = ReportSentSetting.table.task; // 定义交付记录table

    // disabled 交付报告
    const disDelivery = (reportMethodData.length > 0) && (reportGoodsData.length > 0);
    const disReportSent = (Object.keys(currentReport).length > 0) || (reportTableRows.length > 0);

    // disabled 审批记录
    const singlePrepared = (reportTableRows && reportTableRows.length === 1); // dis审批记录
    const processId = (singlePrepared && reportTableRows[0].process) ? reportTableRows[0].process.id : 0;
    // disabled 报告内容
    const isReportT = (Object.keys(currentReport).length > 0) || (reportTableRowKeys.length === 1);
    const reportKey = (reportTableRowKeys && Number.parseInt(reportTableRowKeys[0], 10)) || (currentReport.id);
    const handleContentUrl = '/report/reportcompile/preview/pdf?reportCompileId=' + reportKey;
    const openPreviewWindow = () => {
      window.open(handleContentUrl, "_blank");
    }

    // disabled 取消交付
    const isMultipleChoice = reportDRows.length >= 1;
    const notAllSame = isAllActiveOrDisable(reportDRows, 'delivery') === 'notAllSame';
    const allDisable = isAllActiveOrDisable(reportDRows, 'delivery') === 'allDisable';

    // 获取报告编号 列表 勾选项key
    const handleReportTable = (rows, rowKeys) => {
      reportSentTableRows(rows, rowKeys);
    }
    // 报告列表 选中项
    const handleTableSelect = (record) => {
      reportSentTableSelect(record);
      reportSentDeliveryR(record.id)
    }
    // 交付记录
    const handleTablePrepare = (rows, rowKeys) => {
      reportDeliveryRows(rows, rowKeys);
    }

    // 交付报告弹框 用户名 密码
    const handleDeliveryReport = () => {
      this.refs.sentForm.validateFieldsAndScroll((err, val) => {
        if(!err) {
          deliveryReport()
        }
      })
    }

    // 配置editObject 数据
    const item = [];
    item.dateType = '1';
    item.date = [moment(), moment()];

    return (
      <div>
        <Spin spinning={isLoading} delay={300} >
          <Row>
            <div className="panel panel-info" style={{margin:0}}>
              {/* 查询模块 */}
              <ReportSentFormFilter item={item} reportSentList={reportSentList} />
              {/* 交付物 / 交付方式 */}
              <div className="panel-heading">
                 <ReportSentForm
                   ref='sentForm'
                   reportMethodList={reportMethodList}// 交付方式
                   reportGoodsList={reportGoodsList} />
              </div>
              <div className="panel-body">
                <Col offset={1}>
                  <div style={{ marginBottom: '15px'}}>
                    <SecurityButtonBox>
                      <Button.Group>
                        <Button key={'rpt.deliver.reportContent'} icon="eye-o" disabled={!(isReportT)} onClick={openPreviewWindow}>报告内容</Button>
                        <Button key={'rpt.deliver.reportApproval'} icon="bars" disabled={!(singlePrepared)} onClick={reportApprovedMemo}>审批记录</Button>
                        <Button key={'rpt.deliver.reportDelivery'} icon="printer" disabled={!(disDelivery && disReportSent)} onClick={handleDeliveryReport}>交付报告</Button>
                      </Button.Group>
                    </SecurityButtonBox>
                  </div>
                </Col>
                <div style={{margin: '10px auto'}}>
                  <BaseTable
                   options={{pagination: {pageSize:5, showQuickJumper:true}}}
                   onSelect={handleTableSelect}
                   isExpanded={false}
                   onPrepare={handleReportTable}
                   setting={reportDList}
                   data={reportSentData} />
                </div>
                <div style={{borderBottom: '1px dashed #e9e9e9', margin: '20px 0'}} />
                <Col offset={1}>
                  <div style={{marginBottom: '15px'}}>
                    <SecurityButtonBox>
                      <Button key={'rpt.deliver.reportCancel'} disabled={!(isMultipleChoice && !notAllSame && allDisable)} onClick={() => unDeliveryReport()}>取消交付</Button>
                    </SecurityButtonBox>
                  </div>
                </Col>
                <BaseTable
                  options={ {pagination:{pageSize:5, showQuickJumper:true,}} }
                  isExpanded={false}
                  onPrepare={handleTablePrepare}
                  setting={DeliveryTable}
                  data={deliveryData} />
              </div>
            </div>
          </Row>
        </Spin>
        <DeliveryReport
          visible={editType === '交付报告'}
          sentForm={this.refs.sentForm}
          account={account}
          reportSentVerify={reportSentVerify}  // 交付 验证接口
          reportTableRowKeys={reportTableRowKeys}   // 列表key
          onCancel={() => cancelReportSent()} />
        <UnDeliveryReport
          visible={editType === '取消交付'}
          account={account}
          reportDRowKeys={reportDRowKeys}
          unReportSentDelivery={unReportSentDelivery}
          onCancel={() => cancelReportSent()} />
         <ApproveLogDialog
           visible={editType === 'approveLog'}
           onCancel={cancelReportSent}
           processId={processId} />
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    isLoading: state.reportSentManagement.get('isLoading'),
    editType: state.reportSentManagement.get('editType'),
    reportSentData: state.reportSentManagement.get('reportSentData'),
    reportTableRows: state.reportSentManagement.get('reportTableRows'),
    reportTableRowKeys: state.reportSentManagement.get('reportTableRowKeys'),
    currentReport: state.reportSentManagement.get('currentReport'),
    reportMethodData: state.reportSentManagement.get('reportMethodData'),
    reportGoodsData: state.reportSentManagement.get('reportGoodsData'),
    deliveryData: state.reportSentManagement.get('deliveryData'),
    reportDRows: state.reportSentManagement.get('reportDRows'),
    reportDRowKeys: state.reportSentManagement.get('reportDRowKeys'),
  }
}
function mapDispatchToProps(dispatch, ownProps) {
  return {
    reportSentAction: bindActionCreators(reportSentAction, dispatch),
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(ReportSentManagement)
