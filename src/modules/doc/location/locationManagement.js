import {fromJS} from 'immutable'
import * as types from '../../../action/document/location/ActionTypes'
import { findNodeById, replaceChildrenById, removeChildrenById } from '../../../util/treeUtils';


// reducers
const initialState = fromJS({
  isLoading: false,
  editType: '',
  locationTree: [],// 树列表
  selectedItem: {},// 选中列表树
  locationRows: [],// 列表rows
  locationRowsKey: [],//列表rowsKey
});

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case types.LOAD_LOCATION_START:
    case types.DELETE_LOCATION_START:
    case types.LOCATION_ADD_START:
      return state.set('isLoading', true);
    // 搜索树
    case types.LOAD_LOCATION_SUCCESS:
      let rootNode = action.siteInfo;
      rootNode.subordinate = action.data ? action.data : [];
      return state.set('isLoading', false).set('locationTree', [rootNode]).set('selectedItem', [rootNode][0]);
    // 搜索树选中项
    case types.LOCATION_ITEM_SELECT:
      let selectedItem = findNodeById(state.get('locationTree'), 'id', 'subordinate', action.selectedId);
      return state.set('selectedItem', selectedItem);
    // 列表rows 和 rowKeys
    case types.LOCATION_LIST_ROWS:
      return state.set('isLoading', false).set('locationRows', action.rows).set('locationRowsKey', action.rowsKey);
    // 新增 / 编辑
    case types.LOCATION_ADD:
      return state.set('isLoading', true).set('editType', '新增');
    case types.LOCATION_EDIT:
      return state.set('isLoading', true).set('editType', '编辑');
    case types.LOCATION_ADD_SUCCESS:
      let et = state.get('editType');
      let saveData = action.data || [];
      if (et === '新增'){
        state.get('selectedItem').subordinate = (state.get('selectedItem').subordinate) ? state.get('selectedItem').subordinate.concat(saveData) : saveData;
      } else if (et === '编辑'){
        replaceChildrenById(state.get('selectedItem'), 'id', 'subordinate', saveData);
      }
      return state.set('isLoading', false).set('editType', '')
    // 删除
    case types.DELETE_LOCATION_SUCCESS:
      if(action.code === '0') {
        removeChildrenById(state.get('selectedItem'), 'id', 'subordinate', action.ids);
      }
      return state.set('isLoading', false).set('locationRows', []).set('locationRowsKey', [])
    // 取消弹框
    case types.CANCEL_LOCATION:
      return state.set('isLoading', false).set('editType', '')
    default:
      return state;
  }
}
