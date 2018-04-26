import fetchData, {fieldMapper} from '../../../util/fetchGateway';

export const CATEGORY_MANAGEMENT_DATA_LOAD = 'CATEGORY_MANAGEMENT_DATA_LOAD';
export const CATEGORY_MANAGEMENT_DATA_LOAD_SUCCESS = 'CATEGORY_MANAGEMENT_DATA_LOAD_SUCCESS';

export const UNIT_DATA_LOAD = 'UNIT_DATA_LOAD';
export const UNIT_DATA_LOAD_SUCCESS = 'UNIT_DATA_LOAD_SUCCESS';
export const UNIT_ITEM_PREPARE = 'UNIT_ITEM_PREPARE';
export const UNIT_ITEM_ADD = 'UNIT_ITEM_ADD';
export const UNIT_ITEM_EDIT = 'UNIT_ITEM_EDIT';
export const UNIT_ITEM_SAVE = 'UNIT_ITEM_SAVE';
export const UNIT_ITEM_SAVE_SUCCESS = 'UNIT_ITEM_SAVE_SUCCESS';
export const UNIT_ITEM_DELETE_CONFIRM = 'UNIT_ITEM_DELETE_CONFIRM';
export const UNIT_ITEM_DELETE_SUCCESS = 'UNIT_ITEM_DELETE_SUCCESS';
export const UNIT_ITEM_CURRENT = 'UNIT_ITEM_CURRENT';

export const TRANSFORM_UNIT_ITEM_PREPARE = 'TRANSFORM_UNIT_ITEM_PREPARE';
export const TRANSFORM_UNIT_ITEM_ADD = 'TRANSFORM_UNIT_ITEM_ADD';
export const TRANSFORM_UNIT_ITEM_SAVE = 'TRANSFORM_UNIT_ITEM_SAVE';
export const TRANSFORM_UNIT_ITEM_SAVE_SUCCESS = 'TRANSFORM_UNIT_ITEM_SAVE_SUCCESS';
export const TRANSFORM_UNIT_ITEM_EDIT = 'TRANSFORM_UNIT_ITEM_EDIT';
export const TRANSFORM_UNIT_ITEM_EDIT_SAVE = 'TRANSFORM_UNIT_ITEM_EDIT_SAVE';
export const TRANSFORM_UNIT_ITEM_EDIT_SAVE_SUCCESS = 'TRANSFORM_UNIT_ITEM_EDIT_SAVE_SUCCESS';
export const TRANSFORM_UNIT_ITEM_DELETE_CONFIRM = 'TRANSFORM_UNIT_ITEM_DELETE_CONFIRM';
export const UNIT_ITEM_EDIT_CANCEL = 'UNIT_ITEM_EDIT_CANCEL';
export const TRANSFORM_UNIT_ITEM_DELETE_SUCCESS = 'TRANSFORM_UNIT_ITEM_DELETE_SUCCESS';
export const TRANSFORM_UNIT_ITEM_ADD_CANCEL = 'TRANSFORM_UNIT_ITEM_ADD_CANCEL';
export const TRANSFORM_UNIT_ITEM_EDIT_CANCEL = 'TRANSFORM_UNIT_ITEM_EDIT_CANCEL';
export const TRANSFORM_UNIT_ITEM_DELETE_CANCEL = 'TRANSFORM_UNIT_ITEM_DELETE_CANCEL';

// 加载可搜索树数据
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
      asyncSelectUnit(receipt.data.length > 0 ? [receipt.data[0].id] : [])(dispatch, state);
    },
    (error) => {console.log(error)}
  );
};

// 查询度量单位
export const selectUnit = () => ({
  type: UNIT_DATA_LOAD,
});

export const loadUnitDataSuccess = (receipt, selecctedUnitKey) => ({
  type: UNIT_DATA_LOAD_SUCCESS,
  receipt: receipt,
  selecctedUnitKey: selecctedUnitKey,
});

export const asyncSelectUnit = (selectedKeys, info) => (dispatch, state) => {
  if(!selectedKeys || !selectedKeys[0]) return;
  dispatch(selectUnit());
  let selectedUnitId = Number.parseInt(selectedKeys[0], 10);
  let intOptions = {'conversUnit':{'key':'id'}};
  fetchData('/doc/measunit/query/pid/' + selectedUnitId, {}, fieldMapper(intOptions)).then(
    (receipt) => {
      dispatch(loadUnitDataSuccess(receipt.data, selectedUnitId));
    },
    (error) => {console.log(error)}
  );
};

// 获取度量单位勾选节点
export const prepareUnit = (selectedRows, selectRowKeys) => ({
  type: UNIT_ITEM_PREPARE,
  preparedUnits: selectedRows,
  preparedKeys: selectRowKeys,
});

// 新增 + 编辑度量单位
export const addUnit = () => ({
  type: UNIT_ITEM_ADD
});

export const editUnit = () => ({
  type: UNIT_ITEM_EDIT
});

export const saveUnit = () => ({
  type: UNIT_ITEM_SAVE
});

