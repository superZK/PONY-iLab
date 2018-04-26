import {fromJS} from 'immutable'
import * as types from '../../../action/document/relation/ActionTypes'
import { removeNodeById } from '../../../util/treeUtils';


// reducers
const initialState = fromJS({
  isLoading: false,
  editType: '',
  selectedKeys: [],// 左侧树列表选中项
  deptTaskData: [],// 右侧列表数据
  rowsDeptTask: [],// 右侧列表rows
  rowKeysDeptTask: [],// 右侧列表rowKeys
  deptTaskTree: [],// 新增 列表树
  selectDeptTask: [],// 新增 选中搜索树节点
  dataDeptTask: [],// 新增 右侧列表data
  deptRows: [],// 新增 右侧列表rows
  deptRowKeys: [],// 新增 右侧列表rowKeys
});

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case types.DEPTTASKSCOPE_LIST_START:
    case types.DEPTTASKSCOPE_ADD_LOAD:
    case types.DEPTTASKSCOPE_LIST_ADD_START:
    case types.DELETE_DEPTTASKSCOPE_START:
      return state.set('isLoading', true);
    // 右侧列表数据
    case types.DEPTTASKSCOPE_LIST_SUCCESS:
      return state.set('isLoading', false).set('deptTaskData', action.data).set('selectedKeys', action.key);
    // 右侧列表 rows rowKeys
    case types.DEPTTASKSCOPE_LIST_ROWS:
      return state.set('isLoading', false).set('rowsDeptTask', action.rows).set('rowKeysDeptTask', action.rowsKey);
    // 新增
    case types.DEPTTASKSCOPE_ADD:
    case types.DEPTTASKSCOPE_ADD_START:
      return state.set('isLoading', true).set('editType', '新增');
    case types.DEPTTASKSCOPE_ADD_SUCCESS:
      let deptDataS = action.data || [];
      let deptTaskTitle = state.get('deptTaskData');// 首页 右侧列表数据
      let deptListData = state.get('dataDeptTask');// 新增 右侧列表树 数据
      if (deptDataS.length) {
       deptDataS.map(item => {
         deptTaskTitle.unshift(item)
         // 为了删除已新增过的数据
         for(let i=0; i<deptListData.length; i++){
           if(deptListData[i].id === item.id) {
             deptListData.splice(i, 1)
           }
         }
       })
      }
      return state.set('isLoading', false).set('editType', '').set('deptTaskData', deptTaskTitle).set('dataDeptTask', deptListData)
    // 新增 左侧列表树
    case types.DEPTTASKSCOPE_ADD_LOAD_SUCCESS:
      let rootNode = action.categoryInfo;
      rootNode.subordinate = action.categoryData;
      return state.set('isLoading', false).set('deptTaskTree', [rootNode]).set('selectDeptTask', rootNode.subordinate && rootNode.subordinate.length > 0 ? rootNode.subordinate[0].id : []);
    // 新增 右侧列表
    case types.DEPTTASKSCOPE_LIST_ADD_SUCCESS:
      return state.set('isLoading', false).set('dataDeptTask', action.data ? action.data : {}).set('selectDeptTask', action.key)
    // 新增 右侧列表 rows rowKeys
    case types.DEPTTASKSCOPE_LIST_ADD_ROW:
      return state.set('isLoading', false).set('deptRows', action.rows).set('deptRowKeys', action.rowsKey);
    // 删除检验资质
    case types.DELETE_DEPTTASKSCOPE_SUCCESS:
      if(action.code === '0') {
        removeNodeById(state.get('deptTaskData'), 'id', action.ids);
      }
      return state.set('isLoading', false).set('rowsDeptTask', []).set('rowKeysDeptTask', [])
    // 取消弹框
    case types.CANCEL_DEPTTASKSCOPE:
      return state.set('isLoading', false).set('editType', '')
    default:
      return state;
  }
}
