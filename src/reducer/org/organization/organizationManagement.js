import {fromJS} from 'immutable';
import {
  ORGANIZATION_MANAGEMENT_DATA_LOAD,
  ORGANIZATION_MANAGEMENT_DATA_LOAD_SUCCESS,//加载数据
  ORGANIZATION_MANAGEMENT_DATA_ADD,//打开新增modal
  ORGANIZATION_MANAGEMENT_DATA_SAVE_START,
  ORGANIZATION_MANAGEMENT_DATA_SAVE_SUCCESS,//新增组织数据
  ORGANIZATION_MANAGEMENT_DATA_PREPARE,//获取表格勾选项
  ORGANIZATION_MANAGEMENT_DATA_UPDATE,//打开编辑modal
  ORGANIZATION_MANAGEMENT_DATA_DELETE,//打开删除modal
  ORGANIZATION_MANAGEMENT_DATA_DELETE_START,
  ORGANIZATION_MANAGEMENT_DATA_DELETE_SUCCESS,//删除组织数据
  CANCEL_HANDLE,//取消操作，关闭modal
} from '../../../action/org/organization/organizationManagementAction';
import { replaceNodeById, removeNodeById } from '../../../util/treeUtils';

export default function OrganizationManagement(state = fromJS({
  isLoading: false,
  editType: '',
  organizationData: [],
  preparedOrgs: [],
  preparedKeys: [],
  modalTitle: '',
  modalInformation: '',
}), action){
  switch(action.type){
    case ORGANIZATION_MANAGEMENT_DATA_LOAD:
    case ORGANIZATION_MANAGEMENT_DATA_SAVE_START:
    case ORGANIZATION_MANAGEMENT_DATA_DELETE_START:
      return state.set('isLoading', true);
    case ORGANIZATION_MANAGEMENT_DATA_LOAD_SUCCESS:
      let orgData = action.orgData || [];
      return state.set('isLoading', false).set('organizationData', orgData).set('preparedOrgs', []);
    case ORGANIZATION_MANAGEMENT_DATA_ADD:
      return state.set('editType', '新增');
    case ORGANIZATION_MANAGEMENT_DATA_SAVE_SUCCESS:
      let saveOrgData = action.orgData || [];
      let editType = action.editType;
      if(editType === '新增'){
        let newOrgData = state.get('organizationData').concat(saveOrgData);
        return state.set('isLoading', false).set('editType', '').set('organizationData', newOrgData);
      }else if(editType === '编辑'){
        replaceNodeById(state.get('organizationData'), 'id', saveOrgData);
      }
      return state.set('isLoading', false).set('editType', '');
    case ORGANIZATION_MANAGEMENT_DATA_PREPARE:
      let preparedOrgs = action.preparedOrgs;
      return state.set('preparedOrgs', preparedOrgs).set('preparedKeys', action.preparedKeys);
    case ORGANIZATION_MANAGEMENT_DATA_UPDATE:
      return state.set('editType', '编辑');
    case ORGANIZATION_MANAGEMENT_DATA_DELETE:
      return state.set('editType', 'delete').set('modalTitle', '删除组织结构').set('modalInformation', '确认删除所选组织结构信息？');
    case ORGANIZATION_MANAGEMENT_DATA_DELETE_SUCCESS:
      let removeIds = action.removeIds;
      removeNodeById(state.get('organizationData'), 'id', removeIds);
      return state.set('editType', '').set('isLoading', false).set('preparedOrgs', []);
    case CANCEL_HANDLE:
      return state.set('editType', '').set('isLoading', false);
    default :
      return state;
  }
}
