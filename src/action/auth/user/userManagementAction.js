import fetchData from '../../../util/fetchGateway';
import { spliceUrlByParams } from '../../../util/treeUtils';
import { message } from 'antd';

export const GROUP_MANAGEMENT_DATA_LOAD = 'GROUP_MANAGEMENT_DATA_LOAD';
export const GROUP_MANAGEMENT_DATA_LOAD_SUCCESS = 'GROUP_MANAGEMENT_DATA_LOAD_SUCCESS';
export const GROUP_MANAGEMENT_ITEM_SELECT = 'GROUP_MANAGEMENT_ITEM_SELECT';
export const USER_MANAGEMENT_DATA_LOAD = 'USER_MANAGEMENT_DATA_LOAD';
export const USER_MANAGEMENT_DATA_LOAD_SUCCESS = 'USER_MANAGEMENT_DATA_LOAD_SUCCESS';
export const USER_MANAGEMENT_DATA_ADD = 'USER_MANAGEMENT_DATA_ADD';
export const USER_MANAGEMENT_DATA_SAVE_START = 'USER_MANAGEMENT_DATA_SAVE_START';
export const USER_MANAGEMENT_DATA_SAVE_SUCCESS = 'USER_MANAGEMENT_DATA_SAVE_SUCCESS';
export const USER_MANAGEMENT_DATA_LINK_GROUP = 'USER_MANAGEMENT_DATA_LINK_GROUP';
export const USER_MANAGEMENT_DATA_LINK_GROUP_START = 'USER_MANAGEMENT_DATA_LINK_GROUP_START';
export const USER_MANAGEMENT_DATA_LINK_GROUP_SUCCESS = 'USER_MANAGEMENT_DATA_LINK_GROUP_SUCCESS';
export const USER_MANAGEMENT_DATA_DISCONNECT_GROUP_START = 'USER_MANAGEMENT_DATA_DISCONNECT_GROUP_START';
export const USER_MANAGEMENT_DATA_DISCONNECT_GROUP_SUCCESS = 'USER_MANAGEMENT_DATA_DISCONNECT_GROUP_SUCCESS';
export const USER_MANAGEMENT_ITEM_PREPARE = 'USER_MANAGEMENT_ITEM_PREPARE';
export const USER_MANAGEMENT_DATA_UPDATE = 'USER_MANAGEMENT_DATA_UPDATE';
export const USER_MANAGEMENT_DATA_FORBID = 'USER_MANAGEMENT_DATA_FORBID';
export const USER_MANAGEMENT_DATA_ALLOW = 'USER_MANAGEMENT_DATA_ALLOW';
export const USER_MANAGEMENT_DATA_ALLOW_FORBID_START = 'USER_MANAGEMENT_DATA_ALLOW_FORBID_START';
export const USER_MANAGEMENT_DATA_ALLOW_FORBID_SUCCESS = 'USER_MANAGEMENT_DATA_ALLOW_FORBID_SUCCESS';
export const USER_MANAGEMENT_DATA_DISABLE = 'USER_MANAGEMENT_DATA_DISABLE';
export const USER_MANAGEMENT_DATA_ACTIVE = 'USER_MANAGEMENT_DATA_ACTIVE';
export const USER_MANAGEMENT_DATA_DISABLE_START = 'USER_MANAGEMENT_DATA_DISABLE_START';
export const USER_MANAGEMENT_DATA_DISABLE_SUCCESS = 'USER_MANAGEMENT_DATA_DISABLE_SUCCESS';
export const ASYNC_MODIFY_PWS_START = 'ASYNC_MODIFY_PWS_START';
export const ASYNC_MODIFY_PWS_SUCCESS = 'ASYNC_MODIFY_PWS_SUCCESS';
export const CANCEL_HANDLE = 'CANCEL_HANDLE';

// 加载用户组数据
export const loadData = () => ({
  type : GROUP_MANAGEMENT_DATA_LOAD
});

