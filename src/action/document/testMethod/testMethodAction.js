import fetchData from '../../../util/fetchGateway';
import { spliceUrlByParams } from '../../../util/treeUtils';

export const CATEGORY_MANAGEMENT_DATA_LOAD = 'CATEGORY_MANAGEMENT_DATA_LOAD';
export const CATEGORY_MANAGEMENT_DATA_LOAD_SUCCESS = 'CATEGORY_MANAGEMENT_DATA_LOAD_SUCCESS';
export const TEST_METHOD_DATA_LOAD = 'TEST_METHOD_DATA_LOAD';
export const TEST_METHOD_DATA_LOAD_SUCCESS = 'TEST_METHOD_DATA_LOAD_SUCCESS';
export const TEST_METHOD_ADD = 'TEST_METHOD_ADD';
export const TEST_METHOD_SAVE = 'TEST_METHOD_SAVE';
export const TEST_METHOD_SAVE_SUCCESS = 'TEST_METHOD_SAVE_SUCCESS';
export const TEST_METHOD_PREPARE = 'TEST_METHOD_PREPARE';
export const TEST_METHOD_EDIT = 'TEST_METHOD_EDIT';
export const ADD_EDIT_CANCEL = 'ADD_EDIT_CANCEL';
export const TEST_METHOD_DELETE_CONFIRM = 'TEST_METHOD_DELETE_CONFIRM';
export const TEST_METHOD_DELETE_SUCCESS = 'TEST_METHOD_DELETE_SUCCESS';
export const TEST_METHOD_DELETE_CANCEL = 'TEST_METHOD_DELETE_CANCEL';
export const TEST_METHOD_UP_VERSION = 'TEST_METHOD_UP_VERSION';
export const TEST_METHOD_UP_VERSION_START = 'TEST_METHOD_UP_VERSION_START';
export const TEST_METHOD_UP_VERSION_SUCCESS = 'TEST_METHOD_UP_VERSION_SUCCESS';
export const TEST_METHOD_VIEW_OLD_VERSION_START = 'TEST_METHOD_VIEW_OLD_VERSION_START';
export const TEST_METHOD_VIEW_OLD_VERSION_SUCCESS = 'TEST_METHOD_VIEW_OLD_VERSION_SUCCESS';
export const TEST_METHOD_ACTIVE = 'TEST_METHOD_ACTIVE';
export const TEST_METHOD_ENABLE = 'TEST_METHOD_ENABLE';
export const TEST_METHOD_ACTIVE_ENABLE_START = 'TEST_METHOD_ACTIVE_ENABLE_START';
export const TEST_METHOD_ACTIVE_ENABLE_SUCCESS = 'TEST_METHOD_ACTIVE_ENABLE_SUCCESS';
export const TEST_METHOD_DISCARD = 'TEST_METHOD_DISCARD';
export const TEST_METHOD_DISCARD_START = 'TEST_METHOD_DISCARD_START';
export const TEST_METHOD_DISCARD_SUCCESS = 'TEST_METHOD_DISCARD_SUCCESS';
export const QUERY_TEST_ITEM_LINKED_TEST_METHOD_START = 'QUERY_TEST_ITEM_LINKED_TEST_METHOD_START';
export const QUERY_TEST_ITEM_LINKED_TEST_METHOD_SUCCESS = 'QUERY_TEST_ITEM_LINKED_TEST_METHOD_SUCCESS';
export const UPLOAD_TEST_METHOD = 'UPLOAD_TEST_METHOD';
export const UPLOAD_TEST_METHOD_START = 'UPLOAD_TEST_METHOD_START';
export const UPLOAD_TEST_METHOD_SUCCESS = 'UPLOAD_TEST_METHOD_SUCCESS';

// 树节点数据加载
export const loadData = () => ({
  type : CATEGORY_MANAGEMENT_DATA_LOAD
});

export const loadDataSuccess = (categoryInfo, categoryData) => ({
  type: CATEGORY_MANAGEMENT_DATA_LOAD_SUCCESS,
  categoryData: categoryData,
  categoryInfo: categoryInfo,
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
  type: TEST_METHOD_DATA_LOAD,
});

export const loadItemDataSuccess = (receipt, selectedItemKey) => ({
  type: TEST_METHOD_DATA_LOAD_SUCCESS,
  receipt: receipt,
  selectedItemKey: selectedItemKey,
});

export const asyncSelectItem = (selectedKeys) => (dispatch, state) => {
  if(!selectedKeys || !selectedKeys[0]) return;
  dispatch(selectItem());
  let selectedItemId = Number.parseInt(selectedKeys[0], 10);
  fetchData('/doc/testmethod/query/usable/' + selectedItemId, {}).then(
  (receipt) => {
    dispatch(loadItemDataSuccess(receipt.data, selectedItemId));
  },(error) => {console.log(error)});
};

// 新增+编辑检测方法
export const addItem = () => ({
  type: TEST_METHOD_ADD
});

export const editItem = () => ({
  type: TEST_METHOD_EDIT
});

export const saveStandrad = () => ({
  type: TEST_METHOD_SAVE
});

export const saveStandradSuccess = (receipt) => ({
  type: TEST_METHOD_SAVE_SUCCESS,
  receipt: receipt
});

