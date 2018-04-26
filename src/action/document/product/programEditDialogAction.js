import fetchData from '../../../util/fetchGateway';
import { spliceUrlByParams } from '../../../util/treeUtils';

export const TEST_FLOW_DATA_LOAD = 'TEST_FLOW_DATA_LOAD';
export const TEST_FLOW_DATA_LOAD_SUCCESS = 'TEST_FLOW_DATA_LOAD_SUCCESS';
export const TEST_FLOW_ADD_START = 'TEST_FLOW_ADD_START';
export const TEST_FLOW_ADD_CANCEL = 'TEST_FLOW_ADD_CANCEL';
export const TEST_FLOW_ADD = 'TEST_FLOW_ADD';
export const TEST_FLOW_ADD_SUCCESS = 'TEST_FLOW_ADD_SUCCESS';
export const TEST_FLOW_ADD_BY_TABLE = 'TEST_FLOW_ADD_BY_TABLE';
export const TEST_FLOW_ADD_BY_TABLE_SUCCESS = 'TEST_FLOW_ADD_BY_TABLE_SUCCESS';
export const TEST_FLOW_PREPARE = 'TEST_FLOW_PREPARE';
export const TEST_FLOW_DELETE_CONFIRM = 'TEST_FLOW_DELETE_CONFIRM';
export const TEST_FLOW_DELETE_SUCCESS = 'TEST_FLOW_DELETE_SUCCESS';
export const TEST_FLOW_DELETE_CANCEL = 'TEST_FLOW_DELETE_CANCEL';
export const TEST_FLOW_EDIT = 'TEST_FLOW_EDIT';
export const TEST_FLOW_EDIT_START = 'TEST_FLOW_EDIT_START';
export const TEST_FLOW_EDIT_SUCCESS = 'TEST_FLOW_EDIT_SUCCESS';
export const RECORD_ITEM_STANDRAD_ADD = 'RECORD_ITEM_STANDRAD_ADD';
export const RECORD_ITEM_STANDRAD_ADD_SAVE = 'RECORD_ITEM_STANDRAD_ADD_SAVE';
export const RECORD_ITEM_STANDRAD_ADD_SAVE_SUCCESS = 'RECORD_ITEM_STANDRAD_ADD_SAVE_SUCCESS';
export const TEST_FLOW_CURRENT = 'TEST_FLOW_CURRENT';
export const RECORD_ITEM_STANDRAD_PREPARE = 'RECORD_ITEM_STANDRAD_PREPARE';
export const RECORD_ITEM_STANDRAD_DELETE_CONFIRM = 'RECORD_ITEM_STANDRAD_DELETE_CONFIRM';
export const RECORD_ITEM_STANDRAD_DELETE_SUCCESS = 'RECORD_ITEM_STANDRAD_DELETE_SUCCESS';
export const RECORD_ITEM_STANDRAD_EDIT = 'RECORD_ITEM_STANDRAD_EDIT';
export const RECORD_ITEM_STANDRAD_EDIT_SAVE = 'RECORD_ITEM_STANDRAD_EDIT_SAVE';
export const RECORD_ITEM_STANDRAD_EDIT_SAVE_SUCCESS = 'RECORD_ITEM_STANDRAD_EDIT_SAVE_SUCCESS';
export const RESET_CURRENTITEM = 'RESET_CURRENTITEM';

// 加载对应检测方案下的检测项目及结果项
export const loading = () => ({
  type : TEST_FLOW_DATA_LOAD
});

export const loadTestFlowSuccess = (receipt) => ({
  type: TEST_FLOW_DATA_LOAD_SUCCESS,
  receipt: receipt,
});

export const loadTestFlowData = (id) => (dispatch, state) => {
  dispatch(loading());
  let url = '/doc/producttestflow/query/all/' + id;
  fetchData(url, {}).then(
    (receipt) => {
      dispatch(loadTestFlowSuccess(receipt.data));
    },
    (error) => {
      console.log(error);
    }
  );
};

