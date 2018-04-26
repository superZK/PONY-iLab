import {fromJS} from 'immutable';
import { message } from 'antd';
import fetchData, {spliceURL} from '../../../util/fetchGateway';

// Action Types
export const actionTypes = {
  REPORT_PREPARED: 'REPORT_PREPARED',
  REPORT_SELECTED: 'REPORT_SELECTED',
  REPORT_LOAD_START: 'REPORT_LOAD_START',
  REPORT_LOAD_SUCCESS: 'REPORT_LOAD_SUCCESS',
  REPORT_COMMIT_APPROVE_START: 'REPORT_COMMIT_APPROVE_START',
  REPORT_COMMIT_APPROVE_SUCCESS: 'REPORT_COMMIT_APPROVE_SUCCESS',
  TASK_DISPATCH: 'TASK_DISPATCH',
  TASK_DISPATCH_FINISHED: 'TASK_DISPATCH_FINISHED',
  APPROVE_LOG_VIEW: 'APPROVE_LOG_VIEW',
  APPROVE_LOG_VIEW_FINISHED: 'APPROVE_LOG_VIEW_FINISHED',
  REPORT_DISABLE_START: 'REPORT_DISABLE_START',
  REPORT_DISABLE_SUCCESS: 'REPORT_DISABLE_SUCCESS',
  REPORT_ACTIVE_START: 'REPORT_ACTIVE_START',
  REPORT_ACTIVE_SUCCESS: 'REPORT_ACTIVE_SUCCESS'
};

// States
const initialState = fromJS({
  isLoading: false,
  editType: '',
  reportData: [],
  selectedReport: {},
  preparedReports: [],
});

// reducers
export default (state = initialState, action = {}) => {
  switch ( action.type ){
    case actionTypes.REPORT_LOAD_START:
    case actionTypes.REPORT_DISABLE_START:
    case actionTypes.REPORT_ACTIVE_START:
    case actionTypes.REPORT_COMMIT_APPROVE_START:
      return state.set('isLoading', true);
    case actionTypes.REPORT_COMMIT_APPROVE_SUCCESS:
      return state.set('isLoading', false);
    case actionTypes.REPORT_LOAD_SUCCESS:
      return state.set('isLoading', false).set('reportData', action.reportData);
    case actionTypes.APPROVE_LOG_VIEW:
      return state.set('editType', 'approveLog');
    case actionTypes.APPROVE_LOG_VIEW_FINISHED:
      return state.set('editType', '');
    case actionTypes.TASK_DISPATCH:
      return state.set('editType', 'dispatch');
    case actionTypes.TASK_DISPATCH_FINISHED:
      return state.set('editType', '').set('isLoading', true);
    case actionTypes.REPORT_PREPARED:
      return state.set('preparedReports', action.preparedReports);
    case actionTypes.REPORT_SELECTED:
      return state.set('selectedReport', action.selectedReport);
    default:
      return state;
  }
}

// Actions
const asyncLoadReportData = (conditions) => (dispatch, state) => {
  dispatch(actions.loadReportData());
  fetchData('/report/reportcompile/query/vo', {
    body: JSON.stringify(conditions)
  }).then(
    (receipt) => {
      dispatch(actions.loadReportDataSuccess(receipt.data));
    },
    (error) => {console.log(error)}
  );
}

const asyncDisableReports = (type, name) => (dispatch, state) => {
  dispatch(actions.disableReports());
  fetchData('/doc/categories/type/' + type, {}).then(
    (receipt) => {
      dispatch(actions.disableReportSucess({
        id: 0,
        code: 'R'+type,
        name: name,
        shorthand: '',
        type: type
      }, receipt.data));
    },
    (error) => {console.log(error)}
  );
}

const asyncActiveReports = (type, name) => (dispatch, state) => {
  dispatch(actions.activeReports());
  fetchData('/doc/categories/type/' + type, {}).then(
    (receipt) => {
      dispatch(actions.activeReportSucess({
        id: 0,
        code: 'R'+type,
        name: name,
        shorthand: '',
        type: type
      }, receipt.data));
    },
    (error) => {console.log(error)}
  );
}

const asyncCommitApprove = (processesId, memo) => (dispatch, state) => {
  dispatch(actions.commitApprove());
  fetchData(spliceURL('/sys/wf/app/start', {memo}), {
    body: JSON.stringify(processesId)
  }).then(
    (receipt) => {
      console.log("===>>>");
      console.log(receipt);
      dispatch(actions.commitApproveSuccess());
      if(receipt.code === '0'){
        message.success('提交审核成功');
      }
    },
    (error) => {console.log(error)}
  );
}

const asyncDispatchTask = (dispatchData) => (dispatch, state) => {
  dispatch(actions.dispatchTask());
  fetchData('/sys/wf/app/assign', {
    body: JSON.stringify(dispatchData)
  }).then(
    (receipt) => {
      dispatch(actions.dispatchTaskFinish());
    },
    (error) => {console.log(error)}
  );
}

export const actions = {
  loadReportData: () => ({type: actionTypes.REPORT_LOAD_START}),
  loadReportDataSuccess: (reportData) => ({type: actionTypes.REPORT_LOAD_SUCCESS, reportData}),
  dispatchTask: () => ({type: actionTypes.TASK_DISPATCH}),
  dispatchTaskCancel: () => ({type: actionTypes.TASK_DISPATCH_FINISHED}),
  dispatchTaskFinish: () => ({type: actionTypes.TASK_DISPATCH_FINISHED}),
  commitApprove: () => ({type: actionTypes.REPORT_COMMIT_APPROVE_START}),
  commitApproveSuccess: () => ({type: actionTypes.REPORT_COMMIT_APPROVE_SUCCESS}),
  viewApproveLog: () => ({type: actionTypes.APPROVE_LOG_VIEW}),
  viewApproveLogFinish: () => ({type: actionTypes.APPROVE_LOG_VIEW_FINISHED}),
  disableReports: () => ({type: actionTypes.REPORT_DISABLE_START}),
  disableReportSucess: () => ({type: actionTypes.REPORT_DISABLE_SUCCESS}),
  handleDataPrepare: (preparedReports, preparedReportsKey) => ({type: actionTypes.REPORT_PREPARED, preparedReports}),
  handleDataSelect: (selectedReport) => ({type: actionTypes.REPORT_SELECTED, selectedReport}),
  asyncLoadReportData,
  asyncDisableReports,
  asyncActiveReports,
  asyncDispatchTask,
  asyncCommitApprove
};
