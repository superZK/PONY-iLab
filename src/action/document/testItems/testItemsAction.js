import fetchData from '../../../util/fetchGateway';
import { spliceUrlByParams } from '../../../util/treeUtils';

export const CATEGORY_MANAGEMENT_DATA_LOAD = 'CATEGORY_MANAGEMENT_DATA_LOAD';
export const CATEGORY_MANAGEMENT_DATA_LOAD_SUCCESS = 'CATEGORY_MANAGEMENT_DATA_LOAD_SUCCESS';
export const TEST_ITEM_DATA_LOAD = 'TEST_ITEM_DATA_LOAD';
export const TEST_ITEM_DATA_LOAD_SUCCESS = 'TEST_ITEM_DATA_LOAD_SUCCESS';
export const TEST_ITEM_ADD = 'TEST_ITEM_ADD';
export const TEST_ITEM_EDIT = 'TEST_ITEM_EDIT';
export const TEST_ITEM_SAVE = 'TEST_ITEM_SAVE';
export const TEST_ITEM_SAVE_SUCCESS = 'TEST_ITEM_SAVE_SUCCESS';
export const TEST_ITEM_PREPARE = 'TEST_ITEM_PREPARE';
export const ADD_EDIT_CANCEL = 'ADD_EDIT_CANCEL';
export const TEST_ITEM_DELETE_CONFIRM = 'TEST_ITEM_DELETE_CONFIRM';
export const TEST_ITEM_DELETE_SUCCESS = 'TEST_ITEM_DELETE_SUCCESS';
export const TEST_ITEM_DELETE_CANCEL = 'TEST_ITEM_DELETE_CANCEL';
export const TEST_ITEM_UP_VERSION = 'TEST_ITEM_UP_VERSION';
export const TEST_ITEM_UP_VERSION_START = 'TEST_ITEM_UP_VERSION_START';
export const TEST_ITEM_UP_VERSION_SUCCESS = 'TEST_ITEM_UP_VERSION_SUCCESS';
export const TEST_ITEM_ACTIVE = 'TEST_ITEM_ACTIVE';
export const TEST_ITEM_ENABLE = 'TEST_ITEM_ENABLE';
export const TEST_ITEM_ACTIVE_ENABLE_START = 'TEST_ITEM_ACTIVE_ENABLE_START';
export const TEST_ITEM_ACTIVE_ENABLE_SUCCESS = 'TEST_ITEM_ACTIVE_ENABLE_SUCCESS';
export const TEST_ITEM_VIEW_OLD_VERSION_START = 'TEST_ITEM_VIEW_OLD_VERSION_START';
export const TEST_ITEM_VIEW_OLD_VERSION_SUCCESS = 'TEST_ITEM_VIEW_OLD_VERSION_SUCCESS';
export const TEST_ITEM_CURRENT = 'TEST_ITEM_CURRENT';
export const RECORD_ITEM_PREPARE = 'RECORD_ITEM_PREPARE';
export const RECORD_ITEM_ADD = 'RECORD_ITEM_ADD';
export const RECORD_ITEM_EDIT = 'RECORD_ITEM_EDIT';
export const RECORD_ITEM_EDIT_SAVE = 'RECORD_ITEM_EDIT_SAVE';
export const RECORD_ITEM_EDIT_SAVE_SUCCESS = 'RECORD_ITEM_EDIT_SAVE_SUCCESS';
export const RECORD_ITEM_ADD_CANCEL = 'RECORD_ITEM_ADD_CANCEL';
export const RECORD_ITEM_DELETE_CONFIRM = 'RECORD_ITEM_DELETE_CONFIRM';
export const RECORD_ITEM_DELETE_SUCCESS = 'RECORD_ITEM_DELETE_SUCCESS';
export const TEST_ITEM_VIEW_OLDVERSION = 'TEST_ITEM_VIEW_OLDVERSION';
export const TEST_ITEM_VIEW_OLDVERSION_SUCCESS = 'TEST_ITEM_VIEW_OLDVERSION_SUCCESS';
// 加载搜索树数据
export const loadData = () => ({
  type : CATEGORY_MANAGEMENT_DATA_LOAD
});

export const loadDataSuccess = (categoryInfo, categoryData) => ({
  type: CATEGORY_MANAGEMENT_DATA_LOAD_SUCCESS,
  categoryData: categoryData,
  categoryInfo: categoryInfo
});

