import {fromJS} from 'immutable';
import fetchData from '../../../util/fetchGateway';

// 左侧列表 调取数据
export const reportVList = () => (dispatch, state) => {
  dispatch(actions.listTreeStart());
  let url = '/report/verify/query/orders';
  fetchData(url, {}).then(
    (receipt) => {
      dispatch(actions.listTreeSuccess(receipt.data));
      // const dataF = receipt.data && receipt.data.length > 0;
      // const dataS = receipt.data && receipt.data[0];
      // reportVTableList(dataF ? [dataS.id] : [])(dispatch, state);
    },
    (error) => {
      console.log(error);
    }
  )
}

// 右侧列表 调取数据
const reportVTableList = (data) => (dispatch, state) => {
  dispatch(actions.listTableStart());
  if(!data) return;
  let key = data.sampleId + '';
  // console.log(data);
  let url = '/report/verify/query/report' + '?sid=' + key;
  fetchData(url, {}).then(
    (receipt) => {
      dispatch(actions.listTableSuccess(receipt.data));
    },
    (error) => {
      console.log(error);
    }
  )
}

// 审核报告弹框 确认
const reportVBtn = (data) => (dispatch, state) => {
  dispatch(actions.reportVerifyButStart());
  // let url = '/report/reportcompile/approve';
  fetchData('/report/reportcompile/approve', {
    body: JSON.stringify(data)
  }).then(
    (receipt) => {
      dispatch(actions.reportVerifyButSuccess(receipt.data));
    },
    (error) => {
      console.log(error);
    }
  )
}

// actions
export const actions = {
  // 左侧列表 调取数据
  listTreeStart: () => ({type: actionTypes.LISTTREE_REPORTVERIFY_START}),
  listTreeSuccess: (data) => ({type: actionTypes.LISTTREE_REPORTVERIFY_SUCCESS, data}),
  reportVList,
  // 左侧列表 rows rowkeys / 点击项
  listTreeRows: (rows, rowKeys) => ({type: actionTypes.LISTTREE_REPORTVERIFY_ROWS, rows, rowKeys}),
  listTreeClick: (click) => ({type: actionTypes.LISTTREE_REPORTVERIFY_CLICK, click}),
  // 右侧列表
  listTableStart: () => ({type: actionTypes.LISTTABLE_REPORTVERIFY_START}),
  listTableSuccess: (data) => ({type: actionTypes.LISTTABLE_REPORTVERIFY_SUCCESS, data}),
  reportVTableList,
  // 右侧列表 rows rowkeys / 点击项
  listTableRows: (rows, rowKeys) => ({type: actionTypes.LISTTABLE_REPORTVERIFY_ROWS, rows, rowKeys}),
  listTableClick: (click) => ({type: actionTypes.LISTTABLE_REPORTVERIFY_CLICK, click}),
  // 审核报告弹框 确认
  reportVerifyBut: () => ({type: actionTypes.REPORTVERIFY_BUTTON}),
  reportVerifyButStart: () => ({type: actionTypes.REPORTVERIFY_BUTTON_START}),
  reportVerifyButSuccess: (data) => ({type: actionTypes.REPORTVERIFY_BUTTON_SUCCESS, data}),
  reportVBtn,
  // 审批记录 弹框
  reportVerifyRecord: () => ({type: actionTypes.REPORTVERIFY_RECORD}),
  // 取消操作
  cancelHandle: () => ({type: actionTypes.CANCEL_HANDLE}),
};

