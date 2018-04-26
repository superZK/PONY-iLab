import {fromJS} from 'immutable'
import fetchData from '../../../util/fetchGateway';
import { findNodeById, replaceNodeById, spliceUrlByParams, AddKeyForData } from '../../../util/treeUtils';

// 上面列表 调取数据
export const materialList = (val) => (dispatch, state) => {
  dispatch(actions.listMaterialStart());
  let url = '/mat/info/query?key=' + val;
  fetchData(url, {}).then(
    (receipt) => {
      dispatch(actions.listMaterialSuccess(receipt.data));
    },
    (error) => {
      console.log(error);
    }
  )
}

// 试剂入库、标准物质入库 确认
const materialSave = (data, infoId, locationId, unitId, number, quality) => (dispatch, state) => {
  dispatch(actions.saveMaterialStart());
  let url = spliceUrlByParams('/mat/store/save', [infoId, locationId, unitId, number, quality], 'infoId', 'locationId', 'unitId', 'number', 'quality');
  fetchData(url, {
    body: JSON.stringify(data)
  }).then(
    (receipt) => {
      dispatch(actions.saveMaterialSuccess(receipt.data));
    },
    (error) => {
      console.log(error);
    }
  )
}

// 入库过列表 调取数据
export const materialSaveList = () => (dispatch, state) => {
  dispatch(actions.listSaveMaterialStart());
  let url = '';
  fetchData(url, {}).then(
    (receipt) => {
      dispatch(actions.listSaveMaterialSuccess(receipt.data));
    },
    (error) => {
      console.log(error);
    }
  )
}

// actions
export const actions = {
  // 列表 调取数据
  listMaterialStart: () => ({type: actionTypes.LIST_MATERIAL_START}),
  listMaterialSuccess: (data) => ({type: actionTypes.LIST_MATERIAL_SUCCESS, data}),
  materialList,
  // 列表 点击项
  listMaterialClick: (click) => ({type: actionTypes.LIST_MATERIAL_CLICK, click}),
  // 执行入库 确认
  saveMaterialStart: () => ({type: actionTypes.SAVE_MATERIAL_START}),
  saveMaterialSuccess: (data) => ({type: actionTypes.SAVE_MATERIAL_SUCCESS, data}),
  materialSave,
  // 入库过列表 调取数据
  listSaveMaterialStart: () => ({type: actionTypes.LIST_SAVE_MATERIAL_START}),
  listSaveMaterialSuccess: (data) => ({type: actionTypes.LIST_SAVE_MATERIAL_SUCCESS, data}),
  materialSaveList,
  // 取消操作
  cancelHandle: () => ({type: actionTypes.CANCEL_HANDLE}),
};

// action types
export const actionTypes = {
  // 列表数据 调取
  LIST_MATERIAL_START: 'LIST_MATERIAL_START',
  LIST_MATERIAL_SUCCESS: 'LIST_MATERIAL_SUCCESS',
  // 列表 点击项
  LIST_MATERIAL_CLICK: 'LIST_MATERIAL_CLICK',
  // 执行入库 确认
  SAVE_MATERIAL_START: 'SAVE_MATERIAL_START',
  SAVE_MATERIAL_SUCCESS: 'SAVE_MATERIAL_SUCCESS',
  // 入库过列表 调取数据
  LIST_SAVE_MATERIAL_START: 'LIST_SAVE_MATERIAL_START',
  LIST_SAVE_MATERIAL_SUCCESS: 'LIST_SAVE_MATERIAL_SUCCESS',
  // 弹框返回
  CANCEL_HANDLE: 'CANCEL_HANDLE',
};

// reducers
const initialState = fromJS({
  isLoading: false,
  editType: '',
  materialData: [],// 列表数据
  materialClick: {},// 列表选中项
  saveListMaterial: [],// 入库过列表 调取数据
});

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case actionTypes.LIST_MATERIAL_START:
    case actionTypes.SAVE_MATERIAL_START:
    case actionTypes.LIST_SAVE_MATERIAL_START:
      return state.set('isLoading', true);
    // 列表展示
    case actionTypes.LIST_MATERIAL_SUCCESS:
      return state.set('isLoading', false).set('materialData', AddKeyForData(action.data));
    // 列表 点击 选中
    case actionTypes.LIST_MATERIAL_CLICK:
      return state.set('isLoading', false).set('materialClick', action.click);
    // 执行入库 确认
    case actionTypes.SAVE_MATERIAL_SUCCESS:
      let dataSaveM = action.data;
      let saveData = state.get('materialClick').stores;
      if (dataSaveM.length > 0) {
        if(saveData && saveData.length > 0) {
          dataSaveM.map(item => {
            return saveData.push(item);
          })
        } else {
          return saveData = dataSaveM;
        }
      };
      saveData = AddKeyForData(saveData);
      return state.set('isLoading', false).set(state.get('materialClick').stores, saveData);
    // 入库过列表 调取数据
    // case actionTypes.LIST_SAVE_g', false).set('materialClick', action.data);
    // 取消弹框
    case actionTypes.CANCEL_HANDLE:
      return state.set('isLoading', false).set('editType', '')
    default:
      return state;
  }
}
