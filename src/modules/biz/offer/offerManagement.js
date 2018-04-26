import {fromJS} from 'immutable';
import fetchData from '../../../util/fetchGateway';
import { findNodeById, replaceNodeById, spliceUrlByParams, AddKeyForData, removeNodeById } from '../../../util/treeUtils';

// 列表 调取数据
export const offerList = (data) => (dispatch, state) => {
  dispatch(actions.listOfferStart());
  // let url = spliceUrlByParams('/biz/offer/price/query', [key, includeDisabled], 'key', 'includeDisabled');
  fetchData('/biz/offer/query', {
    body: JSON.stringify(data)
  }).then(
    (receipt) => {
      dispatch(actions.listOfferSuccess(receipt.data));
    },
    (error) => {
      console.log(error);
    }
  )
}

// 下面列表 调取数据
export const offerLists = (id) => (dispatch, state) => {
  dispatch(actions.listsOfferStart());
  fetchData('/biz/offer/?id=' + id, {}).then(
    (receipt) => {
      dispatch(actions.listsOfferSuccess(receipt.data));
    },
    (error) => {
      console.log(error);
    }
  )
}

// 新增、编辑  确认
const offerAdd = (data, editType) => (dispatch, state) => {
  dispatch(actions.addOfferStart());
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
      dispatch(actions.addOfferSuccess(receipt.data));
    },
    (error) => {
      console.log(error);
    }
  )
}

// 删除
const offerDelete = (ids) => (dispatch, state) => {
  dispatch(actions.deleteOfferStart());
  fetchData('/biz/offer/price/remove', {
    body: JSON.stringify(ids)
  }).then(
    (receipt) => {
      dispatch(actions.deleteOfferSuccess(receipt.data));
    },
    (error) => {
      console.log(error);
    }
  )
}

// addItem
export const offerAddItem = (ids) => (dispatch, state) => {
  dispatch(actions.activeOfferStart());
  fetchData('/biz/offer/price/active', {
    body: JSON.stringify(ids)
  }).then(
    (receipt) => {
      dispatch(actions.activeOfferSuccess(receipt.data, ids))
    }, (error) => {
      console.log(error)
    }
  )
}

// addItem query product
export const offerPAddItem = (data) => (dispatch, state) => {
  dispatch(actions.addItemOfferPStart());
  fetchData('/doc/product/query', {
    body: JSON.stringify(data)
  }).then(
    (receipt) => {
      dispatch(actions.addItemOfferPSuccess(receipt.data))
    }, (error) => {
      console.log(error)
    }
  )
}

// addItem 根据列表树 上级 查询列表 产品
export const offerPUpAddItem = (id) => (dispatch, state) => {
  dispatch(actions.addItemOfferPUpStart());
  fetchData('/biz/offer/price/scope?product=' + id, {}).then(
    (receipt) => {
      dispatch(actions.addItemOfferPUpSuccess(receipt.data))
    }, (error) => {
      console.log(error)
    }
  )
}
// addItem 根据列表树 子级 查询列表 方案
export const offerPDownAddItem = (id) => (dispatch, state) => {
  dispatch(actions.addItemOfferPDownStart());
  fetchData('/biz/offer/price/sict?productTest=' + id, {}).then(
    (receipt) => {
      dispatch(actions.addItemOfferPDownSuccess(receipt.data))
    }, (error) => {
      console.log(error)
    }
  )
}
// addItem product 新增报价单明细项
export const offerPSaveAddItem = (data) => (dispatch, state) => {
  dispatch(actions.addItemOfferPSaveStart());
  fetchData('/biz/offer/item/query', {
    body: JSON.stringify(data)
  }).then(
    (receipt) => {
      dispatch(actions.addItemOfferPSaveSuccess(receipt.data))
    }, (error) => {
      console.log(error)
    }
  )
}

