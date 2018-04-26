import fetchData from '../../../util/fetchGateway';

export const CATEGORY_MANAGEMENT_DATA_LOAD = 'CATEGORY_MANAGEMENT_DATA_LOAD';
export const CATEGORY_MANAGEMENT_DATA_LOAD_SUCCESS = 'CATEGORY_MANAGEMENT_DATA_LOAD_SUCCESS';
export const TEST_STANDARD_DATA_LOAD = 'TEST_STANDARD_DATA_LOAD';
export const TEST_STANDARD_DATA_LOAD_SUCCESS = 'TEST_STANDARD_DATA_LOAD_SUCCESS';
export const TEST_STANDARD_ADD = 'TEST_STANDARD_ADD';
export const TEST_STANDARD_SAVE = 'TEST_STANDARD_SAVE';
export const TEST_STANDARD_SAVE_SUCCESS = 'TEST_STANDARD_SAVE_SUCCESS';
export const TEST_STANDARD_PREPARE = 'TEST_STANDARD_PREPARE';
export const TEST_STANDARD_EDIT = 'TEST_STANDARD_EDIT';
export const ADD_EDIT_CANCEL = 'ADD_EDIT_CANCEL';
export const TEST_STANDARD_DELETE_CONFIRM = 'TEST_STANDARD_DELETE_CONFIRM';
export const TEST_STANDARD_DELETE_SUCCESS = 'TEST_STANDARD_DELETE_SUCCESS';
export const TEST_STANDARD_DELETE_CANCEL = 'TEST_STANDARD_DELETE_CANCEL';
export const TEST_STANDARD_UP_VERSION = 'TEST_STANDARD_UP_VERSION';
export const TEST_STANDARD_UP_VERSION_START = 'TEST_STANDARD_UP_VERSION_START';
export const TEST_STANDARD_UP_VERSION_SUCCESS = 'TEST_STANDARD_UP_VERSION_SUCCESS';
export const TEST_STANDARD_VIEW_OLD_VERSION_START = 'TEST_STANDARD_VIEW_OLD_VERSION_START';
export const TEST_STANDARD_VIEW_OLD_VERSION_SUCCESS = 'TEST_STANDARD_VIEW_OLD_VERSION_SUCCESS';
export const TEST_STANDARD_ACTIVE = 'TEST_STANDARD_ACTIVE';
export const TEST_STANDARD_ENABLE = 'TEST_STANDARD_ENABLE';
export const TEST_STANDARD_ACTIVE_ENABLE_START = 'TEST_STANDARD_ACTIVE_ENABLE_START';
export const TEST_STANDARD_ACTIVE_ENABLE_SUCCESS = 'TEST_STANDARD_ACTIVE_ENABLE_SUCCESS';
export const TEST_STANDARD_DISCARD = 'TEST_STANDARD_DISCARD';
export const TEST_STANDARD_DISCARD_START = 'TEST_STANDARD_DISCARD_START';
export const TEST_STANDARD_DISCARD_SUCCESS = 'TEST_STANDARD_DISCARD_SUCCESS';
export const QUERY_TEST_ITEM_LINKED_TEST_METHOD_START = 'QUERY_TEST_ITEM_LINKED_TEST_METHOD_START';
export const QUERY_TEST_ITEM_LINKED_TEST_METHOD_SUCCESS = 'QUERY_TEST_ITEM_LINKED_TEST_METHOD_SUCCESS';

// 树节点数据加载
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

// 树表联动查询数据
export const selectItem = () => ({
  type: TEST_STANDARD_DATA_LOAD,
});

export const loadItemDataSuccess = (receipt, selectedItemKey) => ({
  type: TEST_STANDARD_DATA_LOAD_SUCCESS,
  receipt: receipt,
  selectedItemKey: selectedItemKey,
});

export const asyncSelectItem = (selectedKeys, info) => (dispatch, state) => {
  if(!selectedKeys || !selectedKeys[0]) return;
  dispatch(selectItem());
  let selectedItemId = Number.parseInt(selectedKeys[0], 10);
  fetchData('/doc/teststandard/query/usable/' + selectedItemId, {}).then(
  (receipt) => {
    dispatch(loadItemDataSuccess(receipt.data, selectedItemId));
  },(error) => {console.log(error)});
};

// 新增 + 编辑检测标准
export const addItem = () => ({
  type: TEST_STANDARD_ADD
});

export const editItem = () => ({
  type: TEST_STANDARD_EDIT
});

export const saveStandrad = () => ({
  type: TEST_STANDARD_SAVE
});

export const saveStandradSuccess = (receipt) => ({
  type: TEST_STANDARD_SAVE_SUCCESS,
  receipt: receipt
});

export const asyncSaveItem = (standardData, editType, selectedItemKey, testStandardParentId) => (dispatch, state) => {
  dispatch(saveStandrad());
  let url = '';
  if(editType === '新增'){
    url = '/doc/teststandard/save/add' + '?categoryId=' + selectedItemKey;
  }else if(editType === '编辑'){
    url = '/doc/teststandard/save/update' + '?categoryId=' + selectedItemKey + '&parentId=' + testStandardParentId;
  }
  fetchData(url, {
    body: JSON.stringify(standardData)
  }).then(
    (receipt) => {
      dispatch(saveStandradSuccess(receipt.data));
    },
    (error) => {
      console.log(error);
    }
  )
};

