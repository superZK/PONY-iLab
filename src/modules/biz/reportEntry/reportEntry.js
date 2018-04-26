import {fromJS} from 'immutable';
import { message } from 'antd';
import fetchData, { fieldMapper } from '../../../util/fetchGateway';
import { findNodeById, spliceUrlByParams, findParentById, removeNodeById, replaceNodeById, analysisDataIndex } from '../../../util/treeUtils';

// actions
// 加载样品数据
const asyncLoadSample = () => (dispatch, state) => {
  dispatch(actions.asyncLoadSampleStart());
  let url = '/biz/order/report/sample/query';
  let intOptions = {'key':'id'};
  fetchData(url, {},  fieldMapper(intOptions)).then(
    (receipt) => {
      dispatch(actions.asyncLoadSampleSuccess(receipt.data));
    },
    (error) => {
      console.log(error);
    }
  )
}

// 获取样品表格点击项，并加载任务数据
const asyncLoadTask = (sample) => (dispatch, state) => {
  if(!sample) return;
  dispatch(actions.asyncLoadTaskStart(sample));
  let sampleId = sample.id;
  let url = '/biz/order/report/task/query?sid=' + sampleId;
  fetchData(url, {}).then(
    (receipt) => {
      dispatch(actions.asyncLoadTaskSuccess(receipt.data));
    },
    (error) => {
      console.log(error);
    }
  )
}

// 获取任务表格点击项，并加载结果项数据
const asyncLoadResult = (task) => (dispatch, state) => {
  if(!task) return;
  let taskId = task.id;
  dispatch(actions.asyncLoadResultStart(task));
  let url = '/biz/order/report/result/query?sid=' + taskId;
  fetchData(url, {}).then(
    (receipt) => {
      dispatch(actions.asyncLoadResultSuccess(receipt.data));
    },
    (error) => {
      console.log(error);
    }
  )
}

// 保存结果项
const asyncSaveResult = (resultData, task) => (dispatch, state) => {
  if(!resultData.length > 0) return;
  dispatch(actions.asyncSaveResultStart());
  let taskId = task.id;
  let url = '/biz/order/report/presave?sid=' + taskId;
  fetchData(url, {
    body: JSON.stringify(resultData)
  }).then(
    (receipt) => {
      dispatch(actions.asyncSaveResultSuccess(receipt.data));
      if(receipt.code === '0'){
        message.success('结果项保存成功!');
      }
      asyncLoadResult(task)(dispatch, state);
    },
    (error) => {
      dispatch(actions.asyncSaveResultFail());
      console.log(error);
    }
  )
}

// 报告项操作
const asyncSetReportable = (recoredIds, task) => (dispatch, state) => {
  dispatch(actions.asyncSetReportableStart());
  let url = '/biz/order/report/update/reportable';
  fetchData(url, {
    body: JSON.stringify(recoredIds)
  }).then(
    (receipt) => {
      dispatch(actions.asyncSetReportableSuccess());
      asyncLoadResult(task)(dispatch, state);
    },
    (error) => {
      console.log(error);
    }
  )
}

// 指定审核人
const asyncAddVerifier = (verifierId, selectedRecodIds, task) => (dispatch, state) => {
  dispatch(actions.asyncAddVerifierStart());
  let url = '/biz/order/report/verifier?verifierId=' + verifierId;
  fetchData(url, {
    body: JSON.stringify(selectedRecodIds)
  }).then(
    (receipt) => {
      dispatch(actions.asyncAddVerifierSuccess());
      if(receipt.code === '0'){
        message.success('指定审核人成功!');
      }
      asyncLoadResult(task)(dispatch, state);
    },
    (error) => {
      console.log(error);
    }
  )
}

