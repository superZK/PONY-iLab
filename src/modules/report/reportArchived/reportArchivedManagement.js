import {fromJS} from 'immutable'
import * as types from '../../../action/report/reportArchived/ActionTypes'
import { replaceNodeById, removeNodeById } from '../../../util/treeUtils';


// reducers
const initialState = fromJS({
  isLoading: false,
  editType: '',
  reportArchivedData: [],// 列表样品数据储存
  reportTableRows: [],// 列表数据 rows
  reportTableRowKeys: [],// 列表数据 rowKeys
  currentReport: [],// 列表数据 点击项
  reportNumData: [],// 报告扫描出内容
});

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case types.REPORTARCHIVED_FILTER_START:
    case types.REPORTARCHIVED_NUMBER_START:
      return state.set('isLoading', true);
    // 搜索filter && 列表
    case types.REPORTARCHIVED_FILTER_SUCCESS:
      return state.set('isLoading', false).set('reportArchivedData', action.data);
    // 列表rows 和 rowKeys
    case types.REPORTARCHIVED_TABLE_ROWS:
      return state.set('isLoading', false).set('reportTableRows', action.rows).set('reportTableRowKeys', action.rowKeys).set('currentReport', []);
    // 列表 点击项
    case types.REPORTARCHIVED_TABLE_SELECT:
      return state.set('isLoading', false).set('currentReport', action.record);
    // 报告归档 弹框
    case types.REPORT_REPORTARCHIVED:
    case types.REPORT_REPORTARCHIVED_START:
      return state.set('isLoading', true).set('editType', '报告归档')
    // 报告归档 确认
    case types.REPORT_REPORTARCHIVED_SUCCESS:
      replaceNodeById(state.get('reportArchivedData'), 'id', action.data)
      return state.set('isLoading', false).set('editType', '')
    // 报告扫描
    case types.REPORTARCHIVED_NUMBER_SUCCESS:
      return state.set('isLoading', false).set('reportNumData', action.data)
    // 取消弹框
    case types.CANCEL_REPORTARCHIVED:
      return state.set('isLoading', false).set('editType', '')
    default:
      return state;
  }
}
