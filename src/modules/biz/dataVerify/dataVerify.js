import {fromJS} from 'immutable';
import { message } from 'antd';
import fetchData from '../../../util/fetchGateway';
import { findNodeById, spliceUrlByParams, findParentById, removeNodeById, replaceNodeById, analysisDataIndex } from '../../../util/treeUtils';

/**
 * 数据审核：扁平化样品与任务数据
 */
const flattenSampleTask = (data) => {
  if(!data) return;
  let arr = [];
  data.map((item) => {
    // 样品数据层
    let obj = {};
    obj.taskArray = [];
    obj.sampleId = item.id || '';
    obj.serialNo = item.serialNo || '';
    obj.testName = item.testName || '';
    // 任务数据层
    if(item.sampleTestTask.length > 0){
      item.sampleTestTask.map((task) => {
        let taskObj = {};
        taskObj.taskId = task.id || '';
        taskObj.testItemName = analysisDataIndex(task, 'docProductTestFlow.testItem.name') || '';
        taskObj.testMethodName = analysisDataIndex(task, 'docProductTestFlow.testMethod.methodNameZH') || '';
        taskObj.testStandardName = analysisDataIndex(task, 'docProductTestFlow.testStandard.name') || '';
        obj.taskArray.push(taskObj);
      })
    }
    arr.push(obj);
  });
  let sampleTaskArr = [];
  arr.map((item) => {
    let obj = {};
    obj.sampleId = item.sampleId || '';
    obj.serialNo = item.serialNo || '';
    obj.testName = item.testName || '';
    if(item.taskArray.length > 0){
      item.taskArray.map((task) => {
        let stObj = Object.assign({}, obj);
        stObj.taskId = task.taskId || '';
        stObj.testItemName = task.testItemName || '';
        stObj.testStandardName = task.testStandardName || '';
        stObj.testMethodName = task.testMethodName || '';
        sampleTaskArr.push(stObj);
      });
    }else{
      obj.taskId = '';
      obj.testItemName = '';
      obj.testStandardName = '';
      obj.testMethodName = '';
      sampleTaskArr.push(obj);
    }
  });
  for(let i = 0; i < sampleTaskArr.length; i++){
    sampleTaskArr[i].key = (i + 1) + '';
  }
  return sampleTaskArr;
}

// actions
// 加载订单数据
const asyncLoadOrder = () => (dispatch, state) => {
  dispatch(actions.asyncLoadOrderStart());
  let url = '/biz/order/examine/order/query';
  fetchData(url, {}).then(
    (receipt) => {
      dispatch(actions.asyncLoadOrderSuccess(receipt.data));
    },
    (error) => {
      console.log(error);
    }
  )
}

// 加载样品与任务数据
const asyncLoadSampleTask = (order) => (dispatch, state) => {
  if(!order) return;
  let oid = order.id;
  dispatch(actions.asyncLoadSampleTaskStart());
  let url = '/biz/order/examine/sample/query?oid=' + oid;
  fetchData(url, {}).then(
    (receipt) => {
      dispatch(actions.asyncLoadSampleTaskSuccess(receipt.data, order));
    },
    (error) => {
      console.log(error);
    }
  )
}

// 加载结果项数据
const asyncLoadResult = (sampleTask) => (dispatch, state) => {
  if(!sampleTask) return;
  let tid = sampleTask.taskId || '';
  dispatch(actions.asyncLoadResultStart());
  let url = '/biz/order/examine/result/query?tid=' + tid;
  fetchData(url, {}).then(
    (receipt) => {
      dispatch(actions.asyncLoadResultSuccess(receipt.data, sampleTask));
    },
    (error) => {
      console.log(error);
    }
  )
}

// 样品审核
const asyncVerifySample = (verify, order, sampleTask) => (dispatch, state) => {
  dispatch(actions.asyncVerifySampleStart());
  let url = '/biz/order/examine/sample/verify';
  fetchData(url, {
    body: JSON.stringify(verify)
  }).then(
    (receipt) => {
      dispatch(actions.asyncVerifySampleSuccess(receipt.data));
      if(receipt.code === '0'){
        message.success('完成审核!');
      }
      asyncLoadOrder()(dispatch, state);
      asyncLoadSampleTask(order)(dispatch, state);
      asyncLoadResult(sampleTask)(dispatch, state);
    },
    (error) => {
      console.log(error);
    }
  )
}

// 分样审核
const asyncVerifySubSample = (verify, order, sampleTask) => (dispatch, state) => {
  dispatch(actions.asyncVerifySubSampleStart());
  let url = '/biz/order/examine/subSample/verify';
  fetchData(url, {
    body: JSON.stringify(verify)
  }).then(
    (receipt) => {
      dispatch(actions.asyncVerifySubSampleSuccess(receipt.data));
      if(receipt.code === '0'){
        message.success('完成审核!');
      }
      asyncLoadOrder()(dispatch, state);
      asyncLoadSampleTask(order)(dispatch, state);
      asyncLoadResult(sampleTask)(dispatch, state);
    },
    (error) => {
      console.log(error);
    }
  )
}