export const asyncSaveItem = (methodData, editType, selectedItemKey, methodParentId) => (dispatch, state) => {
  dispatch(saveStandrad());
  let url = '';
  if(editType === '新增'){
    url = '/doc/testmethod/save/add' + '?categoryId=' + selectedItemKey;
  }else if(editType === '编辑'){
    url = '/doc/testmethod/save//update' + '?categoryId=' + selectedItemKey + '&parentId=' + methodParentId;
  }
  fetchData(url, {
    body: JSON.stringify(methodData)
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
export const prepareItem = (selectedRows, selectedKeys) => ({
  type: TEST_METHOD_PREPARE,
  preparedItems: selectedRows,
  preparedKeys: selectedKeys,
});

// 删除接口
export const confirmDeleteItems = () => ({
  type: TEST_METHOD_DELETE_CONFIRM
});

export const deleteItemsSuccess = (receipt) => ({
  type: TEST_METHOD_DELETE_SUCCESS,
  removedIds: receipt
});

export const asyncDeleteItems = (ids) => (dispatch, state) => {
  dispatch(confirmDeleteItems());
  let url = '/doc/testmethod/delete';
  fetchData(url, {
    body: JSON.stringify(ids)
  }).then(
    (receipt) => {
      dispatch(deleteItemsSuccess(receipt.data));
    },
    (error) => {
      console.log(error);
    }
  )
};

// 升级版本
export const upItem = () => ({
  type: TEST_METHOD_UP_VERSION
});

export const upVersionStart = () => ({
  type: TEST_METHOD_UP_VERSION_START
});

export const upVersionSuccess = (receipt, MethodId) => ({
  type: TEST_METHOD_UP_VERSION_SUCCESS,
  newVersion: receipt,
  oldVersion: MethodId,
});

export const asyncUpVersion = (ParentId, MethodId) => (dispatch, state) => {
  dispatch(upVersionStart());
  let url = '/doc/testmethod/update/upversion?' + 'pid=' + ParentId + '&id=' + MethodId;
  fetchData(url, {}).then(
    (receipt) => {
      dispatch(upVersionSuccess(receipt.data, MethodId));
    },
    (error) => {
      console.log(error);
    }
  )
}

// 激活与禁用
export const activeItem = () => ({
  type: TEST_METHOD_ACTIVE
});

export const enableItem = () => ({
  type: TEST_METHOD_ENABLE
});

export const activeEnableStart = () => ({
  type: TEST_METHOD_ACTIVE_ENABLE_START
});

export const activeEnableSuccess = (receipt) => ({
  type: TEST_METHOD_ACTIVE_ENABLE_SUCCESS,
  newVersion: receipt,
});

export const asyncActiveEnable = (TestMethodIDs) => (dispatch, state) => {
  dispatch(activeEnableStart());
  let url = '/doc/testmethod/update/activation';
  fetchData(url, {
    body: JSON.stringify(TestMethodIDs)
  }).then(
    (receipt) => {
      dispatch(activeEnableSuccess(receipt.data));
    },
    (error) => {
      console.log(error);
    }
  )
}

// 查看旧版本
export const viewOldVersion = () => ({
  type: TEST_METHOD_VIEW_OLD_VERSION_START
});

export const viewOldVersionSuccess = (receipt) => ({
  type: TEST_METHOD_VIEW_OLD_VERSION_SUCCESS,
  oldVersions: receipt,
});

export const viewOldVersionItem = (parentId) => (dispatch, state) => {
  dispatch(viewOldVersion());
  let url = '/doc/testmethod/query/all/' + parentId;
  fetchData(url, {}).then(
    (receipt) => {
      dispatch(viewOldVersionSuccess(receipt.data));
    },
    (error) => {
      console.log(error);
    }
  )
}

// 废弃
export const discardItem = () => ({
  type: TEST_METHOD_DISCARD
});

export const discardItemStart = () => ({
  type: TEST_METHOD_DISCARD_START
});

export const discardItemSuccess = (receipt) => ({
  type: TEST_METHOD_DISCARD_SUCCESS,
  newVersion: receipt,
});

export const asyncDiscard = (TestMethodID) => (dispatch, state) => {
  dispatch(discardItemStart());
  let url = '/doc/testmethod/update/discard/' + TestMethodID;
  fetchData(url, {}).then(
    (receipt) => {
      dispatch(discardItemSuccess(receipt.data));
    },
    (error) => {
      console.log(error);
    }
  )
}

// 上传文件 弹框 / 确定
export const uploadModalTestMethod = () => ({
  type: UPLOAD_TEST_METHOD
})
export const uploadTestMethodStart = () => ({
  type: UPLOAD_TEST_METHOD_START
})
export const uploadTestMethodSuccess = (data) => ({
  type: UPLOAD_TEST_METHOD_SUCCESS,
  data
})
export const uploadTestMethod = () => (dispatch, state) => {
  dispatch(uploadTestMethodStart())
  // let url = spliceUrlByParams('', [id], 'id');
  fetchData('/upload/?type=' + 'method', {
    // body: JSON.stringify(data)
  }).then(
    (receipt) => {
      dispatch(uploadTestMethodSuccess(receipt.data))
      // uploadReportTemplatList(id)(dispatch, state)
      dispatch(cancelAddEdit())
    },
    (error) => {console.log(error);}
  )
}


export const importItem = () => (dispatch, state) => {

}

export const exportItem = () => (dispatch, state) => {

}

// 获取与被点击的检测方法相关联的检测项目

export const getTestItemsStart = () => ({
  type: QUERY_TEST_ITEM_LINKED_TEST_METHOD_START
});

export const getTestItemsSuccess = (receipt) => ({
  type: QUERY_TEST_ITEM_LINKED_TEST_METHOD_SUCCESS,
  testItems: receipt,
});

export const getTestItems = (MethodId) => (dispatch, state) => {
  dispatch(getTestItemsStart());
  let url = '/doc/testmethod/query/testitem/' + MethodId;
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
  type: TEST_METHOD_DELETE_CANCEL
});
