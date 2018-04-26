import {fromJS} from 'immutable'
import * as types from '../../../action/report/reportSent/ActionTypes'
import { replaceNodeById } from '../../../util/treeUtils';


// reducers
const initialState = fromJS({
  isLoading: false,
  editType: '',
  currentReport: [],         // 列表点击 选中
  reportSentData: [],        // 列表样品数据储存
  reportTableRows: [],       // 报告 rows
  reportTableRowKeys: [],    // 报告 rowKeys
  reportMethodData: [],      // 交付方式
  reportGoodsData: [],       // 交付物
  reportInfo: [],            // 交付验证
  deliveryData: [],          // save 交付记录 data
  reportDRows: [],           // 交付记录列表 rows
  reportDRowKeys: [],        // 交付记录列表 rowKeys
});

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case types.REPORTSENT_SAMPLE_START:
    case types.DELIVERY_RECORD_LIST:
      return state.set('isLoading', true);
    // 搜索后的列表展示样品
    case types.REPORTSENT_SAMPLE_SUCCESS:
      let listData = action.data;
      return state.set('isLoading', false).set('reportSentData', listData).set('currentReport', {});
    // 样品列表rows 和 rowKeys
    case types.REPORTSENT_TABLE_ROWS:
      let reportTableRows = action.rows;
      let reportTableRowKeys = action.rowKeys;
      return state.set('isLoading', false).set('reportTableRows', reportTableRows).set('reportTableRowKeys', reportTableRowKeys);
    // 报告列表 点击项
    case types.REPORTSENT_TABLE_SELECT:
      return state.set('isLoading', false).set('currentReport', action.record)
    // 交付方式
    case types.REPORTSENT_METHODLIST:
      return state.set('reportMethodData', action.val)
    // 交付物
    case types.REPORTSENT_GOODSLIST:
      return state.set('reportGoodsData', action.val)
    // 审核记录 弹框
    case types.REPORTSENT_APPROVE:
      return state.set('isLoading', false).set('editType', 'approveLog')
    // 报告交付
    case types.DELIVERY_REPORTSENT:
    case types.DELIVERY_REPORTSENT_START:
      return state.set('isLoading', true).set('editType', '交付报告')
    // 报告交付 验证
    case types.DELIVERY_REPORTSENT_VERIFY:
      return state.set('isLoading', false).set('reportInfo', action.info)
    // 报告交付 save
    case types.DELIVERY_REPORTSENT_SUCCESS:
      return state.set('isLoading', false).set('editType', '').set('deliveryData', action.data)
    // 交付记录 列表
    case types.DELIVERY_RECORD_LIST_SUCCESS:
      return state.set('isLoading', false).set('deliveryData', action.data)
    // 交付记录列表 rows
    case types.REPORTSENT_DELIVERY_ROWS:
      return state.set('isLoading', false).set('reportDRows', action.rows).set('reportDRowKeys', action.rowKeys)
    // 取消交付
    case types.UNDELIVERY_REPORTSENT:
    case types.UNDELIVERY_REPORTSENT_START:
      return state.set('isLoading', true).set('editType', '取消交付')
    // 取消交付验证
    case types.UNDELIVERY_REPORTSENT_VERIFY:
      return state.set('isLoading', false)
    case types.UNDELIVERY_REPORTSENT_SUCCESS:
      replaceNodeById(state.get('deliveryData'), 'id', action.data);
      return state.set('isLoading', false).set('editType', '')
    // 取消弹框
    case types.CANCEL_REPORTSENT:
      return state.set('isLoading', false).set('editType', '')
    default:
      return state;
  }
}
