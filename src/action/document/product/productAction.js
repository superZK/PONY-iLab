import fetchData, {fieldMapper} from '../../../util/fetchGateway';
import { spliceUrlByParams } from '../../../util/treeUtils';

export const CATEGORY_MANAGEMENT_DATA_LOAD = 'CATEGORY_MANAGEMENT_DATA_LOAD';
export const CATEGORY_MANAGEMENT_DATA_LOAD_SUCCESS = 'CATEGORY_MANAGEMENT_DATA_LOAD_SUCCESS';
export const PRODUCT_DATA_LOAD = 'PRODUCT_DATA_LOAD';
export const PRODUCT_DATA_LOAD_SUCCESS = 'PRODUCT_DATA_LOAD_SUCCESS';
export const PRODUCT_ADD = 'PRODUCT_ADD';
export const PRODUCT_SAVE = 'PRODUCT_SAVE';
export const PRODUCT_SAVE_SUCCESS = 'PRODUCT_SAVE_SUCCESS';
export const PRODUCT_PREPARE = 'PRODUCT_PREPARE';
export const PRODUCT_EDIT = 'PRODUCT_EDIT';
export const ADD_EDIT_CANCEL = 'ADD_EDIT_CANCEL';
export const PRODUCT_DELETE_CONFIRM = 'PRODUCT_DELETE_CONFIRM';
export const PRODUCT_DELETE_SUCCESS = 'PRODUCT_DELETE_SUCCESS';
export const PRODUCT_DELETE_CANCEL = 'PRODUCT_DELETE_CANCEL';
export const PRODUCT_UP_VERSION = 'PRODUCT_UP_VERSION';
export const PRODUCT_UP_VERSION_START = 'PRODUCT_UP_VERSION_START';
export const PRODUCT_UP_VERSION_SUCCESS = 'PRODUCT_UP_VERSION_SUCCESS';
export const PRODUCT_VIEW_OLD_VERSION_START = 'PRODUCT_VIEW_OLD_VERSION_START';
export const PRODUCT_VIEW_OLD_VERSION_SUCCESS = 'PRODUCT_VIEW_OLD_VERSION_SUCCESS';
export const PRODUCT_ACTIVE = 'PRODUCT_ACTIVE';
export const PRODUCT_ENABLE = 'PRODUCT_ENABLE';
export const PRODUCT_ACTIVE_ENABLE_START = 'PRODUCT_ACTIVE_ENABLE_START';
export const PRODUCT_ACTIVE_ENABLE_SUCCESS = 'PRODUCT_ACTIVE_ENABLE_SUCCESS';
export const PRODUCT_CURRENT = 'PRODUCT_CURRENT';
export const PROGRAM_ITEM_ADD = 'PROGRAM_ITEM_ADD';
export const PROGRAM_ITEM_ADD_CANCEL = 'PROGRAM_ITEM_ADD_CANCEL';
export const PROGRAM_ITEM_SAVE = 'PROGRAM_ITEM_SAVE';
export const PROGRAM_ITEM_SAVE_SUCCESS = 'PROGRAM_ITEM_SAVE_SUCCESS';
export const PROGRAM_ITEM_PREPARE = 'PROGRAM_ITEM_PREPARE';
export const PROGRAM_ITEM_DELETE_CONFIRM = 'PROGRAM_ITEM_DELETE_CONFIRM';
export const PROGRAM_ITEM_DELETE_SUCCESS = 'PROGRAM_ITEM_DELETE_SUCCESS';
export const PROGRAM_ITEM_SHOW = 'PROGRAM_ITEM_SHOW';
export const PROGRAM_ITEM_EDIT = 'PROGRAM_ITEM_EDIT';
export const PROGRAM_ITEM_EDIT_START = 'PROGRAM_ITEM_EDIT_START';
export const PROGRAM_ITEM_EDIT_SUCCESS = 'PROGRAM_ITEM_EDIT_SUCCESS';