//检测项目审核
const asyncVerifyTask = (verify, order, sampleTask) => (dispatch, state) => {
  dispatch(actions.asyncVerifyTaskStart());
  let url = '/biz/order/examine/task/verify';
  fetchData(url, {
    body: JSON.stringify(verify)
  }).then(
    (receipt) => {
      dispatch(actions.asyncVerifyTaskSuccess(receipt.data));
      if(receipt.code === '0'){
        message.success('完成审核!');
      }
      asyncLoadOrder()(dispatch, state);
      asyncLoadSampleTask(order)(dispatch, state);
      asyncLoadResult(sampleTask)(dispatch, state);
    },
    (error) => {
      console.log(error);
    }
  )
}

// 结果项审核
const asyncVerifyResult = (verify, order, sampleTask) => (dispatch, state) => {
  dispatch(actions.asyncVerifyResultStart());
  let url = '/biz/order/examine/result/verify';
  fetchData(url, {
    body: JSON.stringify(verify)
  }).then(
    (receipt) => {
      dispatch(actions.asyncVerifyResultSuccess(receipt.data));
      if(receipt.code === '0'){
        message.success('完成审核!');
      }
      asyncLoadOrder()(dispatch, state);
      asyncLoadSampleTask(order)(dispatch, state);
      asyncLoadResult(sampleTask)(dispatch, state);
    },
    (error) => {
      console.log(error);
    }
  )
}

export const actions = {
    // 加载订单数据
    asyncLoadOrderStart: () => ({type: actionTypes.ASYNC_LOAD_ORDER_START}),
    asyncLoadOrderSuccess: (orderData) => ({type: actionTypes.ASYNC_LOAD_ORDER_SUCCESS, orderData: orderData}),
    asyncLoadOrder,
    // 加载样品与任务数据
    asyncLoadSampleTaskStart: () => ({type: actionTypes.ASYNC_LOAD_SAMPLETASK_START}),
    asyncLoadSampleTaskSuccess: (sampleTask, selectOrder) => ({type: actionTypes.ASYNC_LOAD_SAMPLETASK_SUCCESS, sampleTask: sampleTask, selectOrder: selectOrder}),
    asyncLoadSampleTask,
    // 加载结果项数据
    asyncLoadResultStart: () => ({type: actionTypes.ASYNC_LOAD_RESULT_START}),
    asyncLoadResultSuccess: (resultData, sampleTask) => ({type: actionTypes.ASYNC_LOAD_RESULTS_SUCCESS, resultData: resultData, sampleTask: sampleTask}),
    asyncLoadResult,
    // 结果审核
    resultVerify: () => ({type: actionTypes.RESULT_VERIFY}),
    asyncVerifyResultStart: () => ({type: actionTypes.ASYNC_VERIFY_RESULT_START}),
    asyncVerifyResultSuccess: (receipt) => ({type: actionTypes.ASYNC_VERIFY_RESULT_SUCCESS, receipt: receipt,}),
    asyncVerifyResult,
    // 任务审核
    taskVerify: () => ({type: actionTypes.TASK_VERIFY}),
    asyncVerifyTaskStart: () => ({type: actionTypes.ASYNC_VERIFY_TASK_START}),
    asyncVerifyTaskSuccess: (receipt) => ({type: actionTypes.ASYNC_VERIFY_TASK_SUCCESS, receipt: receipt,}),
    asyncVerifyTask,
    // 分样审核
    subSampleVerify: () => ({type: actionTypes.SUB_SAMPLE_VERIFY}),
    asyncVerifySubSampleStart: () => ({type: actionTypes.ASYNC_VERIFY_SUB_SAMPLE_START}),
    asyncVerifySubSampleSuccess: (receipt) => ({type: actionTypes.ASYNC_VERIFY_SUB_SAMPLE_SUCCESS, receipt: receipt,}),
    asyncVerifySubSample,
    // 样品审核
    sampleVerify: () => ({type: actionTypes.SAMPLE_VERIFY}),
    asyncVerifySampleStart: () => ({type: actionTypes.ASYNC_VERIFY_SAMPLE_START}),
    asyncVerifySampleSuccess: (receipt) => ({type: actionTypes.ASYNC_VERIFY_SAMPLE_SUCCESS, receipt: receipt,}),
    asyncVerifySample,
    // 取消操作
    cancelHandle: () => ({type: actionTypes.CANCEL_HANDLE}),
};

