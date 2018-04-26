import {fromJS} from 'immutable';
import { message } from 'antd';
import fetchData from '../../../util/fetchGateway';
import { findNodeById, spliceUrlByParams, findParentById, removeNodeById, replaceNodeById, } from '../../../util/treeUtils';

// actions
// 暂存订单抬头
const temporaryDepositOrderTitle = (orderTitle, siteId) => (dispatch, state) => {
  dispatch(actions.temporaryDepositOrderTitleStart());
  let url = spliceUrlByParams('/biz/order/presave', [siteId], 'siteId');
  fetchData(url, {
    body: JSON.stringify(orderTitle)
  }).then(
    (receipt) => {
      dispatch(actions.temporaryDepositOrderTitleSuccess(receipt.data));
      if(receipt.code === '0'){
        message.success('订单抬头暂存成功!');
      }
    },
    (error) => {
      dispatch(actions.temporaryDepositOrderTitleFail());
    }
  )
}

// 模糊查询暂存订单
const queryPreOrder = (value) => (dispatch, state) => {
  dispatch(actions.queryPreOrderStart());
  let url = '/biz/preorder/query?s=' + value;
  fetchData(url, {}).then(
    (receipt) => {
      dispatch(actions.queryPreOrderSuccess(receipt.data));
      // 查询出暂存订单后，若为一条直接加载，若为多条，在modal中列出表格让用户选取
      // if(orderTitles.length === 1){
      // }
    },
    (error) => {
      console.log(error);
    }
  )
}

// 加载暂存订单
const asyncLoadOrder = (orderObj) => (dispatch, state) => {
  dispatch(actions.loadOrderStart());
  let url = '/biz/order/sample/query?oid=' + orderObj[0].id;
  fetchData(url, {}).then(
    (receipt) => {
      dispatch(actions.loadOrderSuccess(orderObj, receipt.data));
      // if(receipt.code === '0' && receipt.data.length){
      //   // 加载暂存订单时，如果该订单下有样品，则根据第一项订单加载其下的任务
      //   selectedSample([receipt.data[0].id])(dispatch, state)
      // }
    },
    (error) => {
      console.log(error);
    }
  )
}

// 删除暂存订单
const asyncDeletePreSaveOrder = (orderObj, refersh) => (dispatch, state) => {
  dispatch(actions.deletePreSaveOrderStart());
  let url = '/biz/order/predelete';
  let id = orderObj.map((item) => item.id);
  fetchData(url, {
    body: JSON.stringify(id)
  }).then(
    (receipt) => {
      dispatch(actions.deletePreSaveOrderSuccess());
      if(receipt.code === '0'){
        message.success('当前暂存订单删除成功!');
        refersh();//清空表单
      }
    },
    (error) => {
      console.log(error);
    }
  )
}

// 新增样品
const asyncAddSample = (sample, oid, productId, orderNo) => (dispatch, state) => {
  dispatch(actions.addSampleStart());
  let url = '/biz/order/sample/presave?oid=' + oid + '&productId=' + productId;
  fetchData(url, {
    body: JSON.stringify(sample)
  }).then(
    (receipt) => {
      dispatch(actions.addSampleSuccess({
        id: 0,
        testName: orderNo,
        subordinate: [],
      }, receipt.data));
    },
    (error) => {
      console.log(error);
    }
  )
}

// 拆样
const asyncSplitSample = (splitSample, selectedSampleKey) => (dispatch, state) => {
  dispatch(actions.splitSampleStart());
  let url = '/biz/order/sample/split?sid=' + selectedSampleKey;
  fetchData(url, {
    body: JSON.stringify(splitSample)
  }).then(
    (receipt) => {
      dispatch(actions.splitSampleSuccess(receipt.data, selectedSampleKey));
    },
    (error) => {console.log(error)}
  );
};

// 删除样品
const asyncDeletePreSaveSample = (selectedSampleKey) => (dispatch, state) => {
  dispatch(actions.deleteSampleStart());
  let url = '/biz/order/sample/delete?sid=' + selectedSampleKey;
  fetchData(url, {}).then(
    (receipt) => {
      dispatch(actions.deleteSampleSuccess(selectedSampleKey));
      if(receipt.code === '0'){
        message.success('选中样品删除成功!');
      }
    },
    (error) => {console.log(error)}
  );
};