// 新修改 检测范围
// 检测范围 列表
export const PRODUCT_SCOPE_LIST = 'PRODUCT_SCOPE_LIST';
export const PRODUCT_SCOPE_LIST_SUCCESS = 'PRODUCT_SCOPE_LIST_SUCCESS';
// 列表 rows rowKeys
export const PRODUCT_SCOPE_LIST_ROWS = 'PRODUCT_SCOPE_LIST_ROWS';
// 列表 点击项
export const PRODUCT_SCOPE_LIST_CLICT = 'PRODUCT_SCOPE_LIST_CLICT';
// 检测范围新增、修改
export const PRODUCT_SCOPE_ADD = 'PRODUCT_SCOPE_ADD';
export const PRODUCT_SCOPE_EDIT = 'PRODUCT_SCOPE_EDIT';
export const PRODUCT_SCOPE_ADD_START = 'PRODUCT_SCOPE_ADD_START';
export const PRODUCT_SCOPE_ADD_SUCCESS = 'PRODUCT_SCOPE_ADD_SUCCESS';
// 检测范围 删除
export const PRODUCT_SCOPE_DELETE = 'PRODUCT_SCOPE_DELETE';
export const PRODUCT_SCOPE_DELETE_SUCCESS = 'PRODUCT_SCOPE_DELETE_SUCCESS';
// 检测范围 结果项 列表
export const PRODUCT_SCOPE_RESULT_LIST = 'PRODUCT_SCOPE_RESULT_LIST';
export const PRODUCT_SCOPE_RESULT_LIST_SUCCESS = 'PRODUCT_SCOPE_RESULT_LIST_SUCCESS';
// 列表 结果项 rows rowKeys
export const PRODUCT_SCOPE_RESULT_LIST_ROWS = 'PRODUCT_SCOPE_RESULT_LIST_ROWS';
// 检测范围 结果项 新增
export const PRODUCT_SCOPE_RESULT_ADD_SUCCESS = 'PRODUCT_SCOPE_RESULT_ADD_SUCCESS';
// 检测范围 结果项 删除
export const PRODUCT_SCOPE_RESULT_DELETE = 'PRODUCT_SCOPE_RESULT_DELETE';
export const PRODUCT_SCOPE_RESULT_DELETE_SUCCESS = 'PRODUCT_SCOPE_RESULT_DELETE_SUCCESS';

// 弹框返回
export const PRODUCT_SCOPE_CANCEL = 'PRODUCT_SCOPE_CANCEL';
// ===================================
// 检测范围新增检测项目
export const ASYNC_ADD_TESTFLOW_SCOPE_START = 'ASYNC_ADD_TESTFLOW_SCOPE_START';
export const ASYNC_ADD_TESTFLOW_SCOPE_SUCCESS = 'ASYNC_ADD_TESTFLOW_SCOPE_SUCCESS';
// 检测范围编辑检测项目
export const ASYNC_EDIT_TESTFLOW_SCOPE_START = 'ASYNC_EDIT_TESTFLOW_SCOPE_START';
export const ASYNC_EDIT_TESTFLOW_SCOPE_SUCCESS = 'ASYNC_EDIT_TESTFLOW_SCOPE_SUCCESS';
// 查询可添加结果项
export const ASYNC_QUERY_SCOPE_RECORD_START = 'ASYNC_QUERY_SCOPE_RECORD_START';
export const ASYNC_QUERY_SCOPE_RECORD_SUCCESS = 'ASYNC_QUERY_SCOPE_RECORD_SUCCESS';
// 新增结果项
export const ASYNC_ADD_SCOPE_RECORD_START = 'ASYNC_ADD_SCOPE_RECORD_START';
export const ASYNC_ADD_SCOPE_RECORD_SUCCESS = 'ASYNC_ADD_SCOPE_RECORD_SUCCESS';
// 编辑结果项
export const EDIT_SCOPE_RECORD = 'EDIT_SCOPE_RECORD';
export const ASYNC_EDIT_SCOPE_RECORD_START = 'ASYNC_EDIT_SCOPE_RECORD_START';
export const ASYNC_EDIT_SCOPE_RECORD_SUCCESS = 'ASYNC_EDIT_SCOPE_RECORD_SUCCESS';


// 可搜索树数据加载
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
  type: PRODUCT_DATA_LOAD,
});

export const loadItemDataSuccess = (receipt, selectedItemKey) => ({
  type: PRODUCT_DATA_LOAD_SUCCESS,
  receipt: receipt,
  selectedItemKey: selectedItemKey,
});

export const asyncSelectItem = (selectedKeys, info) => (dispatch, state) => {
  if(!selectedKeys || !selectedKeys[0]) return;
  dispatch(selectItem());
  let selectedItemId = Number.parseInt(selectedKeys[0], 10);
  fetchData('/doc/product/query/usable/' + selectedItemId, {}, fieldMapper({'productTest':{'key':'id'}})).then(
  (receipt) => {
    dispatch(loadItemDataSuccess(receipt.data, selectedItemId));
    if (receipt && receipt.data && receipt.data.length > 0) {
      listProductScope(receipt.data[0].id)(dispatch, state);
    }
  },(error) => {console.log(error)});
};

