import {fromJS} from 'immutable';
import fetchData from '../../../util/fetchGateway';

// Action Types
export const actionTypes = {
  REPORT_LOAD_START: 'REPORT_LOAD_START',
  REPORT_LOAD_SUCCESS: 'REPORT_LOAD_START',
  

  REPORT_LOAD_SUCCESS: 'REPORT_LOAD_SUCCESS',
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
      return state.set('isLoading', true);
    case actionTypes.TASK_DISPATCH_FINISHED:
    case actionTypes.APPROVE_LOG_VIEW_FINISHED:
      return state.set('editType', '');
    case actionTypes.TASK_DISPATCH:
      return state.set('editType', 'dispatch');
    case actionTypes.APPROVE_LOG_VIEW:
      return state.set('editType', 'approveLog');
    default:
      return state;
  }
}

// Actions
const asyncLoadReportData = (type, name) => (dispatch, state) => {
  dispatch(actions.loadReportData());
  fetchData('/doc/categories/type/' + type, {}).then(
    (receipt) => {
      dispatch(actions.loadDataSuccess({
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

export const actions = {
  loadReportData: () => ({type: actionTypes.REPORT_LOAD_START}),
  loadReportDataSuccess: (reportData) => ({type: actionTypes.CATEGORY_MANAGEMENT_DATA_LOAD_SUCCESS, reportData}),
  dispatchTask: () => ({type: actionTypes.TASK_DISPATCH}),
  dispatchTaskFinish: (dispatchData) => ({type: actionTypes.TASK_DISPATCH_FINISHED, dispatchData}),
  viewApproveLog: () => ({type: actionTypes.APPROVE_LOG_VIEW}),
  viewApproveLogFinish: () => ({type: actionTypes.APPROVE_LOG_VIEW_FINISHED}),
  disableReports: () => ({type: actionTypes.REPORT_DISABLE_START}),
  disableReportSucess: () => ({type: actionTypes.REPORT_DISABLE_SUCCESS}),
  activeReports: () => ({type: actionTypes.REPORT_ACTIVE_START}),
  activeReportSucess: () => ({type: actionTypes.REPORT_ACTIVE_SUCCESS}),
  asyncLoadReportData,
  asyncDisableReports,
  asyncActiveReports
};