export const loadDataSuccess = (groupInfo, groupData) => ({
  type: GROUP_MANAGEMENT_DATA_LOAD_SUCCESS,
  groupData: groupData,
  groupInfo: groupInfo
});

export const asyncLoadGroupData = (type, name) => (dispatch, state) => {
  dispatch(loadData());
  fetchData('/doc/categories/type/' + type, {}).then(
    (receipt) => {
      dispatch(loadDataSuccess({
        id: 0,
        code: 'R'+type,
        name: name,
        shorthand: '',
        type: type
      }, receipt.data));
    },
    (error) => {console.log(error)}
  );
};

// 用户组树节点选取
export const getSelectGroup = (selectedKeys) => ({
  type: GROUP_MANAGEMENT_ITEM_SELECT,
  selectedGroupId: selectedKeys[0],
});

export const handleGroupSelect = (siteId, deptId, selectedKeys, searchValue) => (dispatch, state) => {
  dispatch(getSelectGroup(selectedKeys));
  // 根据所选节点查询用户
  asyncLoadUser(siteId, deptId, selectedKeys, searchValue)(dispatch, state);
};

// 用户查询接口，可根据组织、部门、用户姓名，账户名，电话，邮件等条件进行查询
export const loadUser = () => ({
  type: USER_MANAGEMENT_DATA_LOAD
});

export const loadUserSuccess = (userData, groupId) => ({
  type: USER_MANAGEMENT_DATA_LOAD_SUCCESS,
  userData: userData,
  groupId: groupId,
});

export const asyncLoadUser = (siteId, deptId, groupId, searchValue) => (dispatch, state) => {
  dispatch(loadUser());
  let url = spliceUrlByParams('/auth/user/query',[siteId, deptId, groupId, searchValue],'siteId', 'deptId', 'groupId', 'searchValue');
  fetchData(url, {}).then(
    (receipt) => {
      dispatch(loadUserSuccess(receipt.data, groupId));
    },
    (error) => { console.log(error) }
  );
};

// 新增或编辑用户数据
export const addUser = () => ({
  type : USER_MANAGEMENT_DATA_ADD
});

export const editUser = () => ({
  type : USER_MANAGEMENT_DATA_UPDATE
});

export const saveUserStart = () => ({
  type: USER_MANAGEMENT_DATA_SAVE_START
});

export const saveUserSuccess = (receipt, editType) => ({
  type: USER_MANAGEMENT_DATA_SAVE_SUCCESS,
  userDate: receipt,
  editType: editType,
});

// 新增或编辑后，执行一遍查询接口，所以将搜索区内的组织与部门select组件选择的组织与部门id传入
export const asyncSaveUser = (userDate, editType, formSiteId, formDeptId, selectSiteId, selectDeptId, groupId ) => (dispatch, state) => {
  dispatch(saveUserStart());
  let url = '';
  if(editType === '新增'){
    url = spliceUrlByParams('/auth/user/add',[formSiteId, formDeptId],'siteId', 'deptId');
  }else if(editType === '编辑'){
    url = spliceUrlByParams('/auth/user/update',[formSiteId, formDeptId],'siteId', 'deptId');
  }
  fetchData(url, {
    body: JSON.stringify(userDate)
  }).then(
    (receipt) => {
      dispatch(saveUserSuccess(receipt.data, editType));
      if(editType === '新增'){
        message.success('成功添加新用户');
        if(groupId ==='undefined' || groupId[0] === '0'){
          asyncLoadUser(selectSiteId, selectDeptId)(dispatch, state);
        }
      }
    },
    (error) => {
      console.log(error);
    }
  )
}

// 关联用户组
export const LinkGroup = () => ({
  type : USER_MANAGEMENT_DATA_LINK_GROUP
});

export const linkGroupStart = () => ({
  type: USER_MANAGEMENT_DATA_LINK_GROUP_START
});

export const linkGroupSuccess = (receipt) => ({
  type: USER_MANAGEMENT_DATA_LINK_GROUP_SUCCESS,
  newUser: receipt,
});