export const saveUnitSuccess = (receipt) => ({
  type: UNIT_ITEM_SAVE_SUCCESS,
  receipt: receipt
});

export const asyncSaveUnit = (unitData, editType, selecctedUnitKey) => (dispatch, state) => {
  dispatch(saveUnit());
  let url = '';
  if(editType === '新增'){
    url = '/doc/measunit/save/add' + '?parentID=' + selecctedUnitKey;
  }else if(editType === '编辑'){
    url = '/doc/measunit/save/update' + '?parentID=' + selecctedUnitKey;
  }
  fetchData(url, {
    body: JSON.stringify([unitData])
  }).then(
    (receipt) => {
      dispatch(saveUnitSuccess(receipt.data));
    },
    (error) => {
      console.log(error);
    }
  )
}

// 删除度量单位
export const confirmDeleteUnits = () => ({
  type: UNIT_ITEM_DELETE_CONFIRM
});

export const deleteUnitsSuccess = (receipt) => ({
  type: UNIT_ITEM_DELETE_SUCCESS,
  removedIds: receipt
});

export const asyncDeleteUnits = (ids) => (dispatch, state) => {
  dispatch(confirmDeleteUnits());
  let url = '/doc/measunit/delete';
  fetchData(url, {
    body: JSON.stringify(ids)
  }).then(
    (receipt) => {
      dispatch(deleteUnitsSuccess(receipt));
    },
    (error) => {
      console.log(error);
    }
  )
}

// 获取度量单位点击节点
export const getCurrentUnit = (record) => ({
  type: UNIT_ITEM_CURRENT,
  currentUnit: record,
});

// 获取转换关系勾选项
export const preparedTransform = (selectedRows, selectedRowKeys) => ({
  type: TRANSFORM_UNIT_ITEM_PREPARE,
  preparedTransforms: selectedRows,
  preparedTransformKeys: selectedRowKeys,
});

// 新增转换关系
export const addTransformUnit = () => ({
  type: TRANSFORM_UNIT_ITEM_ADD
});

export const saveTransformUnit = () => ({
  type: TRANSFORM_UNIT_ITEM_SAVE
});

export const saveTransformUnitSuccess = (receipt) => ({
  type: TRANSFORM_UNIT_ITEM_SAVE_SUCCESS,
  receipt: receipt,
});

export const asyncSaveTransformUnit = (unitcode, typeid) => (dispatch, state) => {
  dispatch(saveTransformUnit());
  let url = '/doc/convers/queryandsave?'+ 'id=' + unitcode + '&pid=' + typeid;
  fetchData(url, {}).then(
    (receipt) => {
      dispatch(saveTransformUnitSuccess(receipt.data));
    },
    (error) => {
      console.log(error);
    }
  )
}

// 编辑转换关系
export const editTransformUnit = () => ({
  type: TRANSFORM_UNIT_ITEM_EDIT
});

export const editTransformUnitSave = () => ({
  type: TRANSFORM_UNIT_ITEM_EDIT_SAVE
});

export const editTransformUnitSuccess = (receipt, unitcode) => ({
  type: TRANSFORM_UNIT_ITEM_EDIT_SAVE_SUCCESS,
  receipt: receipt,
  unitcode: unitcode,
});

export const asyncEditTransformUnit = (ConversUnit, unitcode, objunitcode) => (dispatch, state) => {
  dispatch(editTransformUnitSave());
  let url = '/doc/convers/update'+ '?unitcode=' + unitcode + '&objunitcode=' + objunitcode;
  fetchData(url, {
    body: JSON.stringify(ConversUnit)
  }).then(
    (receipt) => {
      dispatch(editTransformUnitSuccess(receipt.data, unitcode));
    },
    (error) => {
      console.log(error);
    }
  )
}

// 删除转换关系
export const confirmDeleteTransforms = () => ({
  type: TRANSFORM_UNIT_ITEM_DELETE_CONFIRM
});

export const deleteTransformsSuccess = (receipt, unitcodes) => ({
  type: TRANSFORM_UNIT_ITEM_DELETE_SUCCESS,
  removedIds: receipt,
  unitCodes : unitcodes,
});

export const asyncDeleteTransforms = (ids, unitcodes) => (dispatch, state) => {
  dispatch(confirmDeleteTransforms());
  let url = '/doc/convers/delete';
  fetchData(url, {
    body: JSON.stringify(ids)
  }).then(
    (receipt) => {
      dispatch(deleteTransformsSuccess(receipt.data, unitcodes));
    },
    (error) => {
      console.log(error);
    }
  )
}

// 取消操作
export const cancelEditUnit = () => ({
  type: UNIT_ITEM_EDIT_CANCEL
});

export const cancelEditTransformUnit = () => ({
  type: TRANSFORM_UNIT_ITEM_EDIT_CANCEL
});

export const cancelAddUnit = () => ({
  type: TRANSFORM_UNIT_ITEM_ADD_CANCEL
});

export const cancelDeleteUnits = () => ({
  type: TRANSFORM_UNIT_ITEM_DELETE_CANCEL
});
