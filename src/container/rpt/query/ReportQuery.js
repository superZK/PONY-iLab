import React, {Component} from 'react';
import {Spin, Button, Icon} from 'antd';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import { rpt_query_reportQueryActions } from '../../../modules';
import BaseForm from "../../../component/public/BaseForm";
import SearchableTable from "../../../component/public/SearchableTable";
import SecurityButtonBox from "../../../component/public/SecurityButtonBox";
import ApproveLogDialog from "../../../component/public/wf/ApproveLogDialog";
import ReportTaskDispatchDialog from "./ReportTaskDispatchDialog";
import settings from './setting';
import './index.css';
import moment from 'moment';

class ReportQuery extends Component{

  constructor(props){
    super(props);
    this.handleQuery = this.handleQuery.bind(this);
    this.handleCommitApprove = this.handleCommitApprove.bind(this);
  }

  componentDidMount() {
    let obj = {};
    obj.dateType = '1';
    obj.startDate = moment().subtract(1,'month').format('YYYY-MM-DD');
    obj.endDate = moment().format('YYYY-MM-DD');
    this.props.asyncLoadReportData(obj);
  }



  handleQuery(values){
    let condition = {};
    condition.dateType = values.dateType;
    condition.startDate = values.dateRange[0].format("YYYY-MM-DD");
    condition.endDate = values.dateRange[1].format("YYYY-MM-DD");
    condition.queryType = values.commonConditions;
    condition.keyWord = values.keyWord;
    let { asyncLoadReportData } = this.props;
    asyncLoadReportData(condition);
  }

  handleCommitApprove(){
    let processesId = this.props.preparedReports.map(x => x.process.id);
    this.props.asyncCommitApprove(processesId, '');
  }

  render(){
    const conditionsFormSetting = settings.form.queryConditions; // 查询条件表单配置
    const reportTableSetting = settings.table.reports; // 报告列表配置

    const singlePrepared = (this.props.preparedReports && this.props.preparedReports.length === 1);
    const multiPrepared = (this.props.preparedReports && this.props.preparedReports.length > 1);

    const currentProcessId = (singlePrepared && this.props.preparedReports[0].process) ? this.props.preparedReports[0].process.id : 0;

    const reportId = (singlePrepared && this.props.preparedReports[0].id) ? this.props.preparedReports[0].id : '';

    // 配置editObject 数据
    const item = [];
    item.dateType = '1';
    item.dateRange = [moment().subtract(1,'month'), moment()];

    // 查看内容
    const handleContentUrl = '/report/reportcompile/preview/pdf?reportCompileId=' + reportId;
    const openPreviewWindow = () => {
      window.open(handleContentUrl, "_blank");
    }

    return (
      <div>
        <Spin spinning={false} delay={300} >
          <div className="panel panel-info" style={{margin:0}}>
            <div className="panel-heading">
              <BaseForm
                colNum = {'1'}
                setting = {conditionsFormSetting}
                footerRule = {'确认'}
                editObject = {item}
                submitTitleClass = {{marginLeft:10, transform: 'translate(-8px, -10px)'}}
                onFormSubmitSuccess = {this.handleQuery}
              />
            </div>
            <div className="panel-heading">
              <SecurityButtonBox>
                <Button style={{marginLeft: 10}} key={'rpt.query.dispatch'} onClick={this.props.dispatchTask} disabled={!(singlePrepared || multiPrepared)} icon="file-add" > 任务调度 </Button>
                <Button style={{marginLeft: 10}} key={'rpt.query.commitApprove'} onClick={this.handleCommitApprove} disabled={!(singlePrepared || multiPrepared)} icon="file-add" > 提交审核 </Button>
                <Button style={{marginLeft: 10}} key={'rpt.query.approveLog'} onClick={this.props.viewApproveLog} disabled={!singlePrepared} icon="edit"> 审核记录 </Button>
                <Button style={{marginLeft: 10}} key={'rpt.query.view'} disabled={!singlePrepared} icon="eye-o" onClick={openPreviewWindow}>查看内容</Button>
                <Button style={{marginLeft: 10}} key={'rpt.query.disable'} icon="delete"  > 废弃 </Button>
              </SecurityButtonBox>
            </div>
            <div className="panel-body">
              <SearchableTable
                options={ {pagination:{pageSize:10, showQuickJumper:true,}} }
                isExpanded={false}
                colNum={'1'}
                simpleSearchKey={['orderNo', 'reportNo']}
                avancedSearchForm={false}
                onPrepare={this.props.handleDataPrepare}
                onSelect = {this.props.handleDataSelect}
                setting={reportTableSetting}
                data={this.props.reportData} />
            </div>
            <ReportTaskDispatchDialog
              visible = {this.props.editType === 'dispatch'}
              reportsId = {this.props.preparedReports.length > 0 && this.props.preparedReports.map(x => x.id)}
              editType = {this.props.editType}
              onOk = {this.props.asyncDispatchTask}
              onCancel = {this.props.dispatchTaskFinish} />
            <ApproveLogDialog
              visible = {this.props.editType === 'approveLog'}
              onCancel = {this.props.viewApproveLogFinish}
              processId = {currentProcessId} />
          </div>
        </Spin>
      </div>
    );
  }

}

// bind to container
const mapStateToProps = (state) =>
  ({
    isLoading : state.rpt_query_reportQuery.get('isLoading'),
    editType: state.rpt_query_reportQuery.get('editType'),
    reportData : state.rpt_query_reportQuery.get('reportData'),
    selectedReport : state.rpt_query_reportQuery.get('selectedReport'),
    preparedReports : state.rpt_query_reportQuery.get('preparedReports'),
  });

const mapDispatchToProps = (dispatch, ownProps) => {
  return bindActionCreators(rpt_query_reportQueryActions, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(ReportQuery);