// 新增 + 编辑产品
export const addItem = () => ({
  type: PRODUCT_ADD
});

export const editItem = () => ({
  type: PRODUCT_EDIT
});

export const saveStandrad = () => ({
  type: PRODUCT_SAVE
});

export const saveStandradSuccess = (receipt) => ({
  type: PRODUCT_SAVE_SUCCESS,
  receipt: receipt
});

export const asyncSaveItem = (productData, editType, selectedItemKey, productParentId) => (dispatch, state) => {
  dispatch(saveStandrad());
  let url = '';
  if(editType === '新增'){
    url = '/doc/product/save/add?categoryId=' + selectedItemKey;
  }else if(editType === '编辑'){
    url = '/doc/product/save/update?categoryId=' + selectedItemKey + '&parentId=' + productParentId;
  }
  fetchData(url, {
    body: JSON.stringify(productData)
  }).then(
    (receipt) => {
      dispatch(saveStandradSuccess(receipt.data));
    },
    (error) => {
      console.log(error);
    }
  )
};

// 获取产品表格勾选项
export const prepareItem = (selectedRows, selectRowKeys) => ({
  type: PRODUCT_PREPARE,
  preparedItems: selectedRows,
  preparedKeys: selectRowKeys,
});

// 删除产品
export const confirmDeleteItems = () => ({
  type: PRODUCT_DELETE_CONFIRM
});

export const deleteItemsSuccess = (receipt) => ({
  type: PRODUCT_DELETE_SUCCESS,
  removedIds: receipt
});

