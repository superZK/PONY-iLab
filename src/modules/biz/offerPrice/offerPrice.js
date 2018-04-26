import {fromJS} from 'immutable';
import fetchData from '../../../util/fetchGateway';
import { findNodeById, replaceNodeById, spliceUrlByParams, AddKeyForData, removeNodeById } from '../../../util/treeUtils';

// 列表 调取数据
export const offerPriceList = (key, includeDisabled) => (dispatch, state) => {
  dispatch(actions.listOfferPriceStart());
  let url = spliceUrlByParams('/biz/offer/price/query', [key, includeDisabled], 'key', 'includeDisabled');
  fetchData(url, {}).then(
    (receipt) => {
      dispatch(actions.listOfferPriceSuccess(receipt.data));
    },
    (error) => {
      console.log(error);
    }
  )
}

// 新增、编辑  确认
const offerPriceAdd = (data, editType) => (dispatch, state) => {
  dispatch(actions.addOfferPriceStart());
  let url = '';
  if (editType === '新增') {
    url = '/biz/offer/price/save';
  } else if(editType === '编辑') {
    url = '';
  };
  fetchData(url, {
    body: JSON.stringify(data)
  }).then(
    (receipt) => {
      dispatch(actions.addOfferPriceSuccess(receipt.data));
    },
    (error) => {
      console.log(error);
    }
  )
}

// 删除
const offerPriceDelete = (ids) => (dispatch, state) => {
  dispatch(actions.deleteOfferPriceStart());
  fetchData('/biz/offer/price/remove', {
    body: JSON.stringify(ids)
  }).then(
    (receipt) => {
      dispatch(actions.deleteOfferPriceSuccess(receipt.data));
    },
    (error) => {
      console.log(error);
    }
  )
}

// 激活
export const offerPriceActive = (ids) => (dispatch, state) => {
  dispatch(actions.activeOfferPriceStart());
  fetchData('/biz/offer/price/active', {
    body: JSON.stringify(ids)
  }).then(
    (receipt) => {
      dispatch(actions.activeOfferPriceSuccess(receipt.data, ids))
    }, (error) => {
      console.log(error)
    }
  )
}

// 禁用
export const offerPriceUnActive = (ids) => (dispatch, state) => {
  dispatch(actions.unActiveOfferPriceStart())
  fetchData('/biz/offer/price/disable', {
    body: JSON.stringify(ids)
  }).then(
    (receipt) => {
      dispatch(actions.unActiveOfferPriceSuccess(receipt.data, ids))
    }, (error) => {
      console.log(error)
    }
  )
}

// 升版
export const offerPriceUpgrade = (id) => (dispatch, state) => {
  dispatch(actions.upgradeOfferPriceStart());
  fetchData('/biz/offer/price/upgrade?id=' + id, {}).then(
    (receipt) => {
      dispatch(actions.upgradeOfferPriceSuccess(receipt.data))
    }, (error) => {
      console.log(error)
    }
  )
}

// actions
export const actions = {
  // 列表 调取数据
  listOfferPriceStart: () => ({type: actionTypes.LIST_OFFERPRICE_START}),
  listOfferPriceSuccess: (data) => ({type: actionTypes.LIST_OFFERPRICE_SUCCESS, data}),
  offerPriceList,
  // 列表 rows rowkeys / 点击项
  listOfferPriceRows: (rows, rowKeys) => ({type: actionTypes.LIST_OFFERPRICE_ROWS, rows, rowKeys}),
  listOfferPriceClick: (click) => ({type: actionTypes.LIST_OFFERPRICE_CLICK, click}),
  // 新增
  addOfferPrice: () => ({type: actionTypes.ADD_OFFERPRICE}),
  addOfferPriceStart: () => ({type: actionTypes.ADD_OFFERPRICE_START}),
  addOfferPriceSuccess: (data) => ({type: actionTypes.ADD_OFFERPRICE_SUCCESS, data}),
  // 编辑 弹框
  editOfferPrice: () => ({type: actionTypes.EDIT_OFFERPRICE}),
  offerPriceAdd,
  // 删除
  deleteOfferPriceStart: () => ({type: actionTypes.DELETE_OFFERPRICE_START}),
  deleteOfferPriceSuccess: (ids) => ({type: actionTypes.DELETE_OFFERPRICE_SUCCESS, ids}),
  offerPriceDelete,
  // 激活 、 禁用
  activeOfferPriceStart: () => ({type: actionTypes.ACTIVE_OFFERPRICE_START}),
  activeOfferPriceSuccess: (data, ids) => ({type: actionTypes.ACTIVE_OFFERPRICE_SUCCESS, data, ids}),
  offerPriceActive,
  unActiveOfferPriceStart: () => ({type: actionTypes.UNACTIVE_OFFERPRICE_START}),
  unActiveOfferPriceSuccess: (data, ids) => ({type: actionTypes.UNACTIVE_OFFERPRICE_SUCCESS, data, ids}),
  offerPriceUnActive,
  // 升版
  upgradeOfferPrice: () => ({type: actionTypes.UPGRADE_OFFERPRICE}),
  upgradeOfferPriceStart: () => ({type: actionTypes.UPGRADE_OFFERPRICE_START}),
  upgradeOfferPriceSuccess: (id) => ({type: actionTypes.UPGRADE_OFFERPRICE_SUCCESS, id}),
  offerPriceUpgrade,
  // 取消操作
  cancelHandle: () => ({type: actionTypes.CANCEL_HANDLE}),
};