export const asyncLoadData = (type, name) => (dispatch, state) => {
  dispatch(loadData());
  fetchData('/doc/categories/type/' + type, {}).then(
    (receipt) => {
      dispatch(loadDataSuccess({
        id: 0,
        code: 'R'+type,
        name: name,
        shorthand: '',
        type: type
      }, receipt.data));
      asyncSelectItem(receipt.data.length > 0 ? [receipt.data[0].id] : [])(dispatch, state);
    },
    (error) => {console.log(error)}
  );
};

// 加载搜索树选中节点数据
export const selectItem = () => ({
  type: TEST_ITEM_DATA_LOAD,
});

export const loadItemDataSuccess = (receipt, selectedItemKey) => ({
  type: TEST_ITEM_DATA_LOAD_SUCCESS,
  receipt: receipt,
  selectedItemKey: selectedItemKey,
});

export const asyncSelectItem = (selectedKeys, info) => (dispatch, state) => {
  if(!selectedKeys || !selectedKeys[0]) return;
  dispatch(selectItem());
  let selectedItemId = Number.parseInt(selectedKeys[0], 10);
  fetchData('/doc/testitem/query/usable/' + selectedItemId, {}).then(
    (receipt) => {
      dispatch(loadItemDataSuccess(receipt.data, selectedItemId));
    },
    (error) => {console.log(error)}
  );
};

// 新增 + 编辑检测项目
export const addItem = () => ({
  type: TEST_ITEM_ADD
});

export const editItem = () => ({
  type: TEST_ITEM_EDIT
});

export const saveTestItems = () => ({
  type: TEST_ITEM_SAVE
});

export const saveTestItemsSuccess = (receipt) => ({
  type: TEST_ITEM_SAVE_SUCCESS,
  receipt: receipt
});

export const asyncSaveItem = (itemData, editType, selectedItemKey, testItemParentId) => (dispatch, state) => {
  dispatch(saveTestItems());
  let url = '';
  if(editType === '新增'){
    url = '/doc/testitem/save/add' + '?categoryId=' + selectedItemKey;
  }else if(editType === '编辑'){
    url = '/doc/testitem/save/update' + '?categoryId=' + selectedItemKey + '&parentId=' + testItemParentId;
  }
  fetchData(url, {
    body: JSON.stringify(itemData)
  }).then(
    (receipt) => {
      dispatch(saveTestItemsSuccess(receipt.data));
    },
    (error) => {
      console.log(error);
    }
  )
};

// 获取表格勾选项
export const prepareItem = (selectedRows, selectedKeys) => ({
  type: TEST_ITEM_PREPARE,
  preparedItems: selectedRows,
  preparedKeys: selectedKeys,
});

// 删除检测项目
export const confirmDeleteItems = () => ({
  type: TEST_ITEM_DELETE_CONFIRM
});

export const deleteItemsSuccess = (receipt) => ({
  type: TEST_ITEM_DELETE_SUCCESS,
  removedIds: receipt,
});

export const asyncDeleteItems = (ids) => (dispatch, state) => {
  dispatch(confirmDeleteItems());
  let url = '/doc/testitem/delete';
  fetchData(url, {
    body: JSON.stringify(ids)
  }).then(
    (receipt) => {
      dispatch(deleteItemsSuccess(receipt.data));
    },
    (error) => {
      dispatch(cancelDeleteItems());
      console.log(error);
    }
  )
};

//检测项目升版
export const upItem = () => ({
  type: TEST_ITEM_UP_VERSION
});

export const upVersionStart = () => ({
  type: TEST_ITEM_UP_VERSION_START
});

export const upVersionSuccess = (receipt, TestItemVersionId) => ({
  type: TEST_ITEM_UP_VERSION_SUCCESS,
  newVersion: receipt,
  oldVersionId: TestItemVersionId,
});

export const asyncUpVersion = (TestItemId, TestItemVersionId) => (dispatch, state) => {
  dispatch(upVersionStart());
  let url = '/doc/testitem/update/upversion?' + 'pid=' + TestItemId + '&id=' + TestItemVersionId;
  fetchData(url, {}).then(
    (receipt) => {
      dispatch(upVersionSuccess(receipt.data, TestItemVersionId));
    },
    (error) => {
      console.log(error);
    }
  )
}

