import {fromJS} from 'immutable'
import fetchData from '../../../util/fetchGateway';
import { findNodeById, replaceNodeById, spliceUrlByParams, AddKeyForData } from '../../../util/treeUtils';

// 上面列表 调取数据
export const storeList = (val) => (dispatch, state) => {
  dispatch(actions.listStoreStart());
  let url = '/mat/info/query?key=' + val;
  fetchData(url, {}).then(
    (receipt) => {
      dispatch(actions.listStoreSuccess(receipt.data));
    },
    (error) => {
      console.log(error);
    }
  )
}

// 入库过列表 调取数据
export const storeMaterialList = () => (dispatch, state) => {
  dispatch(actions.storeMaterialListStart());
  let url = '';
  fetchData(url, {}).then(
    (receipt) => {
      dispatch(actions.storeMaterialListSuccess(receipt.data));
    },
    (error) => {
      console.log(error);
    }
  )
}

// 物料领用
export const storeReceive = (data, storeId, deptId, userId) => (dispatch, state) => {
  dispatch(actions.receiveStoreStart());
  let url = spliceUrlByParams('/mat/distribute/dist', [storeId, deptId, userId], 'storeId', 'deptId', 'userId');
  fetchData(url, {
    body: JSON.stringify(data)
  }).then(
    (receipt) => {
      dispatch(actions.receiveStoreSuccess(receipt.data));
    },
    (error) => {
      console.log(error);
    }
  )
}

// 物料归还
export const storeReturn = (data) => (dispatch, state) => {
  dispatch(actions.returnStoreStart());
  let url = '';
  fetchData(url, {
    body: JSON.stringify(data)
  }).then(
    (receipt) => {
      dispatch(actions.returnStoreSuccess(receipt.data));
    },
    (error) => {
      console.log(error);
    }
  )
}

// 采购单查询
export const storeOrder = (data) => (dispatch, state) => {
  dispatch(actions.orderStoreStart());
  let url = '';
  fetchData(url, {
    body: JSON.stringify(data)
  }).then(
    (receipt) => {
      dispatch(actions.orderStoreSuccess(receipt.data));
    },
    (error) => {
      console.log(error);
    }
  )
}

// 物料台账
export const storeStandingBook = (data) => (dispatch, state) => {
  dispatch(actions.standingBookStoreStart());
  let url = '';
  fetchData(url, {
    body: JSON.stringify(data)
  }).then(
    (receipt) => {
      dispatch(actions.standingBookStoreSuccess(receipt.data));
    },
    (error) => {
      console.log(error);
    }
  )
}

// actions
export const actions = {
  // 列表 调取数据
  listStoreStart: () => ({type: actionTypes.LIST_STORE_START}),
  listStoreSuccess: (data) => ({type: actionTypes.LIST_STORE_SUCCESS, data}),
  storeList,
  // 列表 点击项
  listStoreClick: (click) => ({type: actionTypes.LIST_STORE_CLICK, click}),
  // 入库过列表 调取数据
  storeMaterialListStart: () => ({type: actionTypes.LIST_STOREMATERIAL_START}),
  storeMaterialListSuccess: (data) => ({type: actionTypes.LIST_STOREMATERIAL_SUCCESS, data}),
  storeMaterialList,
  // 下面列表 点击项
  storeMaterialListClick: (click) => ({type: actionTypes.LIST_STOREMATERIAL_CLICK, click}),
  // 物料领用
  receiveStoreHandle: () => ({type: actionTypes.RECEIVE_STORE_HANDLE}),
  receiveStoreStart: () => ({type: actionTypes.RECEIVE_STORE_START}),
  receiveStoreSuccess: (data) => ({type: actionTypes.RECEIVE_STORE_SUCCESS, data}),
  storeReceive,
  // 物料归还
  returnStoreHandle: () => ({type: actionTypes.RETURN_STORE_HANDLE}),
  returnStoreStart: () => ({type: actionTypes.RETURN_STORE_START}),
  returnStoreSuccess: (data) => ({type: actionTypes.RETURN_STORE_SUCCESS, data}),
  storeReturn,
  // 采购单查询
  orderStoreHandle: () => ({type: actionTypes.ORDER_STORE_HANDLE}),
  orderStoreStart: () => ({type: actionTypes.ORDER_STORE_START}),
  orderStoreSuccess: (data) => ({type: actionTypes.ORDER_STORE_SUCCESS, data}),
  storeOrder,
  // 物料台帐
  standingBookStoreHandle: () => ({type: actionTypes.STANDING_BOOK_STORE_HANDLE}),
  standingBookStoreStart: () => ({type: actionTypes.STANDING_BOOK_STORE_START}),
  standingBookStoreSuccess: (data) => ({type: actionTypes.STANDING_BOOK_STORE_SUCCESS, data}),
  storeStandingBook,
  // 取消操作
  cancelHandle: () => ({type: actionTypes.CANCEL_HANDLE}),
};