// action types
export const actionTypes = {
  ASYNC_LOAD_ORDER_START: 'ASYNC_LOAD_ORDER_START',
  ASYNC_LOAD_ORDER_SUCCESS: 'ASYNC_LOAD_ORDER_SUCCESS',
  ASYNC_LOAD_SAMPLETASK_START: 'ASYNC_LOAD_SAMPLETASK_START',
  ASYNC_LOAD_SAMPLETASK_SUCCESS: 'ASYNC_LOAD_SAMPLETASK_SUCCESS',
  ASYNC_LOAD_RESULT_START: 'ASYNC_LOAD_RESULT_START',
  ASYNC_LOAD_RESULTS_SUCCESS: 'ASYNC_LOAD_RESULTS_SUCCESS',
  RESULT_VERIFY: 'RESULT_VERIFY',
  ASYNC_VERIFY_RESULT_START: 'ASYNC_VERIFY_RESULT_START',
  ASYNC_VERIFY_RESULT_SUCCESS: 'ASYNC_VERIFY_RESULT_SUCCESS',
  TASK_VERIFY: 'TASK_VERIFY',
  SUB_SAMPLE_VERIFY: 'SUB_SAMPLE_VERIFY',
  SAMPLE_VERIFY: 'SAMPLE_VERIFY',
  ASYNC_VERIFY_SAMPLE_START: 'ASYNC_VERIFY_SAMPLE_START',
  ASYNC_VERIFY_SAMPLE_SUCCESS: 'ASYNC_VERIFY_SAMPLE_SUCCESS',
  ASYNC_VERIFY_SUB_SAMPLE_START: 'ASYNC_VERIFY_SUB_SAMPLE_START',
  ASYNC_VERIFY_SUB_SAMPLE_SUCCESS: 'ASYNC_VERIFY_SUB_SAMPLE_SUCCESS',
  ASYNC_VERIFY_TASK_START: 'ASYNC_VERIFY_TASK_START',
  ASYNC_VERIFY_TASK_SUCCESS: 'ASYNC_VERIFY_TASK_SUCCESS',
  CANCEL_HANDLE: 'CANCEL_HANDLE',
};

// reducers
const initialState = fromJS({
  isLoading: false,
  editType: '',
  orderData: [],
  sampleTaskData: [],
  resultData: [],
  selectSampleTask: [],
  selectOrder: [],
});

export default (state = initialState, action = {}) => {
  switch ( action.type ){
    case actionTypes.ASYNC_LOAD_ORDER_START:
    case actionTypes.ASYNC_LOAD_SAMPLETASK_START:
    case actionTypes.ASYNC_LOAD_RESULT_START:
    case actionTypes.ASYNC_VERIFY_SAMPLE_START:
    case actionTypes.ASYNC_VERIFY_SUB_SAMPLE_START:
    case actionTypes.ASYNC_VERIFY_TASK_START:
    case actionTypes.ASYNC_VERIFY_RESULT_START:
      return state.set('isLoading', true);
    case actionTypes.ASYNC_LOAD_ORDER_SUCCESS:
      let orderData = action.orderData;
      return state.set('isLoading', false).set('orderData', orderData).set('sampleTaskData', []).set('resultData', []);
    case actionTypes.ASYNC_LOAD_SAMPLETASK_SUCCESS:
      let originalData = action.sampleTask;
      let selectOrder = action.selectOrder;
      let sampleTasks = flattenSampleTask(originalData);
      return state.set('isLoading', false).set('sampleTaskData', sampleTasks).set('selectOrder', selectOrder).set('resultData', []);
    case actionTypes.ASYNC_LOAD_RESULTS_SUCCESS:
      // 为结果项alert表格结果项数据添加样品与检测任务名称，显示在tag中
      let resultData = action.resultData.map((item) => {
        item.testName = action.sampleTask.testName || '';
        item.testItemName = action.sampleTask.testItemName || '';
        return item;
      });
      let selectSampleTask = action.sampleTask;
      resultData.map((item) => {
        item.resultName = item.recordStandard.name || '';
      })
      return state.set('isLoading', false).set('resultData', resultData).set('selectSampleTask', selectSampleTask);
    case actionTypes.RESULT_VERIFY:
      return state.set('isLoading', true).set('editType', '结果审核');
    case actionTypes.TASK_VERIFY:
      return state.set('isLoading', true).set('editType', '检测项目审核');
    case actionTypes.SUB_SAMPLE_VERIFY:
      return state.set('isLoading', true).set('editType', '分样审核');
    case actionTypes.SAMPLE_VERIFY:
      return state.set('isLoading', true).set('editType', '样品审核');
    case actionTypes.ASYNC_VERIFY_RESULT_SUCCESS:
      let verifierResult = action.receipt;
      return state.set('isLoading', false).set('editType', '').set('resultData', verifierResult);
    case actionTypes.ASYNC_VERIFY_SAMPLE_SUCCESS:
      let verifierSample = action.receipt;
      return state.set('isLoading', false).set('editType', '').set('resultData', verifierSample);
    case actionTypes.ASYNC_VERIFY_SUB_SAMPLE_SUCCESS:
      let verifierSubSample = action.receipt;
      return state.set('isLoading', false).set('editType', '').set('resultData', verifierSubSample);
    case actionTypes.ASYNC_VERIFY_TASK_SUCCESS:
      let verifierTASK = action.receipt;
      return state.set('isLoading', false).set('editType', '').set('resultData', verifierTASK);
    case actionTypes.CANCEL_HANDLE:
      return state.set('isLoading', false).set('editType', '');
    default :
      return state;
  }
};