// action types
export const actionTypes = {
  // 列表 调取数据
  LIST_OFFERPRICE_START: 'LIST_OFFERPRICE_START',
  LIST_OFFERPRICE_SUCCESS: 'LIST_OFFERPRICE_SUCCESS',
  // 列表 rows rowkeys
  LIST_OFFERPRICE_ROWS: 'LIST_OFFERPRICE_ROWS',
  LIST_OFFERPRICE_CLICK: 'LIST_OFFERPRICE_CLICK',
  // 新增 编辑
  ADD_OFFERPRICE: 'ADD_OFFERPRICE',
  EDIT_OFFERPRICE: 'EDIT_OFFERPRICE',
  ADD_OFFERPRICE_START: 'ADD_OFFERPRICE_START',
  ADD_OFFERPRICE_SUCCESS: 'ADD_OFFERPRICE_SUCCESS',
  // 删除
  DELETE_OFFERPRICE_START: 'DELETE_OFFERPRICE_START',
  DELETE_OFFERPRICE_SUCCESS: 'DELETE_OFFERPRICE_SUCCESS',
  // 激活 、 禁用
  ACTIVE_OFFERPRICE_START: 'ACTIVE_OFFERPRICE_START',
  ACTIVE_OFFERPRICE_SUCCESS: 'ACTIVE_OFFERPRICE_SUCCESS',
  UNACTIVE_OFFERPRICE_START: 'UNACTIVE_OFFERPRICE_START',
  UNACTIVE_OFFERPRICE_SUCCESS: 'UNACTIVE_OFFERPRICE_SUCCESS',
  // 升版
  UPGRADE_OFFERPRICE: 'UPGRADE_OFFERPRICE',
  UPGRADE_OFFERPRICE_START: 'UPGRADE_OFFERPRICE_START',
  UPGRADE_OFFERPRICE_SUCCESS: 'UPGRADE_OFFERPRICE_SUCCESS',
  // 弹框返回
  CANCEL_HANDLE: 'CANCEL_HANDLE',
};

// reducers
const initialState = fromJS({
  isLoading: false,
  editType: '',
  offerPData: [],// 列表data
  rowsList: [],// 列表rows
  rowKeysList: [],// 列表rowKeys
  clickList: {},// 列表 点击项
});

export default (state = initialState, action = {}) => {
  switch ( action.type ){
    case actionTypes.LIST_OFFERPRICE_START:
    case actionTypes.DELETE_OFFERPRICE_START:
    case actionTypes.ACTIVE_OFFERPRICE_START:
    case actionTypes.UNACTIVE_OFFERPRICE_START:
    case actionTypes.ADD_OFFERPRICE_START:
    case actionTypes.UPGRADE_OFFERPRICE_START:
      return state.set('isLoading', true);
    // 列表 调取数据
    case actionTypes.LIST_OFFERPRICE_SUCCESS:
      return state.set('isLoading', false).set('offerPData', AddKeyForData(action.data));
    // 列表 rows rowkeys
    case actionTypes.LIST_OFFERPRICE_ROWS:
      return state.set('isLoading', false).set('rowsList', action.rows).set('rowKeysList', action.rowKeys);
    case actionTypes.LIST_OFFERPRICE_CLICK:
      return state.set('isLoading', false).set('clickList', action.click);
    // 新增 / 编辑
    case actionTypes.ADD_OFFERPRICE:
      return state.set('isLoading', true).set('editType', '新增');
    case actionTypes.EDIT_OFFERPRICE:
      return state.set('isLoading', true).set('editType', '编辑')
    case actionTypes.ADD_OFFERPRICE_SUCCESS:
      let et = state.get('editType');
      let addOfferData = action.data;
      let addOffer = state.get('offerPData');
      if (et === '新增') {
        if(addOfferData.length) {
          if (addOffer && addOffer.length > 0) {
            addOfferData.map(item => {
              return addOffer.push(item);
            })
          } else {
            addOffer = addOfferData;
          }
        };
      } else if (et === '编辑') {
        replaceNodeById(addOffer, 'id', addOfferData)
      }
      addOffer = AddKeyForData(addOffer);
      return state.set('isLoading', false).set('offerPData', addOffer).set('editType', '');
    // 删除
    case actionTypes.DELETE_OFFERPRICE_SUCCESS:
      if(action.code === '0') {
        removeNodeById(state.get('offerPData'), 'id', action.ids);
      }
      return state.set('isLoading', false).set('rowsList', []).set('rowKeysList', []).set('clickList', {});
    // 激活
    case actionTypes.ACTIVE_OFFERPRICE_SUCCESS:
      // console.log(findNodeById(state.get('offerPData'), 'id', null, action.ids));
      const idOffer = findNodeById(state.get('offerPData'), 'id', null, action.ids);
      replaceNodeById(state.get('offerPData'), 'id', idOffer);
      return state.set('isLoading', false).set('editType', '激活').set('rowsList', []).set('rowKeysList', []).set('clickList', {});
    // 禁用
    case actionTypes.UNACTIVE_OFFERPRICE_SUCCESS:
      replaceNodeById(state.get('offerPData'), 'id', action.id);
      return state.set('isLoading', false).set('editType', '禁用').set('rowsList', []).set('rowKeysList', []).set('clickList', {})
    // 升版
    case actionTypes.UPGRADE_OFFERPRICE:
      return state.set('isLoading', true).set('editType', '升级版本');
    case actionTypes.UPGRADE_OFFERPRICE_SUCCESS:
      return state.set('isLoading', false).set('editType', '').set('rowsList', []).set('rowKeysList', []).set('clickList', {})
    // 弹框返回
    case actionTypes.CANCEL_HANDLE:
      return state.set('isLoading', false).set('editType', '');
    default :
      return state;
  }
};
