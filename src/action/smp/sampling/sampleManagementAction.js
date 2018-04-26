import fetchData from '../../../util/fetchGateway'
import { spliceUrlByParams } from '../../../util/treeUtils'
import * as types from './ActionTypes'

// search列表
export const samplingListStart = () => ({
  type: types.SAMPLING_LIST_START
})
export const samplingListSuccess = (data) => ({
  type: types.SAMPLING_LIST_SUCCESS,
  data,
})
export const samplingListList = (start, end, key) => (dispatch, state) => {
  dispatch(samplingListStart());
  let url = spliceUrlByParams('/biz/odr/sampling', [start, end, key], 'start', 'end', 'key');
  fetchData(url, {}).then(
    (receipt) => {
      dispatch(samplingListSuccess(receipt.data))
      if(receipt && receipt.data && receipt.data.length > 0) {
        receipt.data.map(v => {
          if(v.id) v.key = v.id
          return v
        })
      }
    },
    (error) => {console.log(error)}
  )
}

// 获取首页列表的rowsKey
export const samplingListKey = (rows, rowKeys) => ({
  type: types.SAMPLING_LIST_KEY,
  rows,
  rowKeys,
})

// 获取列表点击项
export const getCurrentSampling = (record) => ({
  type: types.SAMPLING_LIST_CLICK,
  record
})

// 新增 / 编辑
export const addSampling = () => ({
  type: types.SAMPLING_ITEM_ADD
});
export const editSampling = () => ({
  type: types.SAMPLING_ITEM_EDIT,
});
export const saveSampling = () => ({
  type: types.SAMPLING_ITEM_SAVE
});
export const saveSamplingSuccess = (data) => ({
  type: types.SAMPLING_ITEM_SAVE_SUCCESS,
  data
});
export const samplingAdd = (data, editType) => (dispatch, state) => {
  dispatch(saveSampling());
  let url = '';
  if (editType === '新增') {
    url = '/biz/odr/sampling/add';
  } else if(editType === '编辑') {
    url = '/biz/odr/sampling/update';
  };
  fetchData(url, {
    body: JSON.stringify(data)
  }).then(
    (receipt) => {
      dispatch(saveSamplingSuccess(receipt.data));
      if(receipt && receipt.data && receipt.data.length > 0) {
        (receipt.data || []).map(v => {
          if(v.id) v.key = v.id
          return v
        })
      }
    }, (error) => {
      console.log(error);
    }
  )
}

// 激活
export const activeSample = () => ({
  type: types.ACTIVE_SAMPLING_START
})
export const activeSampleSuccess = (data, id) => ({
  type: types.ACTIVE_SAMPLING_SUCCESS,
  data,
  id
})
export const samplingActive = (ids) => (dispatch, state) => {
  dispatch(activeSample())
  fetchData('/biz/odr/sampling/active', {
    body: JSON.stringify(ids)
  }).then(
    (receipt) => {
        dispatch(activeSampleSuccess(receipt.data, ids))
    }, (error) => {
      console.log(error)
    }
  )
}
// 禁用
export const unActiveSample = () => ({
  type: types.UNACTIVE_SAMPLING_START
})
export const unActiveSampleSuccess = (data, id) => ({
  type: types.UNACTIVE_SAMPLING_SUCCESS,
  data,
  id
})
export const samplingUnActive = (ids) => (dispatch, state) => {
  dispatch(unActiveSample())
  fetchData('/biz/odr/sampling/disable', {
    body: JSON.stringify(ids)
  }).then(
    (receipt) => {
        dispatch(unActiveSampleSuccess(receipt.data, ids))
    }, (error) => {
      console.log(error)
    }
  )
}

// 取消操作
export const cancelSample = () => ({
  type: types.CANCEL_SAMPLING,
});
