import {fromJS} from 'immutable';
import { message } from 'antd';
import fetchData from '../../../util/fetchGateway';
import { replaceNodeById } from '../../../util/treeUtils';
import { spliceUrlByParams } from '../../../util/treeUtils';

// actions
// 加载任务数据
const asyncLoadTaskData = () => (dispatch, state) => {
  dispatch(actions.asyncLoadTaskDataStart());
  let url = '/task/query';
  fetchData(url, {}).then(
    (receipt) => {
      dispatch(actions.asyncLoadTaskDataSuccess(receipt.data));
    },
    (error) => {
      console.log(error);
    }
  )
}

// 保存分发的任务
const asyncDispatchTask = (dispatchTask) => (dispatch, state) => {
  dispatch(actions.asyncDispatchTaskStart());
  let url = '/task/dispatch';
  fetchData(url, {
    body: JSON.stringify(dispatchTask)
  }).then(
    (receipt) => {
      dispatch(actions.asyncDispatchTaskSuccess(receipt.data));
      asyncLoadTaskData()(dispatch, state);
    },
    (error) => {
      console.log(error);
    }
  )
}

export const actions = {
  // 加载任务数据
  asyncLoadTaskDataStart: () => ({type:actionTypes.ASYNC_LOAD_TASKDATA_START}),
  asyncLoadTaskDataSuccess: (taskData) => ({type:actionTypes.ASYNC_LOAD_TASKDATA_SUCCESS, taskData: taskData}),
  asyncLoadTaskData,
  // 勾选任务数据
  preparedTask: (taskDatas, taskKeys) => ({type: actionTypes.PREPARED_TASK, taskDatas: taskDatas, taskKeys: taskKeys}),
  // 保存分发的任务
  asyncDispatchTaskStart: () => ({type:actionTypes.ASYNC_DISPATCH_TASK_START}),
  asyncDispatchTaskSuccess: () => ({type:actionTypes.ASYNC_DISPATCH_TASK_SUCCESS}),
  asyncDispatchTask,
  // 取消操作
  cancel: () => ({type: actionTypes.CANCEL}),
};

// action types
export const actionTypes = {
  ASYNC_LOAD_TASKDATA_START: 'ASYNC_LOAD_TASKDATA_START',
  ASYNC_LOAD_TASKDATA_SUCCESS: 'ASYNC_LOAD_TASKDATA_SUCCESS',
  PREPARED_TASK: 'PREPARED_TASK',
  ASYNC_DISPATCH_TASK_START: 'ASYNC_DISPATCH_TASK_START',
  ASYNC_DISPATCH_TASK_SUCCESS: 'ASYNC_DISPATCH_TASK_SUCCESS',
  CANCEL: 'CANCEL',
};

// reducers
const initialState = fromJS({
  isLoading: false,
  operationType: '',
  taskData: [],
  preparedTaskKey: [],
  preparedTaskData: [],
});

export default (state = initialState, action = {}) => {
  switch ( action.type ){
    case actionTypes.ASYNC_LOAD_TASKDATA_START:
    case actionTypes.ASYNC_DISPATCH_TASK_START:
      return state.set('isLoading', true);
    case actionTypes.ASYNC_LOAD_TASKDATA_SUCCESS:
      let taskData = action.taskData;
      for(let i = 0; i < taskData.length; i++){
        taskData[i].sampleType = taskData[i].sampleType || {};
        taskData[i].sampleType.orders = taskData[i].sampleType.orders || {};
        taskData[i].docProductTestFlow = taskData[i].docProductTestFlow || {};
        taskData[i].docProductTestFlow.testItem = taskData[i].docProductTestFlow.testItem || {};
        taskData[i].docProductTestFlow.testStandard = taskData[i].docProductTestFlow.testStandard || {};
        taskData[i].docProductTestFlow.testMethod = taskData[i].docProductTestFlow.testMethod || {};
        taskData[i].operator = taskData[i].operator || {};
        taskData[i].verifier = taskData[i].verifier || {};
        taskData[i].verifier.verifier = taskData[i].verifier.verifier || {};
        taskData[i].serialNumber = (i + 1) + '';
        taskData[i].key = (i + 1) + '';
      }
      return state.set('isLoading', false).set('taskData', taskData);
    case actionTypes.PREPARED_TASK:
      let preparedTaskData = action.taskDatas;
      let preparedTaskKey = action.taskKeys;
      return state.set('preparedTaskData', preparedTaskData).set('preparedTaskKey', preparedTaskKey);
    case actionTypes.ASYNC_DISPATCH_TASK_SUCCESS:
      return state.set('isLoading', false);
    case actionTypes.CANCEL:
      return state.set('isLoading', false).set('operationType', '');
    default :
      return state;
  }
};