// 禁用样品
const asyncDisableSample = (selectedSampleKey, orderObj) => (dispatch, state) => {
  if(selectedSampleKey == 0) return;
  dispatch(actions.disableSampleStart());
  let url = '/biz/order/sample/disable';
  fetchData(url, {
    body: JSON.stringify([selectedSampleKey])
  }).then(
    (receipt) => {
      dispatch(actions.disableSampleSuccess());
      if(receipt.code === '0'){
        message.success('选中样品禁用成功!');
        asyncLoadOrder(orderObj)(dispatch, state);
      }
    },
    (error) => {console.log(error)}
  );
};

// 启用样品
const asyncActiveSample = (selectedSampleKey, orderObj) => (dispatch, state) => {
  if(selectedSampleKey == 0) return;
  dispatch(actions.activeSampleStart());
  let url = '/biz/order/sample/enabled';
  fetchData(url, {
    body: JSON.stringify([selectedSampleKey])
  }).then(
    (receipt) => {
      dispatch(actions.activeSampleSuccess());
      if(receipt.code === '0'){
        message.success('选中样品启用成功!');
        asyncLoadOrder(orderObj)(dispatch, state);
      }
    },
    (error) => {console.log(error)}
  );
};

// 根据选中的样品加载任务
const selectedSample = (selectedKeys) => (dispatch, state) => {
  if(!selectedKeys || !selectedKeys[0] || selectedKeys[0] === '0') return;
  dispatch(actions.selectSample());
  let selectedSampleId = Number.parseInt(selectedKeys[0], 10);
  fetchData('/biz/order/task/query?sid=' + selectedSampleId, {}).then(
    (receipt) => {
      dispatch(actions.loadTaskSuccess(receipt.data, selectedSampleId));
    },
    (error) => {console.log(error)}
  );
};

// 根据选中的样品ID查询检测流程数据
const queryTestFlowBySampleId = (selectedSampleKey) => (dispatch, state) => {
  dispatch(actions.queryTestFlowStart());
  let url = '/biz/order/task/select?sid=' + selectedSampleKey;
  fetchData(url, {}).then(
    (receipt) => {
      dispatch(actions.queryTestFlowSuccess(receipt.data));
    },
    (error) => {console.log(error)}
  );
};

// 新增任务
const asyncAddTask = (obj, selectedSampleKey) => (dispatch, state) => {
  dispatch(actions.addTaskStart());
  let url = '/biz/order/task/presave?sid=' + selectedSampleKey;
  fetchData(url, {
    body: JSON.stringify(obj)
  }).then(
    (receipt) => {
      dispatch(actions.addTaskSuccess(receipt.data));
      // 添加任务成功后，查询一次
      // selectedSample([selectedSampleKey])(dispatch, state);
    },
    (error) => {console.log(error)}
  );
};

// 删除任务
const asyncDeleteTask = (removeIds) => (dispatch, state) => {
  dispatch(actions.deleteTaskStart());
  let url = '/biz/order/task/delete';
  fetchData(url, {
    body: JSON.stringify(removeIds)
  }).then(
    (receipt) => {
      dispatch(actions.deleteTaskSuccess(receipt.data));
    },
    (error) => {console.log(error)}
  );
};

// 禁用任务
const asyncDisableTask = (selectedTaskKeys) => (dispatch, state) => {
  dispatch(actions.disableTaskStart());
  let url = '/biz/order/task/disable';
  fetchData(url, {
    body: JSON.stringify(selectedTaskKeys)
  }).then(
    (receipt) => {
      dispatch(actions.disableTaskSuccess(receipt.data));
    },
    (error) => {console.log(error)}
  );
};

// 启用任务
// const asyncActiveTask = (selectedTaskKeys) => (dispatch, state) => {
//   dispatch(actions.activeTaskStart());
//   let url = '/biz/order/task/active';
//   fetchData(url, {
//     body: JSON.stringify(selectedTaskKeys)
//   }).then(
//     (receipt) => {
//       dispatch(actions.activeTaskSuccess());
//     },
//     (error) => {console.log(error)}
//   );
// };

// 正式提交订单
const asyncSubmitOrder = (orderId, refersh) => (dispatch, state) => {
  dispatch(actions.submitOrderStart());
  let url = '/biz/order/save?oid=' + orderId;
  fetchData(url, {}).then(
    (receipt) => {
      dispatch(actions.submitOrderSuccess(receipt.code));
      if(receipt.code === '0'){
        message.success('订单保存成功');
        refersh();//清空表单
      }
    },
    (error) => {console.log(error)}
  );
};

