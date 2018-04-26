import {fromJS} from 'immutable';
import {
  PRIVILEGE_GRANT_DATA_LOAD,
  PRIVILEGE_GRANT_GROUP_DATA_LOAD_SUCCESS,
  PRIVILEGE_GRANT_GROUP_SELECTED,
  PRIVILEGE_GRANT_PRIVILEGE_DATA_LOAD_SUCCESS,
  PRIVILEGE_GRANT_PRIVILEGE_SELECTED,
  PRIVILEGE_GRANT_PRIVILEGE_PREPARED,
  PRIVILEGE_GRANT_AUTHORIZATION_DATA_LOAD_SUCCESS,
  PRIVILEGE_GRANT_AUTHORIZATION_DATA_SAVE_SUCCESS,
  PRIVILEGE_GRANT_AUTHORIZATION_DATA_CANCEL,
  PRIVILEGE_GRANT_AUTHORIZATION_REVOKE_SUCCESS,
} from '../../../action/auth/group/privilegeGrantAction';

export default function PrivilegeGrant(state = fromJS({
  isLoading: false,
  groupData: [],
  privilegeData: [],
  selectedPrivilegeKey: '',
  preparedPrivileges: [],
  authorizationData: [],
  isEditing: false,
}), action){
  switch(action.type){
    case PRIVILEGE_GRANT_DATA_LOAD:
      return state.set('isLoading', true);
    case PRIVILEGE_GRANT_GROUP_DATA_LOAD_SUCCESS:
      return state.set('isLoading', false)
        .set('groupData', action.groupData);
    case PRIVILEGE_GRANT_PRIVILEGE_DATA_LOAD_SUCCESS:
      return state.set('isLoading', false)
        .set('privilegeData', action.privilegeData);
    case PRIVILEGE_GRANT_GROUP_SELECTED:
      return state.set('isLoading', true);
    case PRIVILEGE_GRANT_PRIVILEGE_SELECTED:
        return state.set('selectedPrivilegeKey', action.selectedPrivilegeKey);
    case PRIVILEGE_GRANT_PRIVILEGE_PREPARED:
      return state.set('preparedPrivileges', action.preparedPrivileges);
    case PRIVILEGE_GRANT_AUTHORIZATION_DATA_LOAD_SUCCESS:
      return state.set('isLoading', false).set('isEditing', true).set('authorizationData', action.authorizationData);
    case PRIVILEGE_GRANT_AUTHORIZATION_DATA_SAVE_SUCCESS:
      return state.set('isLoading', false).set('isEditing', false);
    case PRIVILEGE_GRANT_AUTHORIZATION_DATA_CANCEL:
      return state.set('isEditing', false);
    case PRIVILEGE_GRANT_AUTHORIZATION_REVOKE_SUCCESS:
      return state.set('isLoading', false);
    default :
      return state;
  }
}
