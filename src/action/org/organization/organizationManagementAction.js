import fetchData from '../../../util/fetchGateway';
import { spliceUrlByParams } from '../../../util/treeUtils';

export const ORGANIZATION_MANAGEMENT_DATA_LOAD = 'ORGANIZATION_MANAGEMENT_DATA_LOAD';
export const ORGANIZATION_MANAGEMENT_DATA_LOAD_SUCCESS = 'ORGANIZATION_MANAGEMENT_DATA_LOAD_SUCCESS';
export const ORGANIZATION_MANAGEMENT_DATA_ADD = 'ORGANIZATION_MANAGEMENT_DATA_ADD';
export const ORGANIZATION_MANAGEMENT_DATA_SAVE_START = 'ORGANIZATION_MANAGEMENT_DATA_SAVE_START';
export const ORGANIZATION_MANAGEMENT_DATA_SAVE_SUCCESS = 'ORGANIZATION_MANAGEMENT_DATA_SAVE_SUCCESS';
export const ORGANIZATION_MANAGEMENT_DATA_PREPARE = 'ORGANIZATION_MANAGEMENT_DATA_PREPARE';
export const ORGANIZATION_MANAGEMENT_DATA_UPDATE = 'ORGANIZATION_MANAGEMENT_DATA_UPDATE';
export const ORGANIZATION_MANAGEMENT_DATA_DELETE = 'ORGANIZATION_MANAGEMENT_DATA_DELETE';
export const ORGANIZATION_MANAGEMENT_DATA_DELETE_START = 'ORGANIZATION_MANAGEMENT_DATA_DELETE_START';
export const ORGANIZATION_MANAGEMENT_DATA_DELETE_SUCCESS = 'ORGANIZATION_MANAGEMENT_DATA_DELETE_SUCCESS';

export const CANCEL_HANDLE = 'CANCEL_HANDLE';

// 加载组织数据
export const loadOrgDataStart = () => ({
  type : ORGANIZATION_MANAGEMENT_DATA_LOAD
});

export const loadOrgDataSuccess = (receipt) => ({
  type : ORGANIZATION_MANAGEMENT_DATA_LOAD_SUCCESS,
  orgData:receipt,
});

export const asyncLoadOrgData = () => (dispatch, state) => {
  dispatch(loadOrgDataStart);
  fetchData('/org/site/query',{}).then(
    (receipt) => {
      dispatch(loadOrgDataSuccess(receipt.data));
    },
    (error) => {
      console.log(error);
    }
  )

}
// 新增+编辑组织数据
export const addOrganizationData = () => ({
  type : ORGANIZATION_MANAGEMENT_DATA_ADD
});

export const editOrganizationData = () => ({
  type : ORGANIZATION_MANAGEMENT_DATA_UPDATE
});

export const saveOrgStart = () => ({
  type: ORGANIZATION_MANAGEMENT_DATA_SAVE_START
});

export const saveOrgSuccess = (receipt, editType) => ({
  type: ORGANIZATION_MANAGEMENT_DATA_SAVE_SUCCESS,
  orgData: receipt,
  editType: editType,
});

export const asyncSaveOrg = (orgData, editType, areaId) => (dispatch, state) => {
  dispatch(saveOrgStart());
  // 当编辑没有地区信息的组织数据且编辑完成后组织数据仍然没有地区信息，此时areaId为null，会导致错误的url'/org/site/update？areaId=null'
  if(areaId === 'null'){
    areaId = '';
  }
  let url = '';
  if(editType === '新增'){
    url = spliceUrlByParams('/org/site/add',[areaId],'areaId');
  }else if(editType === '编辑'){
    url = spliceUrlByParams('/org/site/update',[areaId],'areaId');
  }
  fetchData(url, {
    body: JSON.stringify(orgData)
  }).then(
    (receipt) => {
      dispatch(saveOrgSuccess(receipt.data, editType));
    },
    (error) => {
      console.log(error);
    }
  )
}

// 删除组织数据
export const deleteOrganizationData = () => ({
  type: ORGANIZATION_MANAGEMENT_DATA_DELETE,
})

export const deleteOrgsStart = () => ({
  type: ORGANIZATION_MANAGEMENT_DATA_DELETE_START,
})

export const deleteOrgsSuccess = (receipt) => ({
  type: ORGANIZATION_MANAGEMENT_DATA_DELETE_SUCCESS,
  removeIds: receipt,
})

export const asyncDeleteOrgs = (ids) => (dispatch, state) => {
  dispatch(deleteOrgsStart());
  let url = '/org/site/delete';
  fetchData(url, {
    body: JSON.stringify(ids)
  }).then(
    (receipt) => {
      dispatch(deleteOrgsSuccess(receipt.data));
    },
    (error) => {
      console.log(error);
    }
  )
}

// 获取表格勾选项
export const preparedOrg = (selectedRows, selectedRowKeys) => ({
  type: ORGANIZATION_MANAGEMENT_DATA_PREPARE,
  preparedOrgs: selectedRows,
  preparedKeys: selectedRowKeys,
});

// 取消操作，关闭Modal
export const cancelHandle = () => ({
  type: CANCEL_HANDLE
});
