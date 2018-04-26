import {fromJS} from 'immutable'
import * as types from '../../../action/smp/sampling/ActionTypes'
import { findNodeById, replaceNodeById } from '../../../util/treeUtils';


// reducers
const initialState = fromJS({
  isLoading: false,
  editType: '',
  sampleListData: [],// 首页列表data
  sampleListRows: [],// 列表rows
  sampleListRowsKey: [],// 列表rowsKey
  sampleClick: {},// 列表点击项
});

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case types.SAMPLING_LIST_START:
    case types.SAMPLING_ITEM_SAVE:
    case types.ACTIVE_SAMPLING_START:
    case types.UNACTIVE_SAMPLING_START:
      return state.set('isLoading', true);
    // 列表展示
    case types.SAMPLING_LIST_SUCCESS:
      return state.set('isLoading', false).set('sampleListData', action.data);
    // 列表rows 和 rowKeys
    case types.SAMPLING_LIST_KEY:
      return state.set('isLoading', false).set('sampleListRows', action.rows).set('sampleListRowsKey', action.rowKeys).set('sampleClick', {});
    // 列表 点击 选中
    case types.SAMPLING_LIST_CLICK:
      return state.set('isLoading', false).set('sampleClick', action.record).set('sampleListRows', []).set('sampleListRowsKey', []);
    // 新增 / 编辑
    case types.SAMPLING_ITEM_ADD:
      return state.set('isLoading', true).set('editType', '新增');
    case types.SAMPLING_ITEM_EDIT:
      return state.set('isLoading', true).set('editType', '编辑');
    case types.SAMPLING_ITEM_SAVE_SUCCESS:
      let et = state.get('editType');
      let saveData = action.data;
      let result = [];
      if (et === '新增'){
        if((state.get('sampleListData') || []).length > 0) {
          result = state.get('sampleListData').concat(saveData)
        } else {
          (saveData || []).map(item => {
            return result.push(item)
          })
        }
      } else if (et === '编辑'){
        replaceNodeById(state.get('sampleListData'), 'id', saveData);
        result = state.get('sampleListData')
      }
      return state.set('isLoading', false).set('editType', '').set('sampleListData', result);
    // 激活
    case types.ACTIVE_SAMPLING_SUCCESS:
      (action.id || []).map(v => {
        let obj = findNodeById(state.get('sampleListData'), 'id', null, v);
        obj.available = true;
        return obj
      })
      return state.set('isLoading', false).set('editType', '激活')
    // 禁用
    case types.UNACTIVE_SAMPLING_SUCCESS:
      (action.id || []).map(v => {
        let obj = findNodeById(state.get('sampleListData'), 'id', null, v);
        obj.available = false;
        return obj
      })
      return state.set('isLoading', false).set('editType', '禁用');
    // 取消弹框
    case types.CANCEL_SAMPLING:
      return state.set('isLoading', false).set('editType', '')
    default:
      return state;
  }
}
