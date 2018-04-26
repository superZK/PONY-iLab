import {fromJS} from 'immutable'
import * as types from '../../../action/report/markReport/ActionTypes'
import { replaceNodeById, removeNodeById } from '../../../util/treeUtils';


// reducers
const initialState = fromJS({
  isLoading: false,
  editType: '',
  searchData: [],            // 搜索树
  markReportKey: {},         // 报告编制订单树 选中key值
  currentReport: [],         // 列表点击 选中
  sampleData: [],            // 列表样品数据储存
  selectRows: [],            // 样品列表rows
  selectRowKeys: [],         // 样品列表rowkeys
  reportTemplateData: [],    // 报告模板列表数据
  templateRows: [],          // 获取报告模板的rows
  templateRowKeys: [],       // 获取报告模板的rowsKey
  signatureData: [],         // 签章列表数据
  qualificationRows: [],     // 获取签章的rows
  qualificationRowKeys: [],  // 获取签章的rowsKey
  markReportBtnData: [],     // 已编制报告按钮
  reportTableRows: [],       // 报告 rows
  reportTableRowKeys: [],    // 报告 rowKeys
});

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case types.MARKREPORT_SEARCH_START:
    case types.MARKREPORT_SAMPLE_START:
    case types.MARKREPORT_REPORTTEMPLATE_START:
    case types.MARKREPORT_SIGNATURE_START:
    case types.MARKREPORT_VOID_BTN_START:
    case types.DELETE_MARKREPORT_START:
    case types.DONE_MARKREPORT_START:
    case types.MARKREPORT_BTN_START:
    case types.MARKREPORT_BTN_LIST_START:
      return state.set('isLoading', true);
    // 搜索树
    case types.MARKREPORT_SEARCH_SUCCESS:
      let searchData = action.data;
      return state.set('isLoading', false).set('searchData', searchData).set('markReportKey', (searchData && searchData.length > 0) ? searchData[0].id : {}).set('currentReport', {});
    // 搜索后的列表展示样品
    case types.MARKREPORT_SAMPLE_SUCCESS:
      let listData = action.data;
      let listKey = action.selectedId;
      return state.set('isLoading', false).set('sampleData', listData).set('markReportKey', listKey).set('currentReport', {}).set('selectRows', []).set('selectRowKeys', []);
    // 样品列表rows 和 rowKeys
    case types.MARKREPORT_LIST_KEY:
      let selectRows = action.rows;
      let selectRowKeys = action.rowKeys;
      return state.set('isLoading', false).set('selectRows', selectRows).set('selectRowKeys', selectRowKeys);
    // 编制报告 列表查询
    case types.MARKREPORT_BTN_LIST_SUCCESS:
      let markRData = action.data;
      return state.set('isLoading', false).set('markReportBtnData', markRData)
    // 报告模板列表数据
    case types.MARKREPORT_REPORTTEMPLATE_SUCCESS:
      let templateData = action.data;
      return state.set('isLoading', false).set('reportTemplateData', templateData)
    // 获取报告模板的rowsKey
    case types.ROWS_MARKREPORT_TEMPLATE:
      let templateRows = action.rows;
      let templateRowKeys = action.rowKeys;
      return state.set('isLoading', false).set('templateRows', templateRows).set('templateRowKeys', templateRowKeys);
    // 获取签章列表数据
    case types.MARKREPORT_SIGNATURE_SUCCESS:
      let signatureData = action.data;
      return state.set('isLoading', false).set('signatureData', signatureData)
    // 获取签章的rowsKey
    case types.ROWS_MARKREPORT_QUALIFICATION:
      let qualificationRows = action.rows;
      let qualificationRowKeys = action.rowKeys;
      return state.set('isLoading', false).set('qualificationRows', qualificationRows).set('qualificationRowKeys', qualificationRowKeys);
    // 编制报告按钮
    case types.MARKREPORT_BTN_SUCCESS:
      let markReportAction = action.data;
      let markReportBData = state.get('markReportBtnData');
      if (markReportAction.length) {
        markReportAction.map(item => {
          return markReportBData.unshift(item);
        })
      };
      return state.set('isLoading', false).set('markReportBtnData', markReportBData)
    // 报告rows
    case types.MARKREPORT_TABLE_ROWS:
      let reportTableRows = action.rows;
      let reportTableRowKeys = action.rowKeys;
    return state.set('isLoading', false).set('reportTableRows', reportTableRows).set('reportTableRowKeys', reportTableRowKeys)
    // 报告作废 按钮
    case types.MARKREPORT_VOID_BTN_SUCCESS:
      let voidData = action.data;
      replaceNodeById(state.get('markReportBtnData'), 'id', voidData);
      return state.set('isLoading', false).set('reportTableRows', []).set('reportTableRowKeys', [])
    // 报告删除 按钮
    case types.DELETE_MARKREPORT_SUCCESS:
      let del = action.del;
      removeNodeById(state.get('markReportBtnData'), 'id', del);
      return state.set('isLoading', false).set('reportTableRows', []).set('reportTableRowKeys', [])
    // 编制报告 完成
    case types.DONE_MARKREPORT_SUCCESS:
      let doneData = action.data;
      removeNodeById(state.get('markReportBtnData'), 'id', doneData);
      return state.set('isLoading', false)
    // 取消弹框
    case types.CANCEL_MARKREPORT:
      return state.set('isLoading', false).set('editType', '')
    default:
      return state;
  }
}
