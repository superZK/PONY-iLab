import {fromJS} from 'immutable'
import * as types from '../../../action/document/reportTemplate/ActionTypes'
import { replaceNodeById, removeNodeById } from '../../../util/treeUtils';


// reducers
const initialState = fromJS({
  isLoading: false,
  editType: '',
  searchTree: [],          // 报告模板搜索树
  selectRows: [],          // 列表rows
  selectRowKeys: [],       // 列表rowkeys
  currentReport: {},       // 列表点击 选中
  reportTemplateData: [],  // 数据存储
  reportTemplateKey: [],   // 报告模板树 选中key值
  uploadData: [],          // 上传文件列表存储
  uploadRows: [],          // 上传文件列表存储rows
  uploadRowKeys: [],       // 上传文件列表存储rowKeys
});

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case types.REPORTTEMPLATE_SEARCH_START:
    case types.REPORTTEMPLATE_START:
    case types.DELETE_REPORTTEMPLATE_START:
    case types.REPORTTEMPLATE_ITEM_SAVE:
    case types.DELETE_REPORTTEMPLATE_START:
    case types.UPLOAD_REPORTTEMPLATE_START:
    case types.ACTIVE_REPORTTEMPLATE_START:
    case types.UPLOAD_REPORTTEMPLATE_LIST_START:
    case types.UPLOAD_REPORTTEMPLATE_DELETE_START:
    case types.MAIN_FILE_REPORTTEMPLATE_START:
      return state.set('isLoading', true);
    // 报告模板搜索树
    case types.REPORTTEMPLATE_SEARCH_SUCCESS:
      let searchData = action.info;
      searchData.subordinate = action.data;
      console.log(action.info, action.data);
      return state.set('isLoading', false).set('searchTree', [searchData]).set('reportTemplateKey', searchData.subordinate && searchData.subordinate.length > 0 ? searchData.subordinate[0].id : []).set('currentReport', {}).set('uploadData', '');
    // 报告模板列表展示
    case types.REPORTTEMPLATE_SUCCESS:
      let listData = action.data;
      let listKey = action.key;
      return state.set('isLoading', false).set('reportTemplateData', listData).set('reportTemplateKey', listKey).set('currentReport', {}).set('uploadData', '');
    // 列表rows 和 rowKeys
    case types.REPORTTEMPLATE_LIST_KEY:
      let selectRows = action.rows;
      let selectRowKeys = action.rowKeys;
      return state.set('isLoading', false).set('selectRows', selectRows).set('selectRowKeys', selectRowKeys);
    // 列表 点击 选中
    case types.REPORTTEMPLATE_LIST_CLICK:
      let listRecord = action.record;
      return state.set('isLoading', false).set('currentReport', listRecord)
    // 新增 / 编辑
    case types.REPORTTEMPLATE_ITEM_ADD:
      return state.set('isLoading', true).set('editType', '新增报告模板');
    case types.REPORTTEMPLATE_ITEM_EDIT:
      return state.set('isLoading', true).set('editType', '编辑报告模板');
    case types.REPORTTEMPLATE_ITEM_SAVE_SUCCESS:
      let et = state.get('editType');
      let saveData = action.data;
      let result = [];
      if (et === '新增报告模板'){
        result = state.get('reportTemplateData').concat(saveData);
      } else if (et === '编辑报告模板'){
        replaceNodeById(state.get('reportTemplateData'), 'id', saveData);
        result = state.get('reportTemplateData')
      }
      return state.set('isLoading', false).set('editType', '').set('reportTemplateData', result);
    // 删除报告模板
    case types.DELETE_REPORTTEMPLATE_SUCCESS:
      let removeAction = action.del;
      removeNodeById(state.get('reportTemplateData'), 'id', removeAction);
      return state.set('isLoading', false)
    // 上传文件确认 弹框
    case types.UPLOAD_MODAL_REPORTTEMPLATE:
      return state.set('isLoading', true).set('editType', '上传文件');
    case types.UPLOAD_REPORTTEMPLATE_SUCCESS:
      let uploadData = action.data;
      return state.set('isLoading', false).set('uploadData', uploadData);
    // 上传文件列表
    case types.UPLOAD_REPORTTEMPLATE_LIST_SUCCESS:
      let uploadDataList = action.data;
      return state.set('isLoading', false).set('uploadData', uploadDataList);
    // 上传文件rows rowkeys
    case types.UPLOAD_REPORTTEMPLATE_ROWS:
      let uploadRows = action.rows;
      let uploadRowKeys = action.rowsKey;
      return state.set('isLoading', false).set('uploadRows', uploadRows).set('uploadRowKeys', uploadRowKeys);
    // 删除上传文件
    case types.UPLOAD_REPORTTEMPLATE_DELETE_SUCCESS:
      let uploadDataDel = action.del;
      removeNodeById(state.get('uploadData'), 'id', uploadDataDel);
      return state.set('isLoading', false);
    // 激活 / 禁用
    case types.ACTIVE_REPORTTEMPLATE_SUCCESS:
      replaceNodeById(state.get('reportTemplateData'), 'id', action.id);
      return state.set('isLoading', false).set('editType', '激活')
    case types.UNACTIVE_REPORTTEMPLATE_SUCCESS:
      replaceNodeById(state.get('reportTemplateData'), 'id', action.id);
      return state.set('isLoading', false).set('editType', '禁用');
    // 设置主文件
    case types.MAIN_FILE_REPORTTEMPLATE_SUCCESS:
      replaceNodeById(state.get('uploadData'), 'id', action.data);
      return state.set('isLoading', false)

    // 取消弹框
    case types.CANCEL_REPORTTEMPLATE:
      return state.set('isLoading', false).set('editType', '')
    default:
      return state;
  }
}