export const actions = {
  // 新增订单
  addPreOrder: (resetFields) => ({type: actionTypes.ADD_PREORDER, resetFields: resetFields,}),
  // 暂存订单抬头
  temporaryDepositOrderTitleStart: () => ({type:actionTypes.TEMPORARY_DEPOSIT_ORDER_TITLE_START}),
  temporaryDepositOrderTitleSuccess: (temporaryStoredTitle) => ({type: actionTypes.TEMPORARY_DEPOSIT_ORDER_TITLE_SUCCESS, temporaryStoredTitle: temporaryStoredTitle,}),
  temporaryDepositOrderTitleFail: () => ({type:actionTypes.TEMPORARY_DEPOSIT_ORDER_TITLE_FAIL}),
  temporaryDepositOrderTitle,
  // 查询暂存订单
  queryPreOrderStart: () => ({type: actionTypes.QUERY_PREORDER_START}),
  queryPreOrderSuccess: (orderTitles) => ({type: actionTypes.QUERY_PREORDER_SUCCESS, orderTitles: orderTitles,}),
  queryPreOrder,
  // 新增样品
  addSample: () => ({type: actionTypes.ADD_SAMPLE}),
  addSampleStart: () => ({type: actionTypes.ADD_SAMPLE_START}),
  addSampleSuccess: (order, sample) => ({type: actionTypes.ADD_SAMPLE_SUCCESS, order: order,  sample: sample,}),
  asyncAddSample,
  // 加载暂存订单
  loadOrderStart: () => ({type: actionTypes.LOAD_ORDER_START}),
  loadOrderSuccess: (order, sample) => ({type: actionTypes.LOAD_ORDER_SUCCESS, order: order, sample: sample,}),
  asyncLoadOrder,
  // 删除暂存订单
  deletePreSaveOrderStart: () =>({type: actionTypes.DELETE_PRESAVEORDER_START}),
  deletePreSaveOrderSuccess: () =>({type: actionTypes.DELETE_PRESAVEORDER_SUCCESS}),
  asyncDeletePreSaveOrder,
  // 根据选中的样品加载任务
  selectSample: () => ({type: actionTypes.LOAD_TASK_START}),
  loadTaskSuccess: (task, selectedItemKey) => ({type: actionTypes.LOAD_TASK_SUCCESS, taskData: task, selectedItemKey: selectedItemKey, }),
  selectedSample,
  // 拆分样品
  splitSample: () => ({type: actionTypes.SPLIT_SAMPLE}),
  splitSampleStart: () => ({type: actionTypes.SPLIT_SAMPLE_START}),
  splitSampleSuccess: (splitSample, selectedSampleKey) => ({type: actionTypes.SPLIT_SAMPLE_SUCCESS, splitSample: splitSample, selectedSampleKey: selectedSampleKey, }),
  asyncSplitSample,
  // 删除样品
  deleteSampleStart: () => ({type: actionTypes.DELETE_SAMPLE_START}),
  deleteSampleSuccess: (selectedSampleKey) => ({type: actionTypes.DELETE_SAMPLE_SUCCESS, selectedSampleKey: selectedSampleKey,}),
  asyncDeletePreSaveSample,
  // 查看样品详细信息
  checkSampleInfo: () => ({type: actionTypes.CHECK_SAMPLE_INFO}),
  // 禁用样品
  disableSampleStart: () => ({type: actionTypes.DISABLE_SAMPLE_START}),
  disableSampleSuccess: () => ({type: actionTypes.DISABLE_SAMPLE_SUCCESS}),
  asyncDisableSample,
  // 启用样品
  activeSampleStart: () => ({type: actionTypes.ACTIVE_SAMPLE_START}),
  activeSampleSuccess: () => ({type: actionTypes.ACTIVE_SAMPLE_SUCCESS}),
  asyncActiveSample,
  // 根据选中样品查询检测流程
  queryTestFlowStart: () => ({type: actionTypes.QUERY_TESTFLOW_START}),
  queryTestFlowSuccess: (testFlow) => ({type: actionTypes.QUERY_TESTFLOW_SUCCESS, testFlow: testFlow,}),
  queryTestFlowBySampleId,
  // 新增任务
  addTask: () => ({type: actionTypes.ADD_TASK}),
  addTaskStart: () => ({type: actionTypes.ADD_TASK_START}),
  addTaskSuccess: (taskData) => ({type: actionTypes.ADD_TASK_SUCCESS, taskData: taskData,}),
  asyncAddTask,
  // 获取任务表格勾选项
  preparedTask: (selectedItems, selectedItemKeys) => ({type: actionTypes.PREPARED_TASK, selectedItems: selectedItems,  selectedItemKeys: selectedItemKeys,}),
  // 删除任务
  deleteTaskStart: () => ({type: actionTypes.DELETE_TASK_START}),
  deleteTaskSuccess: (removeIds) => ({type: actionTypes.DELETE_TASK_SUCCESS, removeIds: removeIds,}),
  asyncDeleteTask,
  // 禁用任务
  disableTaskStart: () => ({type: actionTypes.DISABLE_TASK_START}),
  disableTaskSuccess: (newTasks) => ({type: actionTypes.DISABLE_TASK_SUCCESS, newTasks: newTasks}),
  asyncDisableTask,
  // // 启用任务
  // activeTaskStart: () => ({type: actionTypes.ACTIVE_TASK_START}),
  // activeTaskSuccess: () => ({type: actionTypes.ACTIVE_TASK_SUCCESS}),
  // asyncActiveTask,

  // 正式提交订单
  submitOrderStart: () => ({type: actionTypes.SUBMIT_ORDER_START}),
  submitOrderSuccess: (code) => ({type: actionTypes.SUBMIT_ORDER_SUCCESS, code: code}),
  asyncSubmitOrder,
  // 切换路由时清空数据
  cleraDataWhenSwitchRouter: () => ({type: actionTypes.CLEAR_DATA_WHEN_SWITCH_ROUTER}),
  // 取消操作
  cancelHandle: () => ({type: actionTypes.CANCEL_HANDLE}),
};