// 激活与禁用检测项目
export const activeItem = () => ({
  type: TEST_ITEM_ACTIVE
});

export const enableItem = () => ({
  type: TEST_ITEM_ENABLE
});

export const activeEnableStart = () => ({
  type: TEST_ITEM_ACTIVE_ENABLE_START
});

export const activeEnableSuccess = (receipt) => ({
  type: TEST_ITEM_ACTIVE_ENABLE_SUCCESS,
  newVersion: receipt,
});

export const asyncActiveEnable = (TestItemIDs) => (dispatch, state) => {
  dispatch(activeEnableStart());
  let url = '/doc/testitem/update/activation';
  fetchData(url, {
    body: JSON.stringify(TestItemIDs)
  }).then(
    (receipt) => {
      dispatch(activeEnableSuccess(receipt.data));
    },
    (error) => {
      console.log(error);
    }
  )
}

// 查看所有版本检测项目
export const viewOldVersion = () => ({
  type: TEST_ITEM_VIEW_OLD_VERSION_START
});

export const viewOldVersionSuccess = (receipt) => ({
  type: TEST_ITEM_VIEW_OLD_VERSION_SUCCESS,
  oldVersions: receipt,
});

export const viewOldVersionItem = (tid) => (dispatch, state) => {
  dispatch(viewOldVersion());
  let url = '/doc/testitem/query/all/' + tid;
  fetchData(url, {}).then(
    (receipt) => {
      dispatch(viewOldVersionSuccess(receipt.data));
    },
    (error) => {
      console.log(error);
    }
  )
}

// 获取检测项目点击项
export const getCurrentItem = (record) => ({
  type: TEST_ITEM_CURRENT,
  currentItem: record,
});

// 获取结果项勾选项
export const preparedRecord = (selectedRows, selectedRowKeys) => ({
  type: RECORD_ITEM_PREPARE,
  preparedRecords: selectedRows,
  preparedRecordKeys: selectedRowKeys,
});

// 新增 + 编辑结果项
export const addRecordItem = () => ({
  type: RECORD_ITEM_ADD
});

export const editRecordItem = () => ({
  type: RECORD_ITEM_EDIT
});

export const editRecordItemSave = () => ({
  type: RECORD_ITEM_EDIT_SAVE
});

export const editRecordItemSuccess = (receipt, pid) => ({
  type: RECORD_ITEM_EDIT_SAVE_SUCCESS,
  receipt: receipt,
  pid: pid,
});

export const asyncEditRecordItem = (Record, pid, resultId, MeasUnitId, roundRuleId, resultsFileId, editType) => (dispatch, state) => {
  dispatch(editRecordItemSave());
  let type = editType;
  let url = '';
  if(type === '新增检测项目结果项'){
    url = spliceUrlByParams('/doc/resultrecord/save',[pid,resultId,MeasUnitId,roundRuleId,resultsFileId],'testItemId','resultId','measUnitId','roundRuleId','resultsFileId');
  }else if(type === '编辑检测项目结果项'){
    url = spliceUrlByParams('/doc/resultrecord/update',[pid,resultId,MeasUnitId,roundRuleId,resultsFileId],'testItemId','resultId','measUnitId','roundRuleId','resultsFileId');
  }
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

// 删除结果项
export const confirmDeleteRecords = () => ({
  type: RECORD_ITEM_DELETE_CONFIRM
});

export const deleteRecordsSuccess = (receipt) => ({
  type: RECORD_ITEM_DELETE_SUCCESS,
  removedIds: receipt,
});

export const asyncDeleteRecords = (ids) => (dispatch, state) => {
  dispatch(confirmDeleteRecords());
  let url = '/doc/resultrecord/delete';
  fetchData(url, {
    body: JSON.stringify(ids)
  }).then(
    (receipt) => {
      dispatch(deleteRecordsSuccess(receipt.data));
    },
    (error) => {
      dispatch(cancelDeleteItems());
      console.log(error);
    }
  )
};

// 取消操作
export const cancelAddEdit = () => ({
  type: ADD_EDIT_CANCEL
});

export const cancelDeleteItems = () => ({
  type: TEST_ITEM_DELETE_CANCEL
});

export const cancelAddUnit = () => ({
  type: RECORD_ITEM_ADD_CANCEL
});

export const importItem = () => (dispatch, state) => {

}

export const exportItem = () => (dispatch, state) => {

}
