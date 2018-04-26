import {fromJS} from 'immutable';
import { message } from 'antd';
import moment from 'moment';
import fetchData, { fieldMapper } from '../../../util/fetchGateway';
import { replaceNodeById } from '../../../util/treeUtils';
import { spliceUrlByParams } from '../../../util/treeUtils';

// actions
// 加载订单数据
const asyncLoadOrderData = () => (dispatch, state) => {
  dispatch(actions.asyncLoadOrderDataStart());
  let url = '/odr/order/query';
  fetchData(url, {}).then(
    (receipt) => {
      dispatch(actions.asyncLoadOrderDataSuccess(receipt.data));
    },
    (error) => {
      console.log(error);
    }
  )
}

// 打开样品调度modal，加载样品数据
const sampleDispatch = (orderDatas) => (dispatch, state) => {
  if(!orderDatas.length > 0) return;
  dispatch(actions.sampleDispatchStart());
  let url = '/odr/sample/query';
  let intOptions = {'key':'id'};
  fetchData(url, {
    body: JSON.stringify(orderDatas.map(item => item.id))
  }, fieldMapper(intOptions)).then(
    (receipt) => {
      dispatch(actions.sampleDispatchSuccess(receipt.data));
    },
    (error) => {
      console.log(error);
    }
  )
}

// 调度样品
const asyncDispatchSample = (dispatchSample) => (dispatch, state) => {
  if(!dispatchSample.length > 0) return;
  dispatch(actions.asyncDispatchSampleStart());
  let url = '/odr/sample/dispatch';
  fetchData(url, {
    body: JSON.stringify(dispatchSample)
  }).then(
    (receipt) => {
      dispatch(actions.asyncDispatchSampleSuccess(receipt.data));
      if(receipt.code === '0'){
        message.success('调度成功');
      }
    },
    (error) => {
      console.log(error);
    }
  )
}

// 退回样品
const asyncSampleBack = (orderDatas) => (dispatch, state) => {
  if(!orderDatas.length > 0) return;
  dispatch(actions.asyncSampleBackStart());
  let url = '/odr/sample/back';
  fetchData(url, {
    body: JSON.stringify(orderDatas.map(item => item.id))
  }).then(
    (receipt) => {
      dispatch(actions.asyncSampleBackSuccess(receipt.data));
      if(receipt.code === '0'){
        message.success('退回成功，请至样品录入环节查看');
        asyncLoadOrderData()(dispatch, state);
      }
    },
    (error) => {console.log(error)}
  )
}

export const actions = {
  // 加载订单数据
  asyncLoadOrderDataStart: () => ({type:actionTypes.ASYNC_LOAD_ORDERDATA_START}),
  asyncLoadOrderDataSuccess: (orderData) => ({type:actionTypes.ASYNC_LOAD_ORDERDATA_SUCCESS, orderData: orderData}),
  asyncLoadOrderData,
  // 打开样品调度modal
  sampleDispatchStart: () => ({type: actionTypes.SAMPLE_DISPATCH_START}),
  sampleDispatchSuccess: (sampleData) => ({type: actionTypes.SAMPLE_DISPATCH_SUCCESS, sampleData: sampleData}),
  sampleDispatch,
  // 勾选订单数据
  preparedOrder: (orderDatas, orderKeys) => ({type: actionTypes.PREPARED_ORDER, orderDatas: orderDatas, orderKeys: orderKeys}),
  // 调度样品
  asyncDispatchSampleStart: () => ({type: actionTypes.ASYNC_DISPATCH_SAMPLE_START}),
  asyncDispatchSampleSuccess: () => ({type: actionTypes.ASYNC_DISPATCH_SAMPLE_SUCCESS}),
  asyncDispatchSample,
  //退回样品
  asyncSampleBackStart: () => ({type: actionTypes.ASYNC_SAMPLE_BACK_START}),
  asyncSampleBackSuccess: () => ({type: actionTypes.ASYNC_SAMPLE_BACK_SUCCESS}),
  asyncSampleBack,
  //打开样品编辑modal，复用订单录入节点
  sampleEdit: () => ({type: actionTypes.SAMPLE_EDIT}),
  // 取消操作
  cancel: () => ({type: actionTypes.CANCEL}),
};

// action types
export const actionTypes = {
  ASYNC_LOAD_ORDERDATA_START: 'ASYNC_LOAD_ORDERDATA_START',
  ASYNC_LOAD_ORDERDATA_SUCCESS: 'ASYNC_LOAD_ORDERDATA_SUCCESS',
  SAMPLE_DISPATCH_START: 'SAMPLE_DISPATCH_START',
  SAMPLE_DISPATCH_SUCCESS: 'SAMPLE_DISPATCH_SUCCESS',
  ASYNC_DISPATCH_SAMPLE_START: 'ASYNC_DISPATCH_SAMPLE_START',
  ASYNC_DISPATCH_SAMPLE_SUCCESS: 'ASYNC_DISPATCH_SAMPLE_SUCCESS',
  ASYNC_SAMPLE_BACK_START: 'ASYNC_SAMPLE_BACK_START',
  ASYNC_SAMPLE_BACK_SUCCESS: 'ASYNC_SAMPLE_BACK_SUCCESS',
  SAMPLE_EDIT: 'SAMPLE_EDIT',
  PREPARED_ORDER: 'PREPARED_ORDER',
  CANCEL: 'CANCEL',
};

// reducers
const initialState = fromJS({
  isLoading: false,
  operationType: '',
  orderData: [],
  preparedOrderKey: [],
  preparedOrderData: [],
  sampleData: [],
});

export default (state = initialState, action = {}) => {
  switch ( action.type ){
    case actionTypes.ASYNC_LOAD_ORDERDATA_START:
    case actionTypes.ASYNC_DISPATCH_SAMPLE_START:
    case actionTypes.ASYNC_SAMPLE_BACK_START:
      return state.set('isLoading', true);
    case actionTypes.ASYNC_LOAD_ORDERDATA_SUCCESS:
      let orderData = action.orderData;
      orderData.map((item) => {
        if(moment(item.date).format('YYYY-MM-DD') !== 'Invalid date')
          item.date = moment(item.date).format('YYYY-MM-DD');
      });
      return state.set('isLoading', false).set('orderData', orderData);
    case actionTypes.SAMPLE_DISPATCH_START:
      return state.set('isLoading', true);
    case actionTypes.SAMPLE_DISPATCH_SUCCESS:
      let sampleData = action.sampleData;
      for(let i = 0; i < sampleData.length; i++){
        sampleData[i].serialNumber = i + 1;
        if(!sampleData[i].rptPrepareBy)
          sampleData[i].rptPrepareBy = {};
        if(!sampleData[i].verifier.verifier)
          sampleData[i].verifier.verifier = {};
      }
      return state.set('isLoading', false).set('operationType', '样品调度').set('sampleData', sampleData);
    case actionTypes.PREPARED_ORDER:
      let preparedOrderData = action.orderDatas;
      let preparedOrderKey = action.orderKeys;
      return state.set('preparedOrderKey', preparedOrderKey).set('preparedOrderData', preparedOrderData);
    case actionTypes.SAMPLE_EDIT:
      return state.set('operationType', '样品编辑');
    case actionTypes.ASYNC_DISPATCH_SAMPLE_SUCCESS:
    case actionTypes.ASYNC_SAMPLE_BACK_SUCCESS:
    case actionTypes.CANCEL:
      return state.set('isLoading', false).set('operationType', '');
    default :
      return state;
  }
};
