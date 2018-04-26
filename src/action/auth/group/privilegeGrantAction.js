import fetchData, { spliceURL } from '../../../util/fetchGateway';

export const PRIVILEGE_GRANT_DATA_LOAD = 'PRIVILEGE_GRANT_DATA_LOAD';
export const PRIVILEGE_GRANT_GROUP_DATA_LOAD_SUCCESS = 'PRIVILEGE_GRANT_GROUP_DATA_LOAD_SUCCESS';
export const PRIVILEGE_GRANT_PRIVILEGE_DATA_LOAD_SUCCESS = 'PRIVILEGE_GRANT_PRIVILEGE_DATA_LOAD_SUCCESS';
export const PRIVILEGE_GRANT_AUTHORIZATION_DATA_LOAD_SUCCESS = 'PRIVILEGE_GRANT_AUTHORIZATION_DATA_LOAD_SUCCESS';
export const PRIVILEGE_GRANT_AUTHORIZATION_DATA_SAVE_SUCCESS = 'PRIVILEGE_GRANT_AUTHORIZATION_DATA_SAVE_SUCCESS';
export const PRIVILEGE_GRANT_AUTHORIZATION_DATA_CANCEL = 'PRIVILEGE_GRANT_AUTHORIZATION_DATA_CANCEL';
export const PRIVILEGE_GRANT_AUTHORIZATION_REVOKE_SUCCESS = 'PRIVILEGE_GRANT_AUTHORIZATION_REVOKE_SUCCESS';

export const PRIVILEGE_GRANT_GROUP_SELECTED = 'PRIVILEGE_GRANT_GROUP_SELECTED';
export const PRIVILEGE_GRANT_PRIVILEGE_SELECTED = 'PRIVILEGE_GRANT_PRIVILEGE_SELECTED';
export const PRIVILEGE_GRANT_PRIVILEGE_PREPARED = 'PRIVILEGE_GRANT_PRIVILEGE_PREPARED';


export const selectPrivilege = (selectedKey) => ({
  type: PRIVILEGE_GRANT_PRIVILEGE_SELECTED,
  selectedPrivilegeKey: Number.parseInt(selectedKey, 10)
});

export const preparePrivilege = (preparedPrivileges) => ({
  type: PRIVILEGE_GRANT_GROUP_SELECTED,
  preparedPrivileges
});

const loadData = () => ({
  type : PRIVILEGE_GRANT_DATA_LOAD
});

export const asyncLoadGroupData = (type, name) => (dispatch, state) => {
  dispatch(loadData());
  fetchData('/doc/categories/type/' + type, {}).then(
    (receipt) => {
      let node = [{
        id: 0,
        code: 'R'+type,
        name: name,
        shorthand: '',
        type: type,
        subordinate: receipt.data
      }];
      dispatch(loadGroupDataSuccess(node));
    },
    (error) => {console.log(error)}
  );
};

const loadGroupDataSuccess = (groupData) => ({
  type : PRIVILEGE_GRANT_GROUP_DATA_LOAD_SUCCESS,
  groupData
});

export const asyncSelectGroup = (groupId, privilegeType) => (dispatch, state) => {
  if(!groupId || !privilegeType) return;
  dispatch(loadData());
  let url = spliceURL('/auth/entry/query/auth', {id: groupId, type: privilegeType});
  fetchData(url, {}).then(
    (receipt) => {
      dispatch(loadPrivilegeDataSuccess(receipt.data));
    },
    (error) => {console.log(error)}
  );
};

const loadPrivilegeDataSuccess = (privilegeData) => ({
  type : PRIVILEGE_GRANT_PRIVILEGE_DATA_LOAD_SUCCESS,
  privilegeData
});

export const asyncLoadAuthData = (groupId, privilegeType) => (dispatch, state) => {
  if(!groupId || !privilegeType) return;
  dispatch(loadData());
  let url = spliceURL('/auth/entry/query/unauth', {id: groupId, type: privilegeType});
  fetchData(url, {}).then(
    (receipt) => {
      dispatch(loadAuthDataSuccess(receipt.data));
    },
    (error) => {console.log(error)}
  );
}

const loadAuthDataSuccess = (authorizationData) => ({
  type : PRIVILEGE_GRANT_AUTHORIZATION_DATA_LOAD_SUCCESS,
  authorizationData
});

export const asyncComfirmAuthDataSave = (groupId, privilegeType, privilegeKeys) => (dispatch, state) => {
  if(groupId == 0){
    dispatch(cancelAuthDataSave());
    return;
  } 
  dispatch(loadData());
  let url = spliceURL('/auth/entry/authorize', {groupId: groupId, type: privilegeType});
  fetchData(url, {body: JSON.stringify(privilegeKeys)}).then(
    (receipt) => {
      dispatch(confirmAuthDataSaveSuccess());
      asyncSelectGroup(groupId, privilegeType)(dispatch, state);
    },
    (error) => {console.log(error)}
  );
}

const confirmAuthDataSaveSuccess = () => ({
  type: PRIVILEGE_GRANT_AUTHORIZATION_DATA_SAVE_SUCCESS,
})

export const cancelAuthDataSave = () => ({
  type : PRIVILEGE_GRANT_AUTHORIZATION_DATA_CANCEL
});

export const asyncRevokeAuthData = (groupId, privilegeType, privilegeKeys) => (dispatch, state) => {
  if(groupId == 0){
    dispatch(cancelAuthDataSave());
    return;
  } 
  dispatch(loadData());
  let url = spliceURL('/auth/entry/revoke', {groupId: groupId, type: privilegeType});
  fetchData(url, {body: JSON.stringify(privilegeKeys)}).then(
    (receipt) => {
      dispatch(revokeAuthDataSuccess());
      asyncSelectGroup(groupId, privilegeType)(dispatch, state);
    },
    (error) => {console.log(error)}
  );
}

const revokeAuthDataSuccess = () => ({
  type : PRIVILEGE_GRANT_AUTHORIZATION_REVOKE_SUCCESS,
});