// 获取表格勾选项
export const prepareItem = (selectedRows, selectedRowKeys) => ({
  type: TEST_STANDARD_PREPARE,
  preparedItems: selectedRows,
  preparedKeys: selectedRowKeys,
});

// 删除接口
export const confirmDeleteItems = () => ({
  type: TEST_STANDARD_DELETE_CONFIRM
});

export const deleteItemsSuccess = (receipt) => ({
  type: TEST_STANDARD_DELETE_SUCCESS,
  removedIds: receipt
});

export const asyncDeleteItems = (ids) => (dispatch, state) => {
  dispatch(confirmDeleteItems());
  let url = '/doc/teststandard/delete';
  fetchData(url, {
    body: JSON.stringify(ids)
  }).then(
    (receipt) => {
      dispatch(deleteItemsSuccess(receipt.data));
    },
    (error) => {
      dispatch(cancelDeleteItems())
      console.log(error);
    }
  )
};

// 升级版本
export const upItem = () => ({
  type: TEST_STANDARD_UP_VERSION
});

export const upVersionStart = () => ({
  type: TEST_STANDARD_UP_VERSION_START
});

export const upVersionSuccess = (receipt, StandradId) => ({
  type: TEST_STANDARD_UP_VERSION_SUCCESS,
  newVersion: receipt,
  oldVersion: StandradId,
});

export const asyncUpVersion = (ParentId, StandradId) => (dispatch, state) => {
  dispatch(upVersionStart());
  let url = '/doc/teststandard/update/upversion?' + 'pid=' + ParentId + '&id=' + StandradId;
  fetchData(url, {}).then(
    (receipt) => {
      dispatch(upVersionSuccess(receipt.data, StandradId));
    },
    (error) => {
      console.log(error);
    }
  )
}

// 查看旧版本
export const viewOldVersion = () => ({
  type: TEST_STANDARD_VIEW_OLD_VERSION_START
});

export const viewOldVersionSuccess = (receipt) => ({
  type: TEST_STANDARD_VIEW_OLD_VERSION_SUCCESS,
  oldVersions: receipt,
});

export const viewOldVersionItem = (parentId) => (dispatch, state) => {
  dispatch(viewOldVersion());
  let url = '/doc/teststandard/query/all/' + parentId;
  fetchData(url, {}).then(
    (receipt) => {
      dispatch(viewOldVersionSuccess(receipt.data));
    },
    (error) => {
      console.log(error);
    }
  )
}

// 激活与禁用
export const activeItem = () => ({
  type: TEST_STANDARD_ACTIVE
});

export const enableItem = () => ({
  type: TEST_STANDARD_ENABLE
});

export const activeEnableStart = () => ({
  type: TEST_STANDARD_ACTIVE_ENABLE_START
});

export const activeEnableSuccess = (receipt) => ({
  type: TEST_STANDARD_ACTIVE_ENABLE_SUCCESS,
  newVersion: receipt,
});

export const asyncActiveEnable = (TestStandradIDs) => (dispatch, state) => {
  dispatch(activeEnableStart());
  let url = '/doc/teststandard/update/activation';
  fetchData(url, {
    body: JSON.stringify(TestStandradIDs)
  }).then(
    (receipt) => {
      dispatch(activeEnableSuccess(receipt.data));
    },
    (error) => {
      console.log(error);
    }
  )
}

// 废弃
export const discardItem = () => ({
  type: TEST_STANDARD_DISCARD
});

export const discardItemStart = () => ({
  type: TEST_STANDARD_DISCARD_START
});

export const discardItemSuccess = (receipt) => ({
  type: TEST_STANDARD_DISCARD_SUCCESS,
  newVersion: receipt,
});

export const asyncDiscard = (TestStandradID) => (dispatch, state) => {
  dispatch(discardItemStart());
  let url = '/doc/teststandard/update/discard/' + TestStandradID;
  fetchData(url, {}).then(
    (receipt) => {
      dispatch(discardItemSuccess(receipt.data));
    },
    (error) => {
      console.log(error);
    }
  )
}

// 查询关联检测项目
export const getTestItemsStart = () => ({
  type: QUERY_TEST_ITEM_LINKED_TEST_METHOD_START
});

export const getTestItemsSuccess = (receipt) => ({
  type: QUERY_TEST_ITEM_LINKED_TEST_METHOD_SUCCESS,
  testItems: receipt,
});

export const getTestItems = (StandardId) => (dispatch, state) => {
  dispatch(getTestItemsStart());
  let url = '/doc/teststandard/query/testitem/' + StandardId;
  fetchData(url, {}).then(
    (receipt) => {
      dispatch(getTestItemsSuccess(receipt.data));
    },
    (error) => {
      console.log(error);
    }
  )
}

// 取消操作
export const cancelAddEdit = () => ({
  type: ADD_EDIT_CANCEL
});

export const cancelDeleteItems = () => ({
  type: TEST_STANDARD_DELETE_CANCEL
});

export const importItem = () => (dispatch, state) => {

}

export const exportItem = () => (dispatch, state) => {

}
