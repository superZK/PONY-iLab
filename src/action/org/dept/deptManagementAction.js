import fetchData, { idToKeyInterceptor } from '../../../util/fetchGateway';
import { spliceUrlByParams } from '../../../util/treeUtils';

export const DEPT_MANAGEMENT_DATA_LOAD = 'DEPT_MANAGEMENT_DATA_LOAD';
export const DEPT_MANAGEMENT_DATA_LOAD_SUCCESS = 'DEPT_MANAGEMENT_DATA_LOAD_SUCCESS';
export const DEPT_MANAGEMENT_DATA_LOAD_FAIL = 'DEPT_MANAGEMENT_DATA_LOAD_FAIL';
export const DEPT_MANAGEMENT_ITEM_SELECT = 'DEPT_MANAGEMENT_ITEM_SELECT';
export const DEPT_MANAGEMENT_DATA_ADD = 'DEPT_MANAGEMENT_DATA_ADD';
export const DEPT_MANAGEMENT_DATA_SAVE_START = 'DEPT_MANAGEMENT_DATA_SAVE_START';
export const DEPT_MANAGEMENT_DATA_SAVE_SUCCESS = 'DEPT_MANAGEMENT_DATA_SAVE_SUCCESS';
export const DEPT_MANAGEMENT_ITEM_PREPARE = 'DEPT_MANAGEMENT_ITEM_PREPARE';
export const DEPT_MANAGEMENT_DATA_UPDATE = 'DEPT_MANAGEMENT_DATA_UPDATE';
export const DEPT_MANAGEMENT_DATA_DELETE = 'DEPT_MANAGEMENT_DATA_DELETE';
export const DEPT_MANAGEMENT_DATA_DELETE_START = 'DEPT_MANAGEMENT_DATA_DELETE_START';
export const DEPT_MANAGEMENT_DATA_DELETE_SUCCESS = 'DEPT_MANAGEMENT_DATA_DELETE_SUCCESS';
export const ADD_SUBORDINATE = 'ADD_SUBORDINATE';
export const CANCEL_HANDLE = 'CANCEL_HANDLE';

//根据不同组织加载下属部门
export const loadDept = () => ({
  type: DEPT_MANAGEMENT_DATA_LOAD
});

export const loadDeptSuccess = (siteInfo, deptData) => ({
  type: DEPT_MANAGEMENT_DATA_LOAD_SUCCESS,
  siteInfo: siteInfo,
  deptData: deptData,
});

export const loadDeptFail = () => ({
  type: DEPT_MANAGEMENT_DATA_LOAD_FAIL,
});

export const asyncLoadDept = (id, name) => (dispatch, state) => {
  dispatch(loadDept());
  fetchData('/org/dept/query?pid=' + id, {}, idToKeyInterceptor).then(
    (receipt) => {
      dispatch(loadDeptSuccess({
        id:'site' + id,
        name:name
      }, receipt.data));
    },
    (error) => { dispatch(loadDeptFail()) }
  );
};

//复制部门数据添加到树节点中
export const addSubordinate = () => ({
  type: ADD_SUBORDINATE
});

// 获取可搜索树选中的节点
export const selectedDept = (selectedKeys) => ({
  type: DEPT_MANAGEMENT_ITEM_SELECT,
  selectedDeptId: selectedKeys[0]
});

// 新增+编辑组织数据
export const addDept = () => ({
  type : DEPT_MANAGEMENT_DATA_ADD
});

export const editDept = () => ({
  type : DEPT_MANAGEMENT_DATA_UPDATE
});

export const saveDeptStart = () => ({
  type: DEPT_MANAGEMENT_DATA_SAVE_START
});

export const saveDeptSuccess = (receipt, editType) => ({
  type: DEPT_MANAGEMENT_DATA_SAVE_SUCCESS,
  deptData: receipt,
  editType: editType,
});

export const asyncSaveDept = (deptDate, editType, parentDeptId, siteId, typeId, service_groupId) => (dispatch, state) => {
  dispatch(saveDeptStart());
  let url = '';
  if(editType === '新增'){
    url = spliceUrlByParams('/org/dept/add',[siteId, parentDeptId, typeId,service_groupId],'siteId', 'parentId', 'deptTypeId','serviceGroupId');
  }else if(editType === '编辑'){
    url = spliceUrlByParams('/org/dept/update',[siteId, parentDeptId, typeId, service_groupId],'siteId', 'parentId', 'deptTypeId', 'serviceGroupId');
  }
  fetchData(url, {
    body: JSON.stringify(deptDate)
  }).then(
    (receipt) => {
      dispatch(saveDeptSuccess(receipt.data, editType));
    },
    (error) => {
      console.log(error);
    }
  )
}

// 删除部门数据
export const deleteDept = () => ({
  type : DEPT_MANAGEMENT_DATA_DELETE
});

export const deleteDeptsStart = () => ({
  type: DEPT_MANAGEMENT_DATA_DELETE_START,
})

export const deleteDeptsSuccess = (receipt) => ({
  type: DEPT_MANAGEMENT_DATA_DELETE_SUCCESS,
  removeIds: receipt,
})

export const asyncDeleteDepts = (ids) => (dispatch, state) => {
  dispatch(deleteDeptsStart());
  let url = '/org/dept/delete';
  fetchData(url, {
    body: JSON.stringify(ids)
  }).then(
    (receipt) => {
      dispatch(deleteDeptsSuccess(receipt.data));
    },
    (error) => {
      console.log(error);
    }
  )
}

// 获取表格勾选项
export const preparedDept = (selectedDepts, selectedRowKeys) => ({
  type: DEPT_MANAGEMENT_ITEM_PREPARE,
  preparedDepts: selectedDepts,
  preparedKeys: selectedRowKeys,
});

// 取消操作，关闭Modal
export const cancelHandle = () => ({
  type: CANCEL_HANDLE
});