// action types
export const actionTypes = {
  ADD_PREORDER: 'ADD_PREORDER',
  TEMPORARY_DEPOSIT_ORDER_TITLE_START: 'TEMPORARY_DEPOSIT_ORDER_TITLE_START',
  TEMPORARY_DEPOSIT_ORDER_TITLE_SUCCESS: 'TEMPORARY_DEPOSIT_ORDER_TITLE_SUCCESS',
  TEMPORARY_DEPOSIT_ORDER_TITLE_FAIL: 'TEMPORARY_DEPOSIT_ORDER_TITLE_FAIL',
  QUERY_PREORDER_START: 'QUERY_PREORDER_START',
  QUERY_PREORDER_SUCCESS: 'QUERY_PREORDER_SUCCESS',
  ADD_SAMPLE: 'ADD_SAMPLE',
  ADD_SAMPLE_START: 'ADD_SAMPLE_START',
  ADD_SAMPLE_SUCCESS: 'ADD_SAMPLE_SUCCESS',
  LOAD_ORDER_START: 'LOAD_ORDER_START',
  LOAD_ORDER_SUCCESS: 'LOAD_ORDER_SUCCESS',
  DELETE_PRESAVEORDER_START: 'DELETE_PRESAVEORDER_START',
  DELETE_PRESAVEORDER_SUCCESS: 'DELETE_PRESAVEORDER_SUCCESS',
  LOAD_TASK_START: 'LOAD_TASK_START',
  LOAD_TASK_SUCCESS: 'LOAD_TASK_SUCCESS',
  SPLIT_SAMPLE: 'SPLIT_SAMPLE',
  SPLIT_SAMPLE_START: 'SPLIT_SAMPLE_START',
  SPLIT_SAMPLE_SUCCESS: 'SPLIT_SAMPLE_SUCCESS',
  DELETE_SAMPLE_START: 'DELETE_SAMPLE_START',
  DELETE_SAMPLE_SUCCESS: 'DELETE_SAMPLE_SUCCESS',
  DISABLE_SAMPLE_START: 'DISABLE_SAMPLE_START',
  DISABLE_SAMPLE_SUCCESS: 'DISABLE_SAMPLE_SUCCESS',
  ACTIVE_SAMPLE_START: 'ACTIVE_SAMPLE_START',
  ACTIVE_SAMPLE_SUCCESS: 'ACTIVE_SAMPLE_SUCCESS',
  CHECK_SAMPLE_INFO: 'CHECK_SAMPLE_INFO',
  ADD_TASK: 'ADD_TASK',
  ADD_TASK_START: 'ADD_TASK_START',
  ADD_TASK_SUCCESS: 'ADD_TASK_SUCCESS',
  PREPARED_TASK: 'PREPARED_TASK',
  DELETE_TASK_START: 'DELETE_TASK_START',
  DELETE_TASK_SUCCESS: 'DELETE_TASK_SUCCESS',
  QUERY_TESTFLOW_START: 'QUERY_TESTFLOW_START',
  QUERY_TESTFLOW_SUCCESS: 'QUERY_TESTFLOW_SUCCESS',
  DISABLE_TASK_START: 'DISABLE_TASK_START',
  DISABLE_TASK_SUCCESS: 'DISABLE_TASK_SUCCESS',
  // ACTIVE_TASK_START: 'ACTIVE_TASK_START',
  // ACTIVE_TASK_SUCCESS: 'ACTIVE_TASK_SUCCESS',
  SUBMIT_ORDER_START: 'SUBMIT_ORDER_START',
  SUBMIT_ORDER_SUCCESS: 'SUBMIT_ORDER_SUCCESS',
  CLEAR_DATA_WHEN_SWITCH_ROUTER: 'CLEAR_DATA_WHEN_SWITCH_ROUTER',
  CANCEL_HANDLE: 'CANCEL_HANDLE',
};