export const asyncDeleteItems = (ids) => (dispatch, state) => {
  dispatch(confirmDeleteItems());
  let url = '/doc/product/delete';
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

// 产品升级版本
export const upItem = () => ({
  type: PRODUCT_UP_VERSION
});

export const upVersionStart = () => ({
  type: PRODUCT_UP_VERSION_START
});

export const upVersionSuccess = (receipt, ProductId) => ({
  type: PRODUCT_UP_VERSION_SUCCESS,
  newVersion: receipt,
  oldVersion: ProductId,
});

export const asyncUpVersion = (ParentId, ProductId) => (dispatch, state) => {
  dispatch(upVersionStart());
  let url = '/doc/product/update/upversion?pid=' + ParentId + '&id=' + ProductId;
  fetchData(url, {}).then(
    (receipt) => {
      dispatch(upVersionSuccess(receipt.data, ProductId));
    },
    (error) => {
      console.log(error);
    }
  )
}

// 查看产品所有版本
export const viewOldVersion = () => ({
  type: PRODUCT_VIEW_OLD_VERSION_START
});

export const viewOldVersionSuccess = (receipt) => ({
  type: PRODUCT_VIEW_OLD_VERSION_SUCCESS,
  oldVersions: receipt,
});

export const viewOldVersionItem = (parentId) => (dispatch, state) => {
  dispatch(viewOldVersion());
  let url = '/doc/product/query/all/' + parentId;
  fetchData(url, {}).then(
    (receipt) => {
      dispatch(viewOldVersionSuccess(receipt.data));
    },
    (error) => {
      console.log(error);
    }
  )
}

// 产品激活与禁用
export const activeItem = () => ({
  type: PRODUCT_ACTIVE
});

export const enableItem = () => ({
  type: PRODUCT_ENABLE
});

export const activeEnableStart = () => ({
  type: PRODUCT_ACTIVE_ENABLE_START
});

export const activeEnableSuccess = (receipt) => ({
  type: PRODUCT_ACTIVE_ENABLE_SUCCESS,
  newVersion: receipt,
});

export const asyncActiveEnable = (ProductIDs) => (dispatch, state) => {
  dispatch(activeEnableStart());
  let url = '/doc/product/update/activation';
  fetchData(url, {
    body: JSON.stringify(ProductIDs)
  }).then(
    (receipt) => {
      dispatch(activeEnableSuccess(receipt.data));
    },
    (error) => {
      console.log(error);
    }
  )
}

// 获取产品表格点击项
export const getCurrentItem = (record) => ({
  type: PRODUCT_CURRENT,
  currentItem: record,
});

// 新增检测方案
export const addProgramItem = () => ({
  type: PROGRAM_ITEM_ADD
});

export const addProgramItemSave = () => ({
  type: PROGRAM_ITEM_SAVE
});

export const addProgramItemSuccess = (receipt, pid) => ({
  type: PROGRAM_ITEM_SAVE_SUCCESS,
  receipt: receipt,
  pid: pid,
});

export const asyncAddProgram = (program, productId, productGradeId, testPlanId) => (dispatch, state) => {
  dispatch(addProgramItemSave());
  let url = spliceUrlByParams('/doc/producttest/save',[productId,productGradeId,testPlanId],'productId','productGradeId','testPlanId');
  fetchData(url, {
    body: JSON.stringify(program)
  }).then(
    (receipt) => {
      dispatch(addProgramItemSuccess(receipt.data, productId));
    },
    (error) => {
      console.log(error);
    }
  )
};

// 获取检测方案勾选项
export const preparedProgram = (selectedRows, selectedRowKeys) => ({
  type: PROGRAM_ITEM_PREPARE,
  preparedPrograms: selectedRows,
  preparedProgramKeys: selectedRowKeys,
});

// 编辑检测方案
export const editProgram = () => ({
  type: PROGRAM_ITEM_EDIT
});

export const editProgramItemSave = () => ({
  type: PROGRAM_ITEM_EDIT_START
});

export const editProgramItemSuccess = (receipt, pid) => ({
  type: PROGRAM_ITEM_EDIT_SUCCESS,
  receipt: receipt,
  pid: pid,
});

export const asyncEditProgram = (program, productId, productGradeId, testPlanId) => (dispatch, state) => {
  dispatch(editProgramItemSave());
  let url = '/doc/producttest/update?productId=' + productId + '&productGradeId=' + productGradeId + '&testPlanId=' + testPlanId;
  fetchData(url, {
    body: JSON.stringify(program)
  }).then(
    (receipt) => {
      dispatch(editProgramItemSuccess(receipt.data, productId));
    },
    (error) => {
      console.log(error);
    }
  )
};

// 删除检测方案
export const confirmDeletePrograms = () => ({
  type: PROGRAM_ITEM_DELETE_CONFIRM
});

export const deleteProgramsSuccess = (receipt) => ({
  type: PROGRAM_ITEM_DELETE_SUCCESS,
  removedIds: receipt,
});

export const asyncDeletePrograms = (ids) => (dispatch, state) => {
  dispatch(confirmDeletePrograms());
  let url = '/doc/producttest/delete';
  fetchData(url, {
    body: JSON.stringify(ids)
  }).then(
    (receipt) => {
      dispatch(deleteProgramsSuccess(receipt.data));
    },
    (error) => {
      console.log(error);
    }
  )
};

// 检测方案配置（打开项目标准方法组合modal）
export const showProgram = () => ({
  type: PROGRAM_ITEM_SHOW
});

// 导入与导出（未实现）
export const importItem = () => (dispatch, state) => {

}

export const exportItem = () => (dispatch, state) => {

}

// 新修改  检测范围

// 检测范围 列表
export const productScopeList = () => ({
  type: PRODUCT_SCOPE_LIST
});
export const productScopeListSuccess = (data) => ({
  type: PRODUCT_SCOPE_LIST_SUCCESS,
  data
});
export const listProductScope = (id) => (dispatch, state) => {
  dispatch(productScopeList());
  fetchData('/doc/product/scope/query?pid=' + id, {}, fieldMapper({'productTestScopeResult':{'key':'id'}})).then(
    (receipt) => {
      dispatch(productScopeListSuccess(receipt.data));
      if(receipt.data && receipt.data.length) {
        receipt.data.map(item => {
          return item.key = item.id + '';
        })
      }
    },
    (error) => {
      dispatch(cancelDeleteItems())
      console.log(error)
    }
  );
};
// 列表 rows rowKeys
export const listProductScopeRows = (rows, rowKeys) => ({
  type: PRODUCT_SCOPE_LIST_ROWS,
  rows,
  rowKeys
})
// 获取检测项目 点击项
export const listProductScopeClick = (record) => ({
  type: PRODUCT_SCOPE_LIST_CLICT,
  record,
});

// 检测范围新增、修改
export const productScopeAdd = () => ({
  type: PRODUCT_SCOPE_ADD,
});
export const productScopeEdit = () => ({
  type: PRODUCT_SCOPE_EDIT,
});
export const productScopeSave = () => ({
  type: PRODUCT_SCOPE_ADD_START,
});
export const productScopeSaveSuccess = (data) => ({
  type: PRODUCT_SCOPE_ADD_SUCCESS,
  data
});
export const SaveProductScope = (data, product, item, standard, method, serviceGroup, measUnit) => (dispatch, state) => {
  dispatch(productScopeSave());
  // let url = '';
  // if (editType === '新增检测项目') {
  //   url = '/orders/reporttemplate/save?typeId=' + selectedKey;
  // } else if(editType === '编辑检测项目') {
  //   url = '/orders/reporttemplate/update?typeId=' + selectedKey;
  // };
  let url = spliceUrlByParams('/doc/product/scope/save', [product, item, standard, method, serviceGroup, measUnit], 'product', 'item', 'standard', 'method', 'serviceGroup', 'measUnit');
  fetchData(url, {
    body: JSON.stringify(data)
  }).then(
    (receipt) => {
      dispatch(productScopeSaveSuccess(receipt.data));
    }, (error) => {console.log(error)}
  )
}

// 检测范围 删除
export const productScopeDel = () => ({
  type: PRODUCT_SCOPE_DELETE
});
export const productScopeDelSuccess = (del) => ({
  type: PRODUCT_SCOPE_DELETE_SUCCESS,
  del,
});
export const delProductScope = (ids) => (dispatch, getState) => {
  dispatch(productScopeDel());
  fetchData('/doc/product/scope/remove', {
    body: JSON.stringify(ids)
  }).then(
    (receipt) => {
      dispatch(productScopeDelSuccess(ids));
    }, (error) => {console.log(error)}
  )
}

// 检测范围 结果项 列表
// export const productSResultList = () => ({
//   type: PRODUCT_SCOPE_RESULT_LIST
// });
// export const productSResultListSuccess = (data) => ({
//   type: PRODUCT_SCOPE_RESULT_LIST_SUCCESS,
//   data
// });
// export const listProductSResult = (id) => (dispatch, state) => {
//   dispatch(productSResultList());
//   fetchData('/doc/product/scope/result/query?sid=' + id, {}).then(
//     (receipt) => {
//       dispatch(productSResultListSuccess(receipt.data));
//     },
//     (error) => {console.log(error)}
//   );
// };
// 列表 结果项 rows rowKeys
export const listProductSResultRows = (rows, rowKeys) => ({
  type: PRODUCT_SCOPE_RESULT_LIST_ROWS,
  rows,
  rowKeys
})

// 检测范围 结果项 新增
// export const productSResultSaveSuccess = (data) => ({
//   type: PRODUCT_SCOPE_RESULT_ADD_SUCCESS,
//   data
// });
// export const saveProductSResult = (data, product, item, standard, method, serviceGroup, measUnit) => (dispatch, state) => {
//   let url = spliceUrlByParams('/doc/product/scope/save', [product, item, standard, method, serviceGroup, measUnit], 'product', 'item', 'standard', 'method', 'serviceGroup', 'measUnit');
//   fetchData(url, {
//     body: JSON.stringify(data)
//   }).then(
//     (receipt) => {
//       dispatch(productSResultSaveSuccess(receipt.data));
//     }, (error) => {console.log(error)}
//   )
// }

// 检测范围 结果项 删除
export const productSResultDel = () => ({
  type: PRODUCT_SCOPE_RESULT_DELETE
});
export const productSResultDelSuccess = (del, productTestFlow) => ({
  type: PRODUCT_SCOPE_RESULT_DELETE_SUCCESS,
  del,
  productTestFlow,
});
export const delProductSResult = (ids, productTestFlow) => (dispatch, getState) => {
  dispatch(productSResultDel());
  fetchData('/doc/product/scope/result/remove', {
    body: JSON.stringify(ids)
  }).then(
    (receipt) => {
      dispatch(productSResultDelSuccess(ids, productTestFlow));
    }, (error) => {console.log(error)}
  )
}
// ===================================
// 检测范围新增检测项目
export const asyncAddTestFlowScopeStart = () => ({
  type: ASYNC_ADD_TESTFLOW_SCOPE_START
});
export const asyncAddTestFlowScopeSuccess = (data) => ({
  type: ASYNC_ADD_TESTFLOW_SCOPE_SUCCESS,
  data,
});
export const asyncAddTestFlowScope = (c, product, item, standard, method, serviceGroup, measUnit) => (dispatch, state) => {
  dispatch(asyncAddTestFlowScopeStart());
  let url = spliceUrlByParams('/doc/product/scope/save',[product,item,standard,method,serviceGroup,measUnit],'product','item','standard','method','serviceGroup','measUnit');
  let intOptions = {'key':'id'};
  fetchData(url, {
    body: JSON.stringify(c)
  }, fieldMapper(intOptions)).then(
    (receipt) => {
      dispatch(asyncAddTestFlowScopeSuccess(receipt.data));
    },
    (error) => {
      console.log(error);
    }
  );
}
// 检测范围编辑检测项目
export const asyncEditTestFlowScopeStart = () => ({
  type: ASYNC_EDIT_TESTFLOW_SCOPE_START
});
export const asyncEditTestFlowScopeSuccess = (data) => ({
  type: ASYNC_EDIT_TESTFLOW_SCOPE_SUCCESS,
  data,
});
export const asyncEditTestFlowScope = (c, product, item, standard, method, serviceGroup, measUnit) => (dispatch, state) => {
  dispatch(asyncEditTestFlowScopeStart());
  let url = spliceUrlByParams('/doc/product/scope/save',[product,item,standard,method,serviceGroup,measUnit],'product','item','standard','method','serviceGroup','measUnit');
  fetchData(url, {
    body: JSON.stringify(c)
  }).then(
    (receipt) => {
      dispatch(asyncEditTestFlowScopeSuccess(receipt.data));
    },
    (error) => {
      console.log(error);
    }
  );
}

// 查询可添加结果项
export const asyncQueryScopeRecordStart = () => ({
  type: ASYNC_QUERY_SCOPE_RECORD_START
});
export const asyncQueryScopeRecordSuccess = (data) => ({
  type: ASYNC_QUERY_SCOPE_RECORD_SUCCESS,
  data,
});
export const asyncQueryScopeRecord = (sid, tid) => (dispatch, state) => {
  dispatch(asyncQueryScopeRecordStart());
  let url = '/doc/product/scope/result/ref?sid=' + sid + '&iid=' + tid;
  fetchData(url, {}).then(
    (receipt) => {
      dispatch(asyncQueryScopeRecordSuccess(receipt.data));
    },
    (error) => {
      console.log(error);
    }
  );
}

// 新增结果项
export const asyncAddScopeRecordStart = () => ({
  type: ASYNC_ADD_SCOPE_RECORD_START
});
export const asyncAddScopeRecordSuccess = (data) => ({
  type: ASYNC_ADD_SCOPE_RECORD_SUCCESS,
  data,
});
export const asyncAddScopeRecord = (scope, recordIdArr) => (dispatch, state) => {
  dispatch(asyncAddScopeRecordStart());
  let url = '/doc/product/scope/result/add?scope=' + scope;
  fetchData(url, {
    body: JSON.stringify(recordIdArr)
  }).then(
    (receipt) => {
      dispatch(asyncAddScopeRecordSuccess(receipt.data));
    },
    (error) => {
      console.log(error);
    }
  );
}
// 编辑结果项
export const editScopeRecord = () => ({
  type: EDIT_SCOPE_RECORD
});
export const asyncEditScopeRecordStart = () => ({
  type: ASYNC_EDIT_SCOPE_RECORD_START
});
export const asyncEditScopeRecordSuccess = (data) => ({
  type: ASYNC_EDIT_SCOPE_RECORD_SUCCESS,
  data,
});
export const asyncEditScopeRecord = (values, pid, measureUnit, resultType, roundRule, resultsFile) => (dispatch, state) => {
  dispatch(asyncEditScopeRecordStart());
  let url = spliceUrlByParams('/doc/product/scope/result/update',[pid,measureUnit,resultType,roundRule,resultsFile],'id','measureUnit','resultType','roundRule','resultsFile');
  fetchData(url, {
    body: JSON.stringify(values)
  }).then(
    (receipt) => {
      dispatch(asyncEditScopeRecordSuccess(receipt.data));
    },
    (error) => {
      console.log(error);
    }
  );
}

// 弹框取消
export const productScopeCancel = () => ({
  type: PRODUCT_SCOPE_CANCEL
});


// 取消操作
export const cancelAddEdit = () => ({
  type: ADD_EDIT_CANCEL
});

export const cancelDeleteItems = () => ({
  type: PRODUCT_DELETE_CANCEL
});

export const cancelAddUnit = () => ({
  type: PROGRAM_ITEM_ADD_CANCEL
});
