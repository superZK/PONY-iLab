import fetchData from '../../../util/fetchGateway'
import * as types from './ActionTypes'

// 右侧列表
export const deptTaskListStart = () => ({
  type: types.DEPTTASKSCOPE_LIST_START
})
export const deptTaskListSuccess = (data, key) => ({
  type: types.DEPTTASKSCOPE_LIST_SUCCESS,
  data,
  key
})
export const deptTaskScopeList = (selectedKeys, id) => (dispatch, getState) => {
  if(!selectedKeys || !selectedKeys[0]) return;
  dispatch(deptTaskListStart());
  let selectedItemId = Number.parseInt(selectedKeys[0], 10);
  fetchData('/org/dept/sicts/granted?dept=' + selectedItemId + '&type=' + id, {
    body: JSON.stringify(id)
  }).then(
    (receipt) => {
      dispatch(deptTaskListSuccess(receipt.data, selectedItemId));
      if(receipt.data && receipt.data.length > 0) {
        (receipt.data || []).map(v => {
          v.key = v.id;
          v.productName = (v.productTest && v.productTest.product && v.productTest.product.name) || '空';
          v.testPlanName = (v.productTest && v.productTest.testPlan && v.productTest.testPlan.name) || '空';
          v.testItemName = (v.testItem && v.testItem.name) || '空';
          v.testStandardCode = (v.testStandard && v.testStandard.code) || '空';
          v.standardNo = (v.testMethod && v.testMethod.standardNo) || '空';
        })
      }
    }, (error) => {
      console.log(error);
    }
  )
}
export const deptTaskListRows = (rows, rowsKey) => ({
  type: types.DEPTTASKSCOPE_LIST_ROWS,
  rows,
  rowsKey,
})

// 新增
export const deptTaskAdd = () => ({
  type: types.DEPTTASKSCOPE_ADD
})
export const deptTaskAddStart = () => ({
  type: types.DEPTTASKSCOPE_ADD_START
})
export const deptTaskAddSuccess = (data) => ({
  type: types.DEPTTASKSCOPE_ADD_SUCCESS,
  data,
})
export const deptTaskScopeAdd = (id, data) => (dispatch, state) => {
  dispatch(deptTaskAddStart());
  fetchData('/org/dept/sicts/add?dept=' + id, {
    body: JSON.stringify(data)
  }).then(
    (receipt) => {
      dispatch(deptTaskAddSuccess(receipt.data));
      deptTaskScopeList(id, 0)(dispatch, state);
      if(receipt.data && receipt.data.length > 0) {
        (receipt.data || []).map(v => {
          v.key = v.id;
          return v;
        })
      }
    }, (error) => {
      console.log(error);
    }
  )
}
// 新增 左侧列表树
//根据不同组织加载下属产品
export const deptTaskAddLoad = () => ({
  type: types.DEPTTASKSCOPE_ADD_LOAD
});
export const deptTaskAddLoadSuccess = (categoryInfo, categoryData) => ({
  type: types.DEPTTASKSCOPE_ADD_LOAD_SUCCESS,
  categoryInfo,
  categoryData,
});
export const asyncDeptTaskAddLoad = (type, name, treeId) => (dispatch, state) => {
  dispatch(deptTaskAddLoad());
  fetchData('/doc/categories/type/' + type, {}).then(
    (receipt) => {
      dispatch(deptTaskAddLoadSuccess({
        id: 0,
        code: 'R'+type,
        name: name,
        shorthand: '',
        type: type
      }, receipt.data));
      if(treeId && !(isNaN(treeId)) && typeof(treeId) === 'number') {
        deptTaskScopeAddList(treeId, receipt.data.length > 0 ? [receipt.data[0].id] : [])(dispatch, state);
      }
    },
    (error) => { console.log(error) }
  );
};

// 新增 右侧列表
export const deptTaskListAddStart = () => ({
  type: types.DEPTTASKSCOPE_LIST_ADD_START
})
export const deptTaskListAddSuccess = (data, key) => ({
  type: types.DEPTTASKSCOPE_LIST_ADD_SUCCESS,
  data,
  key,
})
export const deptTaskScopeAddList = (id, selectedKeys) => (dispatch, getState) => {
  if(!selectedKeys || !selectedKeys[0]) return;
  dispatch(deptTaskListAddStart());
  let selectedItemId = Number.parseInt(selectedKeys[0], 10);
  fetchData('/org/dept/sicts/grantable?dept=' + id + '&type=' + selectedItemId, {}).then(
    (receipt) => {
      if(receipt.data && receipt.data.length > 0) {
        (receipt.data || []).map(v => {
          v.key = v.id;
          v.productName = (v.productTest && v.productTest.product && v.productTest.product.name) || '空';
          v.testPlanName = (v.productTest && v.productTest.testPlan && v.productTest.testPlan.name) || '空';
          v.testItemName = (v.testItem && v.testItem.name) || '空';
          v.testStandardCode = (v.testStandard && v.testStandard.code) || '空';
          v.standardNo = (v.testMethod && v.testMethod.standardNo) || '空';
          v.testStandardName = (v.testStandard && v.testStandard.name) || '空';
          v.testMethodName = (v.testMethod && v.testMethod.name) || '空';
          return v;
        })
      }
      dispatch(deptTaskListAddSuccess(receipt.data, selectedItemId));
    }, (error) => {
      console.log(error);
    }
  )
}
export const deptTaskListAddRows = (rows, rowsKey) => ({
  type: types.DEPTTASKSCOPE_LIST_ADD_ROW,
  rows,
  rowsKey,
})

// 删除
export const deleteDeptTaskStart = () => ({
  type: types.DELETE_DEPTTASKSCOPE_START
});
export const deleteDeptTaskSuccess = (code, ids) => ({
  type: types.DELETE_DEPTTASKSCOPE_SUCCESS,
  code,
  ids
});
export const deptTaskDelete = (deptId, ids) => (dispatch, getState) => {
  dispatch(deleteDeptTaskStart());
  fetchData('/org/dept/sicts/remove?dept=' + deptId, {
    body: JSON.stringify(ids)
  }).then(
    (receipt) => {
      dispatch(deleteDeptTaskSuccess(receipt.code, ids));
    }, (error) => {
      console.log(error);
    }
  )
}

// 取消操作
export const cancelDeptTaskScope = () => ({
  type: types.CANCEL_DEPTTASKSCOPE,
});
