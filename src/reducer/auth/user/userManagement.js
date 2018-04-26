import {fromJS} from 'immutable';
import {
  GROUP_MANAGEMENT_DATA_LOAD,//用户组数据加载
  GROUP_MANAGEMENT_DATA_LOAD_SUCCESS,
  GROUP_MANAGEMENT_ITEM_SELECT,
  USER_MANAGEMENT_DATA_LOAD,// 用户查询
  USER_MANAGEMENT_DATA_LOAD_SUCCESS,
  USER_MANAGEMENT_DATA_ADD,//打开新增modal
  USER_MANAGEMENT_DATA_SAVE_START,
  USER_MANAGEMENT_DATA_SAVE_SUCCESS,//新增+编辑用户数据
  USER_MANAGEMENT_DATA_LINK_GROUP,//打开关联modal
  USER_MANAGEMENT_DATA_LINK_GROUP_START,
  USER_MANAGEMENT_DATA_LINK_GROUP_SUCCESS,//用户批量关联用户组
  USER_MANAGEMENT_DATA_DISCONNECT_GROUP_START,
  USER_MANAGEMENT_DATA_DISCONNECT_GROUP_SUCCESS,//用户批量解除关联用户组
  USER_MANAGEMENT_ITEM_PREPARE,//获取表格勾选项
  USER_MANAGEMENT_DATA_UPDATE,//打开编辑modal
  USER_MANAGEMENT_DATA_DELETE,//打开删除modal
  USER_MANAGEMENT_DATA_FORBID,//打开锁定modal
  USER_MANAGEMENT_DATA_ALLOW,//打开解除锁定modal
  USER_MANAGEMENT_DATA_ALLOW_FORBID_START,
  USER_MANAGEMENT_DATA_ALLOW_FORBID_SUCCESS,//锁定或激活用户
  USER_MANAGEMENT_DATA_DISABLE,//打开禁用modal
  USER_MANAGEMENT_DATA_ACTIVE,//打开激活modal
  USER_MANAGEMENT_DATA_DISABLE_START,
  USER_MANAGEMENT_DATA_DISABLE_SUCCESS,//用户禁用与激活
  ASYNC_MODIFY_PWS_START,
  ASYNC_MODIFY_PWS_SUCCESS,//重置密码
  CANCEL_HANDLE,//取消操作
} from '../../../action/auth/user/userManagementAction';
import { findNodeById, replaceNodeById, removeNodeById } from '../../../util/treeUtils';

export default function UserManagement(state = fromJS({
  isLoading: false,
  editType: '',
  modalTitle: '',
  modalInformation: '',
  userData:[],
  groupData:[],
  selectedGruop:{},
  preparedUsers:[],
  preparedKeys:[],
}), action){
  switch(action.type){
    case USER_MANAGEMENT_DATA_LOAD:
    case GROUP_MANAGEMENT_DATA_LOAD:
    case USER_MANAGEMENT_DATA_SAVE_START:
    case USER_MANAGEMENT_DATA_ALLOW_FORBID_START:
    case USER_MANAGEMENT_DATA_DISABLE_START:
    case USER_MANAGEMENT_DATA_LINK_GROUP_START:
    case ASYNC_MODIFY_PWS_START:
      return state.set('isLoading', true);
    case USER_MANAGEMENT_DATA_DISCONNECT_GROUP_START:
      return state.set('isLoading', true);
    case GROUP_MANAGEMENT_DATA_LOAD_SUCCESS :
      let rootNode = action.groupInfo;
      rootNode.subordinate = action.groupData ? action.groupData : [];
      return state.set('isLoading', false).set('groupData', [rootNode]).set('selectedGruop', {});
    case USER_MANAGEMENT_DATA_LOAD_SUCCESS:
      let userData = action.userData;
      let groupIds = action.groupId;
      return state.set('userData', userData).set('isLoading', false);
    case GROUP_MANAGEMENT_ITEM_SELECT:
      let currentGroup = findNodeById(state.get('groupData'), 'id', 'subordinate', action.selectedGroupId);
      return state.set('selectedGruop', currentGroup ? currentGroup : {});
    case USER_MANAGEMENT_DATA_ADD:
      return state.set('editType', '新增');
    case USER_MANAGEMENT_DATA_SAVE_SUCCESS:
      let saveUserData = action.userDate || [];
      let editType = action.editType;
      if(editType === '新增'){
        return state.set('isLoading', false).set('editType', '');
      }else if(editType === '编辑'){
        replaceNodeById(state.get('userData'), 'id', saveUserData);
      }
      return state.set('isLoading', false).set('editType', '').set('preparedUser', saveUserData);
    case USER_MANAGEMENT_DATA_LINK_GROUP:
      return state.set('editType', '关联用户组');
    case USER_MANAGEMENT_DATA_LINK_GROUP_SUCCESS:
      return state.set('isLoading', false).set('editType', '');
    case USER_MANAGEMENT_DATA_DISCONNECT_GROUP_SUCCESS:
      let removeIds = action.removeIds;
      let users = state.get('userData');
      removeNodeById(users, 'id', removeIds);
      return state.set('isLoading', false);
    case USER_MANAGEMENT_ITEM_PREPARE:
      return state.set('preparedUsers', action.preparedUsers).set('preparedKeys', action.preparedKeys);
    case USER_MANAGEMENT_DATA_UPDATE:
      return state.set('editType', '编辑');
    case USER_MANAGEMENT_DATA_FORBID:
      return state.set('editType', '锁定').set('isLoading', true).set('modalTitle', '用户锁定').set('modalInformation', '确定要锁定所选用户？');
    case USER_MANAGEMENT_DATA_ALLOW:
      return state.set('editType', '解除锁定').set('isLoading', true).set('modalTitle', '用户解除锁定').set('modalInformation', '确定要为所选用户解除锁定？');
    case USER_MANAGEMENT_DATA_ALLOW_FORBID_SUCCESS:
      let newUser = action.newUser;
      // 解决锁定按钮与解除锁定按钮禁用状态不切换的问题
      // let newPreparedUser = state.get('preparedUsers');
      // newPreparedUser[0].forbid = newUser[0].forbid;
      replaceNodeById(state.get('userData'), 'id', newUser);
      return state.set('editType', '').set('isLoading', false);
    case USER_MANAGEMENT_DATA_DISABLE:
      return state.set('editType', 'disable').set('isLoading', true).set('modalTitle', '用户禁用').set('modalInformation', '确定要禁用所选用户？');
    case USER_MANAGEMENT_DATA_ACTIVE:
      return state.set('editType', 'disable').set('isLoading', true).set('modalTitle', '用户激活').set('modalInformation', '确定要激活所选用户？');
    case USER_MANAGEMENT_DATA_DISABLE_SUCCESS:
      let disableUser = action.newUser;
      replaceNodeById(state.get('userData'), 'id', disableUser);
      return state.set('editType', '').set('isLoading', false);
    case CANCEL_HANDLE:
    case ASYNC_MODIFY_PWS_SUCCESS:
      return state.set('editType', '').set('isLoading', false);
    default :
      return state;
  }
}
