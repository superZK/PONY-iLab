import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as reportArchivedAction from '../../../action/report/reportArchived/reportArchivedAction';
import { Spin, Button, Row, Col, Icon } from 'antd';
import './styles.css';

import BaseTable from "../../../component/public/BaseTable";
import SecurityButtonBox from '../../../component/public/SecurityButtonBox';
import ReportArchivedSetting from './column';

import './styles.css';
import ReportArchiveFilter from './ReportArchiveFilter';
import moment from 'moment';
import AddArchived from './AddArchived';


class ReportArchivedManagement extends Component{

  render() {
    const {
      isLoading,
      editType,
      reportArchivedData,//报告 书库
      reportTableRows,//报告表格 rows
      reportTableRowKeys,//报告表格 rowkeys
      currentReport,//列表 点击项
      reportNumData,//报告扫描出内容
    } = this.props;

    const {
      reportArchivedAction: {
        filterArchivedData,//查询列表接口
        reportArchivedTableRows,//报告 rows
        reportArchivedTable,//报告选中项
        archivedReport,//报告归档 弹框
        reportArchivedDelivery,//报告归档 确认
        reportNumber,//扫描报告编号
        cancelArchived,//弹框 取消
      },
    } = this.props

    const ArchivedTable = ReportArchivedSetting.table.task;
    const reportLocation = (reportArchivedData.length > 0) && reportArchivedData.map(item => item.location);

    // disabled 归档
    const disReportD = reportTableRows.length >= 1;
    const disLocation = (reportLocation[0] === undefined) || (reportLocation[0] === null) || (reportLocation === '');

    // disabled 报告内容
    const isInArray = (arr, value) => {
      for(let i = 0; i < arr.length; i++){
          if(value === arr[i]){
              return true;
          }
        }
      return false;
    }
    const isReportT = isInArray(Object.keys(currentReport), 'id') || (reportTableRowKeys.length === 1);
    const reportKey = (reportTableRowKeys && Number.parseInt(reportTableRowKeys[0], 10)) || (currentReport.id);
    const handleContentUrl = '/report/reportcompile/preview/pdf?reportCompileId=' + reportKey;
    const openPreviewWindow = () => {
      window.open(handleContentUrl, "_blank");
    }

    // 获取列表 勾选项 key
    const handleReportTable = (rows, rowKeys) => {
      reportArchivedTableRows(rows, rowKeys);
    }
    // 报告列表 选中项
    const handleTableSelect = (record) => {
      reportArchivedTable(record);
    }

    // 配置editObject 数据
    const item = [];
    item.dateType = '1';
    item.date = [moment().subtract(3,'month'), moment()];
    // item.location = '6';
    item.queryType = '5';

    return (
      <div>
        <Spin spinning={isLoading} delay={300}>
          <Row>
            <div className="panel panel-info" style={{margin:0}}>
              <div className="panel-heading">
                 <ReportArchiveFilter item={item} filterArchivedData={filterArchivedData} />
              </div>
              <Col offset={1}>
                <div style={{ margin: '10px 0'}}>
                  <SecurityButtonBox>
                    <Button.Group>
                      <Button key={'rpt.archive.reportContents'} icon="eye-o" disabled={!(isReportT)} onClick={openPreviewWindow}>报告内容</Button>
                      <Button key={'rpt.archive.reportArchive'} icon="brush" disabled={!(disReportD && disLocation)} onClick={() => archivedReport()}>归档</Button>
                    </Button.Group>
                  </SecurityButtonBox>
                </div>
              </Col>
              <div style={{margin: '10px auto'}}>
                <BaseTable
                  options={ {pagination:{pageSize: 15, showQuickJumper:true,}} }
                  onSelect={handleTableSelect}
                  onPrepare={handleReportTable}
                  isExpanded={false}
                  setting={ArchivedTable}
                  data={reportArchivedData} />
              </div>
            </div>
            <AddArchived
              visible={editType === '报告归档'}
              onCancel={() => cancelArchived()}
              reportTableRows={reportTableRows}// 列表数据rows
              reportTableRowKeys={reportTableRowKeys}// 列表数据rowKeys
              onFormSubmit={reportArchivedDelivery}//报告归档 确认
              reportNumber={reportNumber}//扫描 报告action
              reportNumData={reportNumData}//扫描出的内容
             />
          </Row>
        </Spin>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    isLoading: state.reportArchivedManagement.get('isLoading'),
    editType: state.reportArchivedManagement.get('editType'),
    reportArchivedData: state.reportArchivedManagement.get('reportArchivedData'),
    reportTableRows: state.reportArchivedManagement.get('reportTableRows'),
    reportTableRowKeys: state.reportArchivedManagement.get('reportTableRowKeys'),
    currentReport: state.reportArchivedManagement.get('currentReport'),
    reportNumData: state.reportArchivedManagement.get('reportNumData'),
  }
}
function mapDispatchToProps(dispatch, ownProps) {
  return {
    reportArchivedAction: bindActionCreators(reportArchivedAction, dispatch),
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(ReportArchivedManagement)