// reducers
const initialState = fromJS({
  isLoading: false,
  editType: '',
  temporaryStoredTitle: [],
  orderTitles: [],
  selectedItemKey: [],
  sampleData: [],
  taskData: [],
  preparedTaskKeys: [],
  testFlow: [],
  isSaved: false,
});

export default (state = initialState, action = {}) => {
  switch ( action.type ){
    case actionTypes.TEMPORARY_DEPOSIT_ORDER_TITLE_START:
    case actionTypes.QUERY_PREORDER_START:
    case actionTypes.LOAD_ORDER_START:
    case actionTypes.DELETE_PRESAVEORDER_START:
    case actionTypes.LOAD_TASK_START:
    case actionTypes.SPLIT_SAMPLE_START:
    case actionTypes.DELETE_SAMPLE_START:
    case actionTypes.DISABLE_SAMPLE_START:
    case actionTypes.ADD_TASK_START:
    case actionTypes.DELETE_TASK_START:
    case actionTypes.ACTIVE_SAMPLE_START:
    case actionTypes.DISABLE_TASK_START:
    case actionTypes.SUBMIT_ORDER_START:
    // case actionTypes.ACTIVE_TASK_SUCCESS:
      return state.set('isLoading', true);
    case actionTypes.ADD_PREORDER:
      let resetFields = action.resetFields;
      resetFields();
      return state.set('temporaryStoredTitle', []).set('orderTitles', []).set('selectedItemKey', []).set('sampleData', []).set('taskData', []).set('preparedTaskKeys', []).set('testFlow', []);
    case actionTypes.TEMPORARY_DEPOSIT_ORDER_TITLE_SUCCESS:
      let temporaryStoredTitle = action.temporaryStoredTitle || [];
      return state.set('isLoading', false).set('temporaryStoredTitle', temporaryStoredTitle).set('isSaved', true);
    case actionTypes.QUERY_PREORDER_SUCCESS:
      let orderTitles = action.orderTitles;
      return state.set('isLoading', false).set('editType', '加载抬头').set('orderTitles', orderTitles);
    case actionTypes.ADD_SAMPLE:
      return state.set('isLoading', true).set('editType', '新增样品');
    case actionTypes.ADD_SAMPLE_START:
      return state.set('isLoading', true).set('editType', '新增样品');
    case actionTypes.ADD_SAMPLE_SUCCESS:
      let sample = action.sample;
      let order = action.order;
      if(state.get('sampleData').length && state.get('sampleData')[0].subordinate.length){
        order = state.get('sampleData')[0];
      }
      order.subordinate.push(sample[0]);
      return state.set('isLoading', false).set('editType', '').set('sampleData', [order]);
    case actionTypes.LOAD_ORDER_SUCCESS:
      let orderObj = action.order || [];
      let sampleObj = orderObj[0].orderNo ? [{
        id: 0,
        testName: orderObj[0].orderNo,
        subordinate: action.sample,
      }] : [];
      return state.set('isLoading', false).set('editType', '').set('temporaryStoredTitle', orderObj).set('sampleData', sampleObj).set('taskData', []);
    case actionTypes.DELETE_PRESAVEORDER_SUCCESS:
      return state.set('isLoading', false).set('temporaryStoredTitle', []).set('orderTitles', []).set('selectedItemKey', []).set('sampleData', []).set('taskData', []).set('preparedTaskKeys', []).set('testFlow', []);
    case actionTypes.LOAD_TASK_SUCCESS:
      let taskData = action.taskData || [];
      let selectItemKey = action.selectedItemKey || '';
      return state.set('isLoading', false).set('taskData', taskData).set('selectedItemKey', selectItemKey);
    case actionTypes.SPLIT_SAMPLE:
      return state.set('isLoading', true).set('editType', '拆样');
    case actionTypes.SPLIT_SAMPLE_SUCCESS:
      let splitSample = action.splitSample;
      let selectedSampleKey = action.selectedSampleKey;
      let parentSample = findNodeById(state.get('sampleData')[0].subordinate, 'id', 'subordinate', selectedSampleKey);
      console.log(parentSample)
      splitSample.map((item) => {
        if(parentSample.subordinate){
          parentSample.subordinate.push(item);
        }else{
          parentSample.subordinate = [item];
        }
      })
      return state.set('isLoading', false).set('editType', '');
    case actionTypes.DELETE_SAMPLE_SUCCESS:
      selectedSampleKey = action.selectedSampleKey;
      parentSample = findParentById(state.get('sampleData')[0].subordinate, 'id', 'subordinate', selectedSampleKey);
      removeNodeById(parentSample, 'id', [selectedSampleKey]);
      return state.set('isLoading', false);
    case actionTypes.DISABLE_SAMPLE_SUCCESS:
      return state.set('isLoading', false);
    case actionTypes.ACTIVE_SAMPLE_SUCCESS:
      return state.set('isLoading', false);
    case actionTypes.CHECK_SAMPLE_INFO:
      return state.set('isLoading', true).set('editType', '查看样品信息');
    case actionTypes.QUERY_TESTFLOW_START:
     return state.set('isLoading', true).set('editType', '新增任务');
    case actionTypes.QUERY_TESTFLOW_SUCCESS:
     let testFlow = action.testFlow;
     return state.set('isLoading', false).set('testFlow', testFlow);
    case actionTypes.ADD_TASK_SUCCESS:
      taskData = action.taskData;
      if(state.get('taskData').length){
        let newTaskData = state.get('taskData').concat(taskData);
        return state.set('isLoading', false).set('editType', '').set('taskData', newTaskData);
      }else if(!state.get('taskData').length) {
        return state.set('isLoading', false).set('editType', '').set('taskData', taskData);
      }
    case actionTypes.PREPARED_TASK:
      let selectedItemKeys = action.selectedItemKeys;
      return state.set('preparedTaskKeys', selectedItemKeys);
    case actionTypes.DELETE_TASK_SUCCESS:
      let removeIds = action.removeIds;
      removeNodeById(state.get('taskData'), 'id', removeIds);
      return state.set('isLoading', false);
    case actionTypes.DISABLE_TASK_SUCCESS:
      let newTasks = action.newTasks;
      replaceNodeById(state.get('taskData'), 'id', newTasks);
      return state.set('isLoading', false);
    // case actionTypes.ACTIVE_TASK_SUCCESS:
    //   return state.set('isLoading', false);
    case actionTypes.CANCEL_HANDLE:
    case actionTypes.TEMPORARY_DEPOSIT_ORDER_TITLE_FAIL:
      return state.set('isLoading', false).set('editType', '');
    case actionTypes.SUBMIT_ORDER_SUCCESS:
      let code = action.code;
      if(code === '0'){
        return state.set('isLoading', false).set('temporaryStoredTitle', []).set('orderTitles', []).set('selectedItemKey', []).set('sampleData', []).set('taskData', []).set('preparedTaskKeys', []).set('testFlow', []);
      }
      return state.set('isLoading', false).set('isSaved', true);
    case actionTypes.CLEAR_DATA_WHEN_SWITCH_ROUTER:
      return state.set('temporaryStoredTitle', []).set('orderTitles', []).set('selectedItemKey', []).set('sampleData', []).set('taskData', []).set('preparedTaskKeys', []).set('testFlow', []).set('isSaved', false);
    default :
      return state;
  }
};