// action types
export const actionTypes = {
  // 左侧列表 调取数据
  LISTTREE_REPORTVERIFY_START: 'LISTTREE_REPORTVERIFY_START',
  LISTTREE_REPORTVERIFY_SUCCESS: 'LISTTREE_REPORTVERIFY_SUCCESS',
  // 左侧列表 rows rowkeys
  LISTTREE_REPORTVERIFY_ROWS: 'LISTTREE_REPORTVERIFY_ROWS',
  LISTTREE_REPORTVERIFY_CLICK: 'LISTTREE_REPORTVERIFY_CLICK',
  // 右侧列表
  LISTTABLE_REPORTVERIFY_START: 'LISTTABLE_REPORTVERIFY_START',
  LISTTABLE_REPORTVERIFY_SUCCESS: 'LISTTABLE_REPORTVERIFY_SUCCESS',
  // 右侧列表 rows rowkeys / 点击项
  LISTTABLE_REPORTVERIFY_ROWS: 'LISTTABLE_REPORTVERIFY_ROWS',
  LISTTABLE_REPORTVERIFY_CLICK: 'LISTTABLE_REPORTVERIFY_CLICK',
  // 审核报告弹框
  REPORTVERIFY_BUTTON: 'REPORTVERIFY_BUTTON',
  REPORTVERIFY_BUTTON_START: 'REPORTVERIFY_BUTTON_START',
  REPORTVERIFY_BUTTON_SUCCESS: 'REPORTVERIFY_BUTTON_SUCCESS',
  // 审批记录 弹框
  REPORTVERIFY_RECORD: 'REPORTVERIFY_RECORD',
  // 弹框返回
  CANCEL_HANDLE: 'CANCEL_HANDLE',
};

// reducers
const initialState = fromJS({
  isLoading: false,
  editType: '',
  searchData: [],          // 搜索树
  rowsList: [],            // 搜索树rows
  rowKeysList: [],         // 搜索树rowKeys
  reportVerifyKey: [],     // 订单 选中的key值
  rowsTableList: [],       // 右侧列表rows
  rowKeystableKeysList: [],// 右侧列表rowKeys
  listVerifyClick: {},     // 右侧列表 点击项
  reportVerifyData: [],    // 右侧列表 data
});

export default (state = initialState, action = {}) => {
  switch ( action.type ){
    case actionTypes.LISTTREE_REPORTVERIFY_START:
    case actionTypes.LISTTABLE_REPORTVERIFY_START:
      return state.set('isLoading', true);
    // 左侧列表 调取数据
    case actionTypes.LISTTREE_REPORTVERIFY_SUCCESS:
      let searchD = action.data;
      // console.log(searchD);
      return state.set('isLoading', false).set('searchData', searchD).set('currentReport', {});
    // 左侧列表 rows rowkeys
    case actionTypes.LISTTREE_REPORTVERIFY_ROWS:
      return state.set('isLoading', false).set('rowsList', action.rows).set('rowKeysList', action.rowKeys);
    case actionTypes.LISTTREE_REPORTVERIFY_CLICK:
      return state.set('isLoading', false).set('reportVerifyKey', action.click);
    // 右侧列表
    case actionTypes.LISTTABLE_REPORTVERIFY_SUCCESS:
      return state.set('isLoading', false).set('reportVerifyData', action.data).set('rowsTableList', []).set('rowKeystableKeysList', []);
    // 右侧列表 rows
    case actionTypes.LISTTABLE_REPORTVERIFY_ROWS:
      return state.set('isLoading', false).set('rowsTableList', action.rows).set('rowKeystableKeysList', action.rowKeys).set('listVerifyClick', {});
    // 右侧列表 点击项
    case actionTypes.LISTTABLE_REPORTVERIFY_CLICK:
      return state.set('isLoading', false).set('listVerifyClick', action.click)
    // 审核报告弹框
    case actionTypes.REPORTVERIFY_BUTTON:
    case actionTypes.REPORTVERIFY_BUTTON_START:
      return state.set('isLoading', false).set('editType', '报告审核')
    case actionTypes.REPORTVERIFY_BUTTON_SUCCESS:
      let dataS = action.data;
      return state.set('isLoading', false).set('editType', '')
    // 审批记录 弹框
    case actionTypes.REPORTVERIFY_RECORD:
      return state.set('isLoading', false).set('editType', 'approveLog')
    // 弹框返回
    case actionTypes.CANCEL_HANDLE:
      return state.set('isLoading', false).set('editType', '');
    default :
      return state;
  }
};
