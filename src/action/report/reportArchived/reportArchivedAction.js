import fetchData from '../../../util/fetchGateway'
import { spliceUrlByParams } from '../../../util/treeUtils'
import * as types from './ActionTypes'
import {message} from 'antd'

// 搜索filter && 列表
export const filterArchivedStart = () => ({
  type: types.REPORTARCHIVED_FILTER_START
});

export const filterArchivedSuccess = (data) => ({
  type: types.REPORTARCHIVED_FILTER_SUCCESS,
  data
});

export const filterArchivedData = (data) => (dispatch, state) => {
  dispatch(filterArchivedStart());
  let url = '/report/reportcompile/query/vo';
  fetchData(url, {
    body: JSON.stringify(data)
  }).then(
    (receipt) => {
      dispatch(filterArchivedSuccess(receipt.data));
     },
    (error) => {
      console.log(error);
    }
  )
}
// 获取首页 列表的rowsKey
export const reportArchivedTableRows = (rows, rowKeys) => ({
  type: types.REPORTARCHIVED_TABLE_ROWS,
  rows,
  rowKeys
})
// 列表点击项
export const reportArchivedTable = (record) => ({
  type: types.REPORTARCHIVED_TABLE_SELECT,
  record
})

// 扫描 报告编号
export const reportNumberStart = () => ({
  type: types.REPORTARCHIVED_NUMBER_START
})
export const reportNumberSuccess = (data) => ({
  type: types.REPORTARCHIVED_NUMBER_SUCCESS,
  data
})
export const reportNumber = (data) => (dispatch, state) => {
  dispatch(reportNumberStart())
  fetchData('/report/reportcompile/query/reportno', {
    body: data
  }).then(
    (receipt) => {
      dispatch(reportNumberSuccess(receipt.data));
    }
  )
}

// 报告归档
export const archivedReport = () => ({
  type: types.REPORT_REPORTARCHIVED
})
export const archivedReportStart = () => ({
  type: types.REPORT_REPORTARCHIVED_START
})
export const archivedReportSuccess = (data) => ({
  type: types.REPORT_REPORTARCHIVED_SUCCESS,
  data
})
export const reportArchivedDelivery = (reportContainerTypeId, locationId, ids) => (dispatch, state) => {
  dispatch(archivedReportStart())
  let url = spliceUrlByParams('/report/reportcompile/update/archive', [reportContainerTypeId, locationId], 'reportContainerTypeId', 'locationId');
  fetchData(url, {
    body: JSON.stringify(ids)
  }).then(
    (receipt) => {
      dispatch(archivedReportSuccess(receipt.data));
    }
  )
}

// 取消操作
export const cancelArchived = () => ({
  type: types.CANCEL_REPORTARCHIVED,
});