// 新增检测流程
export const addTestFlow = () => ({
  type : TEST_FLOW_ADD_START
});

export const addTestFlows = () => ({
  type : TEST_FLOW_ADD
});

export const addTestFlowSuccess = (receipt) => ({
  type: TEST_FLOW_ADD_SUCCESS,
  receipt: receipt,
});

export const addTestFlowsByTable = () => ({
  type : TEST_FLOW_ADD_BY_TABLE
});

export const addTestFlowByTableSuccess = (receipt) => ({
  type: TEST_FLOW_ADD_BY_TABLE_SUCCESS,
  receipt: receipt,
});
// 全项添加
export const asyncAddTestFlow = (productTestFlow, productTestId, testItemId, testStandardId, testMethodId, serviceGroupId, measUnitId) => (dispatch, state) => {
  dispatch(addTestFlows());
  let url = spliceUrlByParams('/doc/producttestflow/save',[productTestId,testItemId,testStandardId,testMethodId,serviceGroupId,measUnitId],'productTestId','testItemId','testStandardId','testMethodId','serviceGroupId','measUnitId');
  fetchData(url, {
    body: JSON.stringify(productTestFlow)
  }).then(
    (receipt) => {
      dispatch(addTestFlowSuccess(receipt.data));
    },
    (error) => {
      console.log(error);
    }
  );
};
// 非全项添加
export const asyncAddTestFlowByTable = (testItemArr, tid) => (dispatch, state) => {
  dispatch(addTestFlowsByTable());
  let url = '/doc/producttest/saveRefFlow?tid=' + tid;
  fetchData(url, {
    body: JSON.stringify(testItemArr)
  }).then(
    (receipt) => {
      dispatch(addTestFlowByTableSuccess(receipt.data));
    },
    (error) => {
      console.log(error);
    }
  );
};

// 获取表格勾选项
export const preparedTestFlow = (selectedRows, selectedRowKeys) => ({
  type: TEST_FLOW_PREPARE,
  preparedTestFlows: selectedRows,
  preparedTestFlowKeys: selectedRowKeys,
});

// 编辑检测流程
export const editTestFlow = () => ({
  type: TEST_FLOW_EDIT
});

export const editTestFlowStart = () => ({
  type: TEST_FLOW_EDIT_START
});

export const editTestFlowSuccess = (receipt) => ({
  type: TEST_FLOW_EDIT_SUCCESS,
  receipt: receipt,
});

export const asyncEditTestFlow = (productTestFlow, productTestId, testItemId, testStandardId, testMethodId, serviceGroupId, measUnitId) => (dispatch, state) => {
  dispatch(editTestFlowStart());
  let url = spliceUrlByParams('/doc/producttestflow/update',[productTestId,testItemId,testStandardId,testMethodId,serviceGroupId,measUnitId],'productTestId','testItemId','testStandardId','testMethodId','serviceGroupId','measUnitId');
  fetchData(url, {
    body: JSON.stringify(productTestFlow)
  }).then(
    (receipt) => {
      dispatch(editTestFlowSuccess(receipt.data));
    },
    (error) => {
      console.log(error);
    }
  )
};

// 删除检测流程
export const confirmDeleteTestFlow = () => ({
  type: TEST_FLOW_DELETE_CONFIRM
});

export const deleteTestFlowSuccess = (receipt) => ({
  type: TEST_FLOW_DELETE_SUCCESS,
  removedIds: receipt,
});

export const asyncDeleteItems = (ids) => (dispatch, state) => {
  dispatch(confirmDeleteTestFlow());
  let url = '/doc/producttestflow/delete';
  fetchData(url, {
    body: JSON.stringify(ids)
  }).then(
    (receipt) => {
      dispatch(deleteTestFlowSuccess(receipt.data));
    },
    (error) => {
      console.log(error);
    }
  )
};

