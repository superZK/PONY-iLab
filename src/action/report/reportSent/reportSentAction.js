import fetchData from '../../../util/fetchGateway'
import * as types from './ActionTypes'
import {message} from 'antd'


// 报告模板搜索下面的列表 / 查询
// 报告
export const reportSentSampleStart = () => ({
  type: types.REPORTSENT_SAMPLE_START
})
export const reportSentSampleSuccess = (data) => ({
  type: types.REPORTSENT_SAMPLE_SUCCESS,
  data,
})
export const reportSentList = (data) => (dispatch, state) => {
  dispatch(reportSentSampleStart())
  fetchData('/report/reportcompile/query/delivery', {
    body: JSON.stringify(data)
  }).then(
    (receipt) => {
      dispatch(reportSentSampleSuccess(receipt.data))
      if(receipt.data && receipt.data.length > 0) {
        reportSentDeliveryR(receipt.data[0].id)(dispatch, state)
      }
    },
    (error) => {
      dispatch(cancelReportSent());
      console.log(error)
    }
  )
}
// 获取首页 报告列表的rowsKey
export const reportSentTableRows = (rows, rowKeys) => ({
  type: types.REPORTSENT_TABLE_ROWS,
  rows,
  rowKeys
})
// 获取首页 报告的列表点击项
export const reportSentTableSelect = (record) => ({
  type: types.REPORTSENT_TABLE_SELECT,
  record,
})
// 交付方式
export const reportMethodList = (val) => ({
  type: types.REPORTSENT_METHODLIST,
  val
})
// 交付物
export const reportGoodsList = (val) => ({
  type: types.REPORTSENT_GOODSLIST,
  val
})

// 交付报告
export const deliveryReport = () => ({
  type: types.DELIVERY_REPORTSENT
})
export const deliveryReportStart = () => ({
  type: types.DELIVERY_REPORTSENT_START
})
export const deliveryReportVerify = (info) => ({
  type: types.DELIVERY_REPORTSENT_VERIFY,
  info
})
export const deliveryReportSuccess = (data) => ({
  type: types.DELIVERY_REPORTSENT_SUCCESS,
  data
})
export const reportSentVerify = (info, data) => (dispatch, state) => {
  dispatch(deliveryReportStart())
  fetchData('/auth/user/check/eseal', {
    body: JSON.stringify(info)
  }).then(
    (receipt) => {
      dispatch(deliveryReportVerify(receipt.data))
      if(receipt.data && receipt.data[0]){
        reportSentDelivery(data)(dispatch, state)
      } else {
        message.error('用户名或密码错误')
      }
    }
  )
}
export const reportSentDelivery = (data) => (dispatch, state) => {
  fetchData('/report/deliveryrecord/save', {
    body: JSON.stringify(data)
  }).then(
    (receipt) => {
      dispatch(deliveryReportSuccess(receipt.data))
    }
  )
}

// 审核记录
export const reportApprovedMemo = () => ({
  type: types.REPORTSENT_APPROVE,
})

// 交付记录列表
export const deliveryRecordReportStart = () => ({
  type: types.DELIVERY_RECORD_LIST
})
export const deliveryRecordReportSuccess = (data) => ({
  type: types.DELIVERY_RECORD_LIST_SUCCESS,
  data
})
export const reportSentDeliveryR = (id) => (dispatch, state) => {
  dispatch(deliveryRecordReportStart())
  fetchData('/report/deliveryrecord/query/' + id, {}).then(
    (receipt) => {
      dispatch(deliveryRecordReportSuccess(receipt.data))
    }
  )
}
// 获取首页 列表的rowsKey
export const reportDeliveryRows = (rows, rowKeys) => ({
  type: types.REPORTSENT_DELIVERY_ROWS,
  rows,
  rowKeys
})

// 取消交付
export const unDeliveryReport = () => ({
  type: types.UNDELIVERY_REPORTSENT
})
export const unDeliveryReportStart = () => ({
  type: types.UNDELIVERY_REPORTSENT_START
})
export const unDeliveryReportVerify = (info) => ({
  type: types.UNDELIVERY_REPORTSENT_VERIFY,
  info
})
export const unDeliveryReportSuccess = (data) => ({
  type: types.UNDELIVERY_REPORTSENT_SUCCESS,
  data
})
// 取消交付验证
export const unReportSentVerify = (info, ids) => (dispatch, state) => {
  dispatch(unDeliveryReportStart())
  fetchData('/auth/user/check/eseal', {
    body: JSON.stringify(info)
  }).then(
    (receipt) => {
      dispatch(unDeliveryReportVerify(receipt.data))
      if(receipt.data && receipt.data[0]){
        unReportSentDelivery(info, ids)(dispatch, state)
      } else {
        message.error('用户名或密码错误')
      }
    }
  )
}
// 验证成功确认
export const unReportSentDelivery = (data, ids) => (dispatch, state) => {
  fetchData('/report/deliveryrecord/update/delivery?ids=' + ids, {
    body: JSON.stringify(data)
  }).then(
    (receipt) => {
      dispatch(unDeliveryReportSuccess(receipt.data))
    }
  )
}


// 取消操作
export const cancelReportSent = () => ({
  type: types.CANCEL_REPORTSENT,
});