// 提交审核
const asyncSubmitReview = (sample, task, recordIds) => (dispatch, state) => {
  dispatch(actions.asyncSubmitReviewStart());
  let tid = task.id;
  let url = '/biz/order/report/submitReview?tid=' + tid;
  fetchData(url, {
    body: JSON.stringify(recordIds)
  }).then(
    (receipt) => {
      dispatch(actions.asyncSubmitReviewSuccess());
      if(receipt.code === '0'){
        message.success('提交审核成功');
      }
      asyncLoadSample()(dispatch, state);
      asyncLoadTask(sample)(dispatch, state);
      asyncLoadResult(task)(dispatch, state);
    },
    (error) => {
      console.log(error);
    }
  )
}

export const actions = {
    // 加载样品数据
    asyncLoadSample,
    asyncLoadSampleStart: () => ({type: actionTypes.ASYNC_LOAD_SAMPLE_START}),
    asyncLoadSampleSuccess: (sampleData) => ({type: actionTypes.ASYNC_LOAD_SAMPLE_SUCCESS, sampleData: sampleData,}),
    // 加载任务数据
    asyncLoadTaskStart: (currentSample) => ({type: actionTypes.GET_CURRENT_SAMPLE, currentSample: currentSample,}),
    asyncLoadTaskSuccess: (taskData) => ({type: actionTypes.ASYNC_LOAD_TASK_SUCCESS, taskData: taskData,}),
    asyncLoadTask,
    // 加载结果项数据
    asyncLoadResultStart: (currentTask) => ({type: actionTypes.GET_CURRENT_TASK, currentTask: currentTask,}),
    asyncLoadResultSuccess: (resultData) => ({type: actionTypes.ASYNC_LOAD_RESULT_SUCCESS, resultData: resultData,}),
    asyncLoadResult,
    // 保存结果项
    asyncSaveResultStart: () => ({type: actionTypes.ASYNC_SAVE_RESULT_START}),
    asyncSaveResultSuccess: (editedResult) => ({type: actionTypes.ASYNC_SAVE_RESULT_SUCCESS, editedResult: editedResult}),
    asyncSaveResultFail: () => ({type: actionTypes.ASYNC_SAVE_RESULT_FAIL}),
    asyncSaveResult,
    // 获取结果项表格勾选项
    preparedItem: (preparedKeys) => ({type: actionTypes.PREPARED_ITEM, preparedKeys: preparedKeys,}),
    // 报告项操作
    asyncSetReportableStart: () => ({type: actionTypes.ASYNC_SET_REPORTABLE_START}),
    asyncSetReportableSuccess: () => ({type: actionTypes.ASYNC_SET_REPORTABLE_SUCCESS}),
    asyncSetReportable,
    // 指定审核人
    addVerifier: () => ({type: actionTypes.ADD_VERIFIER}),
    asyncAddVerifierStart: () => ({type: actionTypes.ASYNC_ADD_VERIFIER_START}),
    asyncAddVerifierSuccess: () => ({type: actionTypes.ASYNC_ADD_VERIFIER_SUCCESS}),
    asyncAddVerifier,
    // 提交审核
    asyncSubmitReviewStart: () => ({type: actionTypes.ASYNC_SUBMIT_REVIEW_START}),
    asyncSubmitReviewSuccess: () => ({type: actionTypes.ASYNC_SUBMIT_REVIEW_SUCCESS}),
    asyncSubmitReview,
    // 取消操作
    cancelHandle: () => ({type: actionTypes.CANCEL_HANDLE}),
};

