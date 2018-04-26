import {fromJS} from 'immutable';
import {
  DEPT_MANAGEMENT_DATA_LOAD,
  DEPT_MANAGEMENT_DATA_LOAD_SUCCESS,//根据不同组织加载下属部门
  DEPT_MANAGEMENT_DATA_LOAD_FAIL,
  DEPT_MANAGEMENT_ITEM_SELECT,//获取可搜索树选中的节点
  DEPT_MANAGEMENT_DATA_ADD,//打开新增modal
  DEPT_MANAGEMENT_DATA_SAVE_START,
  DEPT_MANAGEMENT_DATA_SAVE_SUCCESS,//新增+编辑部门数据
  DEPT_MANAGEMENT_ITEM_PREPARE,//获取表格勾选项
  DEPT_MANAGEMENT_DATA_UPDATE,//打开编辑modal
  DEPT_MANAGEMENT_DATA_DELETE,//打开删除modal
  DEPT_MANAGEMENT_DATA_DELETE_START,
  DEPT_MANAGEMENT_DATA_DELETE_SUCCESS,//删除部门数据
  ADD_SUBORDINATE,//复制部门数据添加到树节点中
  CANCEL_HANDLE,//取消操作
} from '../../../action/org/dept/deptManagementAction';
import { findNodeById, replaceNodeById, removeNodeById } from '../../../util/treeUtils';

export default function DeptManagement(state = fromJS({
  isLoading: false,
  editType: '',
  deptTree: [],
  selectedDeptItem: {},
  preparedDepts: [],
  preparedKeys: [],
  modalTitle: '',
  modalInformation: '',
}), action){
  switch(action.type){
    case DEPT_MANAGEMENT_DATA_LOAD:
    case DEPT_MANAGEMENT_DATA_SAVE_START:
    case DEPT_MANAGEMENT_DATA_DELETE_START:
      return state.set('isLoading', true);
    case DEPT_MANAGEMENT_DATA_LOAD_SUCCESS :
      let deptData = action.deptData || [];
      let siteInfo = action.siteInfo;
      siteInfo.subordinate = deptData;
      return state.set('isLoading', false).set('deptTree', [siteInfo]).set('preparedDepts', []).set('selectedDeptItem',[siteInfo][0]);
    case ADD_SUBORDINATE:
      if(typeof(state.get('deptTree')[0].id) === 'number')
      state.get('deptTree')[0].id = 'site' + state.get('deptTree')[0].id;
      state.get('deptTree')[0].subordinate = state.get('deptTree')[0].deptList;
      return state.set('isLoading', false);
    case DEPT_MANAGEMENT_ITEM_SELECT :
      let selectedDeptItem = findNodeById(state.get('deptTree'), 'id', 'subordinate', action.selectedDeptId);
      return state.set('selectedDeptItem', selectedDeptItem ? selectedDeptItem : {}).set('preparedDepts', []);
    case DEPT_MANAGEMENT_DATA_ADD :
      return state.set('editType', '新增')
    case DEPT_MANAGEMENT_DATA_SAVE_SUCCESS:
      let saveDeptData = action.deptData || [];
      let editType = action.editType;
      if(editType === '新增'){
        let newDeptData = state.get('selectedDeptItem').subordinate.concat(saveDeptData);
        state.get('selectedDeptItem').subordinate = newDeptData;
        return state.set('isLoading', false).set('editType', '');
      }else if(editType === '编辑'){
        replaceNodeById(state.get('selectedDeptItem').subordinate, 'id', saveDeptData);
      }
      return state.set('isLoading', false).set('editType', '');
    case DEPT_MANAGEMENT_ITEM_PREPARE:
      return state.set('preparedDepts', action.preparedDepts).set('preparedKeys', action.preparedKeys);
    case CANCEL_HANDLE:
    case DEPT_MANAGEMENT_DATA_LOAD_FAIL:
      return state.set('editType', '').set('isLoading', false);
    case DEPT_MANAGEMENT_DATA_UPDATE:
      return state.set('editType', '编辑');
    case DEPT_MANAGEMENT_DATA_DELETE:
      return state.set('editType', 'delete').set('modalTitle', '删除部门').set('modalInformation', '确认删除该部门？');
    case DEPT_MANAGEMENT_DATA_DELETE_SUCCESS:
      let removeIds = action.removeIds;
      removeNodeById(state.get('selectedDeptItem').subordinate, 'id', removeIds);
      return state.set('editType', '').set('isLoading', false).set('preparedDepts', []);
    default :
      return state;
  }
}