// 获取检测项目下未添加的结果项
export const getNotAddRecord = (receipt) => ({
  type: RECORD_ITEM_STANDRAD_ADD,
  addResultDateSource: receipt,
});

export const addRecordItem = (flowId, testItemId) => (dispatch, state) => {
  let url = '/doc/resultrecordstandard/query?' + 'flowId=' + flowId + '&testItemId=' + testItemId;
  fetchData(url, {}).then(
    (receipt) => {
      dispatch(getNotAddRecord(receipt.data));
    },
    (error) => {
      console.log(error);
    }
  )
};

// 结果项新增
export const addRecordItemSave = () => ({
  type: RECORD_ITEM_STANDRAD_ADD_SAVE
});

export const addRecordItemSuccess = (receipt) => ({
  type: RECORD_ITEM_STANDRAD_ADD_SAVE_SUCCESS,
  receipt: receipt,
});

export const asyncAddRecordItem = (pid, resultArr) => (dispatch, state) => {
  dispatch(addRecordItemSave());
  let url = '/doc/resultrecordstandard/save/all?pid='+ pid;
  fetchData(url, {
    body: JSON.stringify(resultArr)
  }).then(
    (receipt) => {
      dispatch(addRecordItemSuccess(receipt.data));
    },
    (error) => {
      console.log(error);
    }
  )
};

// 获取检测项目表格点击选中项
export const getCurrentItem = (record) => ({
  type: TEST_FLOW_CURRENT,
  currentItem: record,
});

// 获取检测项目结果项表格勾选项
export const preparedRecord = (selectedRows, selectedRowKeys) => ({
  type: RECORD_ITEM_STANDRAD_PREPARE,
  preparedRecords: selectedRows,
  preparedRecordKeys: selectedRowKeys,
});

// 删除结果项
export const confirmDeleteRecords = () => ({
  type: RECORD_ITEM_STANDRAD_DELETE_CONFIRM
});

export const deleteRecordsSuccess = (receipt) => ({
  type: RECORD_ITEM_STANDRAD_DELETE_SUCCESS,
  removedIds: receipt,
});

export const asyncDeleteRecords = (ids) => (dispatch, state) => {
  dispatch(confirmDeleteRecords());
  let url = '/doc/resultrecordstandard/delete';
  fetchData(url, {
    body: JSON.stringify(ids)
  }).then(
    (receipt) => {
      dispatch(deleteRecordsSuccess(receipt.data));
    },
    (error) => {
      console.log(error);
    }
  )
};

// 编辑结果项
export const editRecordItem = () => ({
  type: RECORD_ITEM_STANDRAD_EDIT
});

export const editRecordItemSave = () => ({
  type: RECORD_ITEM_STANDRAD_EDIT_SAVE
});

export const editRecordItemSuccess = (receipt, pid) => ({
  type: RECORD_ITEM_STANDRAD_EDIT_SAVE_SUCCESS,
  receipt: receipt,
  pid: pid,
});

export const asyncEditRecordItem = (Record, pid, resultId, measUnitId, roundRuleId, resultsFileId) => (dispatch, state) => {
  dispatch(editRecordItemSave());
  let url = spliceUrlByParams('/doc/resultrecordstandard/update',[pid,resultId,measUnitId,roundRuleId,resultsFileId,],'pid','resultId','measUnitId','roundRuleId','resultsFileId');
  fetchData(url, {
    body: JSON.stringify(Record)
  }).then(
    (receipt) => {
      dispatch(editRecordItemSuccess(receipt.data, pid));
    },
    (error) => {
      console.log(error);
    }
  )
};

// 清空currentItem
export const resetCurrentItem = () => ({
  type : RESET_CURRENTITEM
})

// 取消操作
export const addTestFlowCancel = () => ({
  type : TEST_FLOW_ADD_CANCEL
});

export const cancelDeleteItems = () => ({
  type: TEST_FLOW_DELETE_CANCEL
})