// actions
export const actions = {
  // 列表 调取数据
  listOfferStart: () => ({type: actionTypes.LIST_OFFER_START}),
  listOfferSuccess: (data) => ({type: actionTypes.LIST_OFFER_SUCCESS, data}),
  offerList,
  // 列表 rows rowkeys / 点击项
  listOfferRows: (rows, rowKeys) => ({type: actionTypes.LIST_OFFER_ROWS, rows, rowKeys}),
  listOfferClick: (click) => ({type: actionTypes.LIST_OFFER_CLICK, click}),
  // 下面列表 调取数据
  listsOfferStart: () => ({type: actionTypes.LISTS_OFFER_START}),
  listsOfferSuccess: (data) => ({type: actionTypes.LISTS_OFFER_SUCCESS, data}),
  offerLists,
  // 新增
  addOffer: () => ({type: actionTypes.ADD_OFFER}),
  addOfferStart: () => ({type: actionTypes.ADD_OFFER_START}),
  addOfferSuccess: (data) => ({type: actionTypes.ADD_OFFER_SUCCESS, data}),
  // 编辑 弹框
  editOffer: () => ({type: actionTypes.EDIT_OFFER}),
  offerAdd,
  // 删除
  deleteOfferStart: () => ({type: actionTypes.DELETE_OFFER_START}),
  deleteOfferSuccess: (ids) => ({type: actionTypes.DELETE_OFFER_SUCCESS, ids}),
  offerDelete,
  // addItem
  addItemOffer: () => ({type: actionTypes.ADDITEM_OFFER}),
  addItemOfferStart: () => ({type: actionTypes.ADDITEM_OFFER_START}),
  addItemOfferSuccess: (id) => ({type: actionTypes.ADDITEM_OFFER_SUCCESS, id}),
  offerAddItem,
  // addItem query product
  addItemOfferPStart: () => ({type: actionTypes.ADDITEM_OFFER_PRODUCT_START}),
  addItemOfferPSuccess: (data) => ({type: actionTypes.ADDITEM_OFFER_PRODUCT_SUCCESS, data}),
  offerPAddItem,
  // addItem 根据列表树 上级 查询列表
  addItemOfferPUpStart: () => ({type: actionTypes.ADDITEM_OFFER_PRODUCT_UP_START}),
  addItemOfferPUpSuccess: (data) => ({type: actionTypes.ADDITEM_OFFER_PRODUCT_UP_SUCCESS, data}),
  offerPUpAddItem,
  // addItem 根据列表树 子级 查询列表
  addItemOfferPDownStart: () => ({type: actionTypes.ADDITEM_OFFER_PRODUCT_DOWN_START}),
  addItemOfferPDownSuccess: (data) => ({type: actionTypes.ADDITEM_OFFER_PRODUCT_DOWN_SUCCESS, data}),
  offerPDownAddItem,
  // addItem product 新增报价单明细项
  addItemOfferPSaveStart: () => ({type: actionTypes.ADDITEM_OFFER_PRODUCT_SAVE_START}),
  addItemOfferPSaveSuccess: (data) => ({type: actionTypes.ADDITEM_OFFER_PRODUCT_SAVE_SUCCESS, data}),
  offerPSaveAddItem,
  // addItem product 列表rows,rowKeys
  offerPSaveRowsItem: (rows, rowKeys) => ({type: actionTypes.ADDITEM_OFFER_PRODUCT_ROWS, rows, rowKeys}),
  // 取消操作
  cancelHandle: () => ({type: actionTypes.CANCEL_HANDLE}),
  cancelHandleType: () => ({type: actionTypes.CANCEL_HANDLE_TYPE}),
};

// action types
export const actionTypes = {
  // 列表 调取数据
  LIST_OFFER_START: 'LIST_OFFER_START',
  LIST_OFFER_SUCCESS: 'LIST_OFFER_SUCCESS',
  // 列表 rows rowkeys
  LIST_OFFER_ROWS: 'LIST_OFFER_ROWS',
  LIST_OFFER_CLICK: 'LIST_OFFER_CLICK',
  // 下面列表 调取数据
  LISTS_OFFER_START: 'LISTS_OFFER_START',
  LISTS_OFFER_SUCCESS: 'LISTS_OFFER_SUCCESS',
  // 新增 编辑
  ADD_OFFER: 'ADD_OFFER',
  EDIT_OFFER: 'EDIT_OFFER',
  ADD_OFFER_START: 'ADD_OFFER_START',
  ADD_OFFER_SUCCESS: 'ADD_OFFER_SUCCESS',
  // 删除
  DELETE_OFFER_START: 'DELETE_OFFER_START',
  DELETE_OFFER_SUCCESS: 'DELETE_OFFER_SUCCESS',
  // addItem
  ADDITEM_OFFER: 'ADDITEM_OFFER',
  ADDITEM_OFFER_START: 'ADDITEM_OFFER_START',
  ADDITEM_OFFER_SUCCESS: 'ADDITEM_OFFER_SUCCESS',
  // addItem query product
  ADDITEM_OFFER_PRODUCT_START: 'ADDITEM_OFFER_PRODUCT_START',
  ADDITEM_OFFER_PRODUCT_SUCCESS: 'ADDITEM_OFFER_PRODUCT_SUCCESS',
  // addItem 根据列表树 上级 查询列表
  ADDITEM_OFFER_PRODUCT_UP_START: 'ADDITEM_OFFER_PRODUCT_UP_START',
  ADDITEM_OFFER_PRODUCT_UP_SUCCESS: 'ADDITEM_OFFER_PRODUCT_UP_SUCCESS',
  // addItem 根据列表树 子级 查询列表
  ADDITEM_OFFER_PRODUCT_DOWN_START: 'ADDITEM_OFFER_PRODUCT_DOWN_START',
  ADDITEM_OFFER_PRODUCT_DOWN_SUCCESS: 'ADDITEM_OFFER_PRODUCT_DOWN_SUCCESS',
  // addItem product 新增报价单明细项
  ADDITEM_OFFER_PRODUCT_SAVE_START: 'ADDITEM_OFFER_PRODUCT_SAVE_START',
  ADDITEM_OFFER_PRODUCT_SAVE_SUCCESS: 'ADDITEM_OFFER_PRODUCT_SAVE_SUCCESS',
  // addItem product 列表rows,rowKeys
  ADDITEM_OFFER_PRODUCT_ROWS: 'ADDITEM_OFFER_PRODUCT_ROWS',
  // 弹框返回
  CANCEL_HANDLE: 'CANCEL_HANDLE',
  CANCEL_HANDLE_TYPE: 'CANCEL_HANDLE_TYPE',
};