// action types
export const actionTypes = {
  ASYNC_LOAD_SAMPLE_START: 'ASYNC_LOAD_SAMPLE_START',
  ASYNC_LOAD_SAMPLE_SUCCESS: 'ASYNC_LOAD_SAMPLE_SUCCESS',
  GET_CURRENT_SAMPLE: 'GET_CURRENT_SAMPLE',
  ASYNC_LOAD_TASK_SUCCESS: 'ASYNC_LOAD_TASK_SUCCESS',
  GET_CURRENT_TASK: 'GET_CURRENT_TASK',
  ASYNC_LOAD_RESULT_SUCCESS: 'ASYNC_LOAD_RESULT_SUCCESS',
  ASYNC_SAVE_RESULT_START: 'ASYNC_SAVE_RESULT_START',
  ASYNC_SAVE_RESULT_SUCCESS: 'ASYNC_SAVE_RESULT_SUCCESS',
  ASYNC_SAVE_RESULT_FAIL: 'ASYNC_SAVE_RESULT_FAIL',
  PREPARED_ITEM: 'PREPARED_ITEM',
  ASYNC_SET_REPORTABLE_START: 'ASYNC_SET_REPORTABLE_START',
  ASYNC_SET_REPORTABLE_SUCCESS: 'ASYNC_SET_REPORTABLE_SUCCESS',
  ADD_VERIFIER: 'ADD_VERIFIER',
  ASYNC_ADD_VERIFIER_START: 'ASYNC_ADD_VERIFIER_START',
  ASYNC_ADD_VERIFIER_SUCCESS: 'ASYNC_ADD_VERIFIER_SUCCESS',
  ASYNC_SUBMIT_REVIEW_START: 'ASYNC_SUBMIT_REVIEW_START',
  ASYNC_SUBMIT_REVIEW_SUCCESS: 'ASYNC_SUBMIT_REVIEW_SUCCESS',
  CANCEL_HANDLE: 'CANCEL_HANDLE',
};

// reducers
const initialState = fromJS({
  isLoading: false,
  editType: '',
  sampleData: [],
  currentSample: {},
  taskData: [],
  currentTask: {},
  resultData: [],
  preparedKey: [],
});

export default (state = initialState, action = {}) => {
  switch ( action.type ){
    case actionTypes.ASYNC_LOAD_SAMPLE_START:
    case actionTypes.ASYNC_SAVE_RESULT_START:
    case actionTypes.ASYNC_SET_REPORTABLE_START:
    case actionTypes.ASYNC_ADD_VERIFIER_START:
    case actionTypes.ASYNC_SUBMIT_REVIEW_START:
      return state.set('isLoading', true);
    case actionTypes.ASYNC_LOAD_SAMPLE_SUCCESS:
      let sampleData = action.sampleData;
      return state.set('isLoading', false).set('sampleData', sampleData).set('currentSample', {}).set('taskData', []).set('currentTask', {}).set('resultData', []);
    case actionTypes.GET_CURRENT_SAMPLE:
      let currentSample = action.currentSample;
      return state.set('isLoading', true).set('currentSample', currentSample);
    case actionTypes.ASYNC_LOAD_TASK_SUCCESS:
      let taskData = action.taskData;
      return state.set('isLoading', false).set('taskData', taskData).set('currentTask', {}).set('resultData', []);
    case actionTypes.GET_CURRENT_TASK:
      let currentTask = action.currentTask;
      return state.set('isLoading', true).set('currentTask', currentTask);
    case actionTypes.ASYNC_LOAD_RESULT_SUCCESS:
      let originData = action.resultData;
      let resultData = originData.map( (item) => {
        item.measureUnit = item.measureUnit ? item.measureUnit : {id: null, name: null};
        item.transferOrigin = item.originalResults;
        item.transferUnit = analysisDataIndex(item, 'measureUnit.id');
        return item;
      } );
      for(let i = 0; i < resultData.length; i++){
        resultData[i].key = `${i + 1}`;
      }
      return state.set('isLoading', false).set('resultData', resultData);
    case actionTypes.ASYNC_SAVE_RESULT_SUCCESS:
      return state.set('isLoading', false);
    case actionTypes.PREPARED_ITEM:
      let preparedKeys = action.preparedKeys;
      return state.set('preparedKey', preparedKeys);
    case actionTypes.ADD_VERIFIER:
      return state.set('isLoading', true).set('editType', '添加审核人');
    case actionTypes.ASYNC_SET_REPORTABLE_SUCCESS:
    case actionTypes.ASYNC_ADD_VERIFIER_SUCCESS:
    case actionTypes.ASYNC_SUBMIT_REVIEW_SUCCESS:
    case actionTypes.CANCEL_HANDLE:
    case actionTypes.ASYNC_SAVE_RESULT_FAIL:
      return state.set('isLoading', false).set('editType', '');
    default :
      return state;
  }
};