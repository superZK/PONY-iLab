import fetchData from '../../../util/fetchGateway'
import { spliceUrlByParams, } from '../../../util/treeUtils'
import * as types from './ActionTypes'

// 树列表
export const loadLocationStart = () => ({
  type: types.LOAD_LOCATION_START
})
export const loadLocationSuccess = (siteInfo, data) => ({
  type: types.LOAD_LOCATION_SUCCESS,
  siteInfo,
  data
})
export const asyncLoadLocation = (id, name) => (dispatch, getState) => {
  dispatch(loadLocationStart());
  fetchData('/loc/sLocation/query', {}).then(
    (receipt) => {
      dispatch(loadLocationSuccess({
        id: 0,
        code: 'R',
        locationName: name
      }, receipt.data));
    }, (error) => {
      console.log(error);
    }
  )
}
// 获取可搜索树选中的节点
export const selectedLocation = (selectedKeys) => ({
  type: types.LOCATION_ITEM_SELECT,
  selectedId: Number.parseInt(selectedKeys[0], 10)
});

// 表格rows
export const listLocationRows = (rows, rowsKey) => ({
  type: types.LOCATION_LIST_ROWS,
  rows,
  rowsKey,
})

// 新增
export const locationAdd = () => ({
  type: types.LOCATION_ADD
})
export const locationEdit = () => ({
  type: types.LOCATION_EDIT
})
export const locationAddStart = () => ({
  type: types.LOCATION_ADD_START
})
export const locationAddSuccess = (data) => ({
  type: types.LOCATION_ADD_SUCCESS,
  data
})
export const addLocation = (data, editType, sid, siteId, typeId) => (dispatch, state) => {
  dispatch(locationAddStart());
  let url = '';
  if(editType === '新增'){
    url = spliceUrlByParams('/loc/sLocation/save', [sid, siteId, typeId], 'sid', 'siteId', 'typeId');
  } else if(editType === '编辑'){
    url = '/loc/sLocation/update?typeId=' + typeId
  }
  fetchData(url, {
    body: JSON.stringify(data)
  }).then(
    (receipt) => {
      dispatch(locationAddSuccess(receipt.data));
    }, (error) => {
      console.log(error);
    }
  )
}

// 删除
export const deleteLocationStart = () => ({
  type: types.DELETE_LOCATION_START
});
export const deleteLocationSuccess = (code, ids) => ({
  type: types.DELETE_LOCATION_SUCCESS,
  code,
  ids
});
export const locationDelete = (ids) => (dispatch, getState) => {
  dispatch(deleteLocationStart());
  fetchData('/loc/sLocation/delete', {
    body: JSON.stringify(ids)
  }).then(
    (receipt) => {
      dispatch(deleteLocationSuccess(receipt.code, ids));
    }, (error) => {
      console.log(error);
    }
  )
}

// 取消操作
export const cancelLocation = () => ({
  type: types.CANCEL_LOCATION,
});