// action types
export const actionTypes = {
  // 列表数据 调取
  LIST_STORE_START: 'LIST_STORE_START',
  LIST_STORE_SUCCESS: 'LIST_STORE_SUCCESS',
  // 列表 点击项
  LIST_STORE_CLICK: 'LIST_STORE_CLICK',
  // 入库过列表 调取数据
  LIST_STOREMATERIAL_START: 'LIST_STOREMATERIAL_START',
  LIST_STOREMATERIAL_SUCCESS: 'LIST_STOREMATERIAL_SUCCESS',
  // 下面列表 点击项
  LIST_STOREMATERIAL_CLICK: 'LIST_STOREMATERIAL_CLICK',
  // 物料领用
  RECEIVE_STORE_HANDLE: 'RECEIVE_STORE_HANDLE',
  RECEIVE_STORE_START: 'RECEIVE_STORE_START',
  RECEIVE_STORE_SUCCESS: 'RECEIVE_STORE_SUCCESS',
  // 物料归还
  RETURN_STORE_HANDLE: 'RETURN_STORE_HANDLE',
  RETURN_STORE_START: 'RETURN_STORE_START',
  RETURN_STORE_SUCCESS: 'RETURN_STORE_SUCCESS',
  // 采购单查询
  ORDER_STORE_HANDLE: 'ORDER_STORE_HANDLE',
  ORDER_STORE_START: 'ORDER_STORE_START',
  ORDER_STORE_SUCCESS: 'ORDER_STORE_SUCCESS',
  // 物料台帐
  STANDING_BOOK_STORE_HANDLE: 'STANDING_BOOK_STORE_HANDLE',
  STANDING_BOOK_STORE_START: 'STANDING_BOOK_STORE_START',
  STANDING_BOOK_STORE_SUCCESS: 'STANDING_BOOK_STORE_SUCCESS',
  // 弹框返回
  CANCEL_HANDLE: 'CANCEL_HANDLE',
};

// reducers
const initialState = fromJS({
  isLoading: false,
  editType: '',
  storeData: [],// 列表数据
  storeClick: {},// 列表选中项
  storeMaterialData: [],// 入库过列表 调取数据
  storesClick: {},// 下面列表 选中项
});

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case actionTypes.LIST_STORE_START:
    case actionTypes.SAVE_STORE_START:
    case actionTypes.LIST_STOREMATERIAL_START:
      return state.set('isLoading', true);
    // 列表展示
    case actionTypes.LIST_STORE_SUCCESS:
      return state.set('isLoading', false).set('storeData', AddKeyForData(action.data));
    // 列表 点击 选中
    case actionTypes.LIST_STORE_CLICK:
      return state.set('isLoading', false).set('storeClick', action.click);
    // 下面列表 数据
    case actionTypes.LIST_STOREMATERIAL_SUCCESS:
      const clickData = state.get('storeClick');
      return state.set('isLoading', false).set('storeMaterialData', action.data);
    // 下面列表 选中项
    case actionTypes.LIST_STOREMATERIAL_CLICK:
      return state.set('isLoading', false).set('storesClick', action.click);
    // 物料领用
    case actionTypes.RECEIVE_STORE_HANDLE:  //弹框
    case actionTypes.RECEIVE_STORE_START:
      return state.set('isLoading', true).set('editType', '物料领用')
    case actionTypes.RECEIVE_STORE_SUCCESS:
      return state.set('isLoading', false).set('editType', '')
    // 物料归还
    case actionTypes.RETURN_STORE_HANDLE:  //弹框
    case actionTypes.RETURN_STORE_START:
      return state.set('isLoading', true).set('editType', '物料归还')
    case actionTypes.RETURN_STORE_SUCCESS:
      return state.set('isLoading', false).set('editType', '')
    // 采购单
    case actionTypes.ORDER_STORE_HANDLE:  //弹框
    case actionTypes.ORDER_STORE_START:
      return state.set('isLoading', true).set('editType', '采购单')
    case actionTypes.ORDER_STORE_SUCCESS:
      return state.set('isLoading', false).set('editType', '')
    // 物料台帐
    case actionTypes.STANDING_BOOK_STORE_HANDLE:  //弹框
    case actionTypes.STANDING_BOOK_STORE_START:
      return state.set('isLoading', true).set('editType', '物料台帐')
    case actionTypes.STANDING_BOOK_STORE_SUCCESS:
      return state.set('isLoading', false).set('editType', '')
    // 取消弹框
    case actionTypes.CANCEL_HANDLE:
      return state.set('isLoading', false).set('editType', '')
    default:
      return state;
  }
}
