import {fromJS} from 'immutable'
import * as types from '../../../action/document/qualification/ActionTypes'
import { replaceNodeById, removeNodeById } from '../../../util/treeUtils';


// reducers
const initialState = fromJS({
  isLoading: false,
  editType: '',
  temporaryStoredTitle: [],          // 暂存首页资质抬头搜索出来的数据
  qualifyData: [],                  // 资质数据
  selectRows: [],                   // 首页列表rows
  selectRowsKey: [],                // 首页列表rowsKey
  selectClick: {},                  // 首页列表点击项
  qualificationTitles: [],
  temporaryStoredTitleAdd: [],      // 添加资质时暂存搜索出的数据
  rowsAdd: [],                      // 添加资质时暂存列表Rows
  rowKeysAdd: [],                   // 添加资质时暂存列表RowKeys
  temporaryStoredTitleProduct: [],  // 关联产品时搜索出来的数据
  rowsConnect: [],                  // 关联产品时暂存列表Rows
  rowKeysConnect: [],               // 关联产品时暂存列表RowKeys
});

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case types.TEMPORARY_DEPOSIT_QUALIFICATION_TITLE_START:
    case types.DELETE_QUALIFICATION_START:
    case types.ADD_QUALIFICATION_TITLE_START:
    case types.ACTIVE_QUALIFICATION_START:
    case types.UNACTIVE_QUALIFICATION_START:
      return state.set('isLoading', true);
    // 暂存资质认证搜索抬头
    case types.TEMPORARY_DEPOSIT_QUALIFICATION_TITLE_SUCCESS:
      let temporaryStoredTitle = action.temporaryStoredTitle || [];
      return state.set('isLoading', false).set('temporaryStoredTitle', temporaryStoredTitle);
    // 首页列表的Key
    // 资质首页列表储存rows和rowKeys
    case types.QUALIFICATION_LIST_KEY:
      return state.set('selectRows', action.rows).set('selectRowsKey', action.rowKeys).set('selectClick', {})
    // 首页列表 点击项
    case types.QUALIFICATION_LIST_CLICK:
      return state.set('selectClick', action.record)
    // 新增检验资质
    case types.ADD_QUALIFICATION:
      return state.set('isLoading', true).set('editType', '新增资质');
    case types.ADD_QUALIFICATION_START:
      return state.set('isLoading', true).set('editType', '新增资质');
    case types.ADD_QUALIFICATION_SUCCESS:
      let contentAction = action.content || [];
      let temporaryTitle = state.get('temporaryStoredTitle');
      if (contentAction.length) {
       contentAction.map(item => {
         return temporaryTitle.push(item)
       })
     };
      return state.set('isLoading', false).set('editType', '').set('temporaryStoredTitle', temporaryTitle);
    // 新增资质时搜索抬头
    case types.ADD_QUALIFICATION_TITLE_SUCCESS:
      let temporaryStoredTitleAdd = action.temporaryStoredTitleAdd || [];
      return state.set('isLoading', false).set('temporaryStoredTitleAdd', temporaryStoredTitleAdd);
    // 新增资质时列表存储的key值
    case types.ADD_QUALIFICATION_KEY:
      let rows = action.rows;
      (rows.length > 0) && (rows[0].qualificationTypeId) ? (rows[0].qualificationTypeId + '') : '';
      return state.set('rowsAdd', action.rows).set('rowKeysAdd', action.rowKeys)
    // 编辑检验资质
    case types.EDIT_QUALIFICATION:
      return state.set('isLoading', true).set('editType', '编辑资质')
    case types.EDIT_QUALIFICATION_START:
      return state.set('isLoading', true).set('editType', '编辑资质')
    case types.EDIT_QUALIFICATION_SUCCESS:
      let contents = action.content || [];
      replaceNodeById(state.get('temporaryStoredTitle'), 'id', contents)
      return state.set('isLoading', false).set('editType', '').set('selectRows', []).set('selectRowsKey', []).set('selectClick', {});
    // 删除检验资质
    case types.DELETE_QUALIFICATION_SUCCESS:
      let removeAction = action.del;
      removeNodeById(state.get('temporaryStoredTitle'), 'id', removeAction);
      return state.set('isLoading', false).set('selectRows', []).set('selectRowsKey', []).set('selectClick', {})
    // 激活 / 禁用检验资质
    case types.ACTIVE_QUALIFICATION_SUCCESS:
      replaceNodeById(state.get('temporaryStoredTitle'), 'id', action.id);
      return state.set('isLoading', false).set('editType', '激活').set('selectRows', []).set('selectRowsKey', []).set('selectClick', {})
    case types.UNACTIVE_QUALIFICATION_SUCCESS:
      replaceNodeById(state.get('temporaryStoredTitle'), 'id', action.id);
      return state.set('isLoading', false).set('editType', '禁用').set('selectRows', []).set('selectRowsKey', []).set('selectClick', {})
    // 关联产品时搜索抬头
    case types.CONNECT_PRODUCT_QUALIFICATION_TITLE_SUCCESS:
      let product = action.product || [];
      return state.set('isLoading', false).set('temporaryStoredTitleProduct', product);
    // 关联产品
    case types.CONNECT_PRODUCT_QUALIFICATION:
    case types.CONNECT_PRODUCT_QUALIFICATION_TITLE_START:
      return state.set('isLoading', true).set('editType', '关联产品')
    case types.CONNECT_PRODUCT_QUALIFICATION_START:
      return state.set('isLoading', true).set('editType', '关联产品');
    case types.CONNECT_PRODUCT_QUALIFICATION_SUCCESS:
      let contentProduct = action.content || [];
      let temporaryTitles = state.get('temporaryStoredTitle');
      if (contentProduct.length) {
       contentProduct.map(item => {
         return temporaryTitles.push(item)
       })
     };
      return state.set('isLoading', false).set('editType', '').set('temporaryStoredTitle', temporaryTitles).set('selectRows', []).set('selectRowsKey', []).set('selectClick', {});
    // 关联产品时加载列表存储key值
    case types.CONNECT_QUALIFICATION_KEY:
      return state.set('rowsConnect', action.rows).set('rowKeysConnect', action.rowKeys);
    // 取消弹框
    case types.CANCEL_QUALIFICATION:
      return state.set('isLoading', false).set('editType', '')
    default:
      return state;
  }
}