// reducers
const initialState = fromJS({
  isLoading: false,
  editType: '',
  handleType: '',
  offerData: [],// 列表data
  rowsList: [],// 列表rows
  rowKeysList: [],// 列表rowKeys
  clickList: {},// 列表 点击项
  offerListData: [],// 下面列表 data
  addItemProduct: [],// addItem query product
  addItemUpProduct: [],// addItem 根据列表树 查询列表
  addItemSaveProduct: [],// addItem product 新增报价单明细项
  addItemRowsList: [],// addItem product 列表rows
  addItemRowKeysList: [],// addItem product 列表rowKeys
});

export default (state = initialState, action = {}) => {
  switch ( action.type ){
    case actionTypes.LIST_OFFER_START:
    case actionTypes.LISTS_OFFER_START:
    case actionTypes.DELETE_OFFER_START:
    case actionTypes.ADD_OFFER_START:
    case actionTypes.ADDITEM_OFFER_START:
    case actionTypes.ADDITEM_OFFER_PRODUCT_START:
    case actionTypes.ADDITEM_OFFER_PRODUCT_UP_START:
    case actionTypes.ADDITEM_OFFER_PRODUCT_DOWN_START:
    case actionTypes.ADDITEM_OFFER_PRODUCT_SAVE_START:
      return state.set('isLoading', true);
    // 列表 调取数据
    case actionTypes.LIST_OFFER_SUCCESS:
      return state.set('isLoading', false).set('offerData', AddKeyForData(action.data));
    // 列表 rows rowkeys
    case actionTypes.LIST_OFFER_ROWS:
      return state.set('isLoading', false).set('rowsList', action.rows).set('rowKeysList', action.rowKeys);
    case actionTypes.LIST_OFFER_CLICK:
      return state.set('isLoading', false).set('clickList', action.click);
    // 下面列表 调取数据
    case actionTypes.LISTS_OFFER_SUCCESS:
      return state.set('isLoading', false).set('offerListData', action.data)
    // 新增 / 编辑
    case actionTypes.ADD_OFFER:
      return state.set('isLoading', true).set('editType', '新增');
    case actionTypes.EDIT_OFFER:
      return state.set('isLoading', true).set('editType', '编辑')
    case actionTypes.ADD_OFFER_SUCCESS:
      let et = state.get('editType');
      let addOfferData = action.data;
      let addOffer = state.get('offerData');
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
      return state.set('isLoading', false).set('offerData', addOffer).set('editType', '');
    // 删除
    case actionTypes.DELETE_OFFER_SUCCESS:
      if(action.code === '0') {
        removeNodeById(state.get('offerData'), 'id', action.ids);
      }
      return state.set('isLoading', false).set('rowsList', []).set('rowKeysList', []).set('clickList', {});
    // addItem
    case actionTypes.ADDITEM_OFFER:
      return state.set('isLoading', true).set('handleType', '待选择项目');
    case actionTypes.ADDITEM_OFFER_SUCCESS:
      return state.set('isLoading', false).set('editType', '').set('rowsList', []).set('rowKeysList', []).set('clickList', {})
    // addItem query
    case actionTypes.ADDITEM_OFFER_PRODUCT_SUCCESS:
      return state.set('isLoading', false).set('addItemProduct', action.data)
    // addItem 根据列表树 上级 查询列表
    case actionTypes.ADDITEM_OFFER_PRODUCT_UP_SUCCESS:
      return state.set('isLoading', false).set('addItemUpProduct', AddKeyForData(action.data));
    // addItem 根据列表树 子级 查询列表
    case actionTypes.ADDITEM_OFFER_PRODUCT_DOWN_SUCCESS:
      return state.set('isLoading', false).set('addItemUpProduct', AddKeyForData(action.data));
    // addItem product 新增报价单明细项
    case actionTypes.ADDITEM_OFFER_PRODUCT_SAVE_SUCCESS:
      return state.set('isLoading', false).set('addItemSaveProduct', action.data).set('handleType', '');
    // addItem product 列表rows,rowKeys
    case actionTypes.ADDITEM_OFFER_PRODUCT_ROWS:
      return state.set('isLoading', false).set('addItemRowsList', action.rows).set('addItemRowKeysList', action.rowKeys)
    // 弹框返回
    case actionTypes.CANCEL_HANDLE:
      return state.set('isLoading', false).set('editType', '');
    // 双层弹框 返回
    case actionTypes.CANCEL_HANDLE_TYPE:
      return state.set('isLoading', false).set('handleType', '');
    default :
      return state;
  }
};