export const asyncLinkUserToGroup = (siteId, deptId, groupId, users) => (dispatch, state) => {
  dispatch(linkGroupStart());
  let url = '/auth/user/group/addContact?groupId=' + groupId;
  fetchData(url, {
    body: JSON.stringify(users)
  }).then(
    (receipt) => {
      dispatch(linkGroupSuccess(receipt.data));
      asyncLoadUser(siteId, deptId, groupId)(dispatch, state);
    },
    (error) => {
      console.log(error);
    }
  )
}

// 解除关联
export const disconnectGroupStart = () => ({
  type: USER_MANAGEMENT_DATA_DISCONNECT_GROUP_START
});

export const disconnectGroupSuccess = (removeIds) => ({
  type: USER_MANAGEMENT_DATA_DISCONNECT_GROUP_SUCCESS,
  removeIds: removeIds,
});

export const DisconnectGroup = (group, userIds) => (dispatch, state) => {
  dispatch(disconnectGroupStart());
  let url = '/auth/user/group/removeContact?gid=' + group.id;
  fetchData(url, {
    body: JSON.stringify(userIds)
  }).then(
    (receipt) => {
      dispatch(disconnectGroupSuccess(userIds));
    },
    (error) => {
      console.log(error);
    }
  )
}

// 获取表格勾选项
export const preparedUser = (selectedItems, selectedItemKeys) => ({
  type: USER_MANAGEMENT_ITEM_PREPARE,
  preparedUsers: selectedItems,
  preparedKeys: selectedItemKeys
});

// 锁定或激活用户
export const allowUser = () => ({
  type: USER_MANAGEMENT_DATA_ALLOW
});

export const forbidUser = () => ({
  type: USER_MANAGEMENT_DATA_FORBID
});

export const allowForbidStart = () => ({
  type: USER_MANAGEMENT_DATA_ALLOW_FORBID_START
});

export const allowForbidSuccess = (receipt) => ({
  type: USER_MANAGEMENT_DATA_ALLOW_FORBID_SUCCESS,
  newUser: receipt,
});

export const asyncAllowForbid = (forbidUser) => (dispatch, state) => {
  dispatch(allowForbidStart());
  let url = '/auth/user/update/forbid';
  fetchData(url, {
    body: JSON.stringify(forbidUser)
  }).then(
    (receipt) => {
      dispatch(allowForbidSuccess(receipt.data));
    },
    (error) => {
      console.log(error);
    }
  )
}

// 禁用用户
export const disableUser = () => ({
  type: USER_MANAGEMENT_DATA_DISABLE
});

export const activeUser = () => ({
  type: USER_MANAGEMENT_DATA_ACTIVE
});

export const disableUserStart = () => ({
  type: USER_MANAGEMENT_DATA_DISABLE_START
});

export const disableUserSuccess = (receipt) => ({
  type: USER_MANAGEMENT_DATA_DISABLE_SUCCESS,
  newUser: receipt,
});

export const asyncDisable = (Id) => (dispatch, state) => {
  dispatch(disableUserStart());
  let url = '/auth/user/update/disable?id=' + Id;
  fetchData(url, {}).then(
    (receipt) => {
      dispatch(disableUserSuccess(receipt.data));
    },
    (error) => {
      console.log(error);
    }
  )
}

// 重置密码
export const asyncModifyPwsStart = () => ({
  type: ASYNC_MODIFY_PWS_START
});

export const asyncModifyPwsSuccess = () => ({
  type: ASYNC_MODIFY_PWS_SUCCESS,
});

export const asyncModifyPws = (uid) => (dispatch, state) => {
  dispatch(asyncModifyPwsStart());
  let url = '/auth/user/super/updatePwd?uid=' + uid;
  fetchData(url, {}).then(
    (receipt) => {
      dispatch(asyncModifyPwsSuccess());
      if(receipt.code === '0')
        message.success('密码初始化成功');
    },
    (error) => {
      console.log(error);
    }
  )
}

// 取消操作，关闭Modal
export const cancelHandle = () => ({
  type: CANCEL_HANDLE
});

