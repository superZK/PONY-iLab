import {fromJS} from 'immutable';
import {
  CATEGORY_MANAGEMENT_DATA_LOAD,
  CATEGORY_MANAGEMENT_DATA_LOAD_SUCCESS,
  PRODUCT_DATA_LOAD,
  PRODUCT_DATA_LOAD_SUCCESS,
  PRODUCT_ADD,
  PRODUCT_SAVE,
  PRODUCT_SAVE_SUCCESS,
  PRODUCT_PREPARE,
  PRODUCT_EDIT,
  ADD_EDIT_CANCEL,
  PRODUCT_DELETE_CONFIRM,
  PRODUCT_DELETE_SUCCESS,
  PRODUCT_DELETE_CANCEL,
  PRODUCT_UP_VERSION,
  PRODUCT_UP_VERSION_START,
  PRODUCT_UP_VERSION_SUCCESS,
  PRODUCT_VIEW_OLD_VERSION_START,
  PRODUCT_VIEW_OLD_VERSION_SUCCESS,
  PRODUCT_ACTIVE,
  PRODUCT_ENABLE,
  PRODUCT_ACTIVE_ENABLE_START,
  PRODUCT_ACTIVE_ENABLE_SUCCESS,
  PRODUCT_CURRENT,
  PROGRAM_ITEM_ADD,
  PROGRAM_ITEM_ADD_CANCEL,
  PROGRAM_ITEM_SAVE,
  PROGRAM_ITEM_SAVE_SUCCESS,
  PROGRAM_ITEM_PREPARE,
  PROGRAM_ITEM_DELETE_CONFIRM,
  PROGRAM_ITEM_DELETE_SUCCESS,
  PROGRAM_ITEM_SHOW,
  PROGRAM_ITEM_EDIT,
  PROGRAM_ITEM_EDIT_START,
  PROGRAM_ITEM_EDIT_SUCCESS,

  PRODUCT_SCOPE_LIST,
  PRODUCT_SCOPE_LIST_SUCCESS,
  PRODUCT_SCOPE_LIST_ROWS,
  PRODUCT_SCOPE_LIST_CLICT,
  PRODUCT_SCOPE_ADD,
  PRODUCT_SCOPE_EDIT,
  PRODUCT_SCOPE_ADD_START,
  PRODUCT_SCOPE_ADD_SUCCESS,
  PRODUCT_SCOPE_DELETE,
  PRODUCT_SCOPE_DELETE_SUCCESS,
  // PRODUCT_SCOPE_RESULT_LIST,
  // PRODUCT_SCOPE_RESULT_LIST_SUCCESS,
  PRODUCT_SCOPE_RESULT_LIST_ROWS,
  // PRODUCT_SCOPE_RESULT_ADD_SUCCESS,
  PRODUCT_SCOPE_RESULT_DELETE,
  PRODUCT_SCOPE_RESULT_DELETE_SUCCESS,
  // ====================================
  // 检测范围新增检测项目
  ASYNC_ADD_TESTFLOW_SCOPE_START,
  ASYNC_ADD_TESTFLOW_SCOPE_SUCCESS,
  // 检测范围编辑检测项目
  ASYNC_EDIT_TESTFLOW_SCOPE_START,
  ASYNC_EDIT_TESTFLOW_SCOPE_SUCCESS,
  // 查询可添加结果项
  ASYNC_QUERY_SCOPE_RECORD_START,
  ASYNC_QUERY_SCOPE_RECORD_SUCCESS,
  // 新增结果项
  ASYNC_ADD_SCOPE_RECORD_START,
  ASYNC_ADD_SCOPE_RECORD_SUCCESS,
  // 编辑结果项
  EDIT_SCOPE_RECORD,
  ASYNC_EDIT_SCOPE_RECORD_START,
  ASYNC_EDIT_SCOPE_RECORD_SUCCESS,
  PRODUCT_SCOPE_CANCEL,
} from '../../../action/document/product/productAction';
import { replaceNodeById, removeNodeById, findParentNodeById, AddKeyForData } from '../../../util/treeUtils';


export default function Product(state = fromJS({
  isLoading: false,
  editType: '',
  categoryData: [],
  selectedItemKey: [],
  productData: [],
  preparedItems: [],
  preparedKeys: [],
  preparedProgramKeys: [],
  currentItem: {},
  preparedPrograms: [],
  modalTitle: '',
  modalInformation: '',
  oldVersions: [],
  needReload: '',
  productScopeData: [],//检测范围data
  productSRows: [],//检测范围rows
  productSRowKeys: [],//检测范围rowkeys
  handleType: '',//弹框
  productSClick: {},//检测范围 点击项
  productSResultData: [],//检测范围 结果项 data
  productSResultRows: [],//检测范围 结果项 rows
  productSResultRowKeys: [],//检测范围 结果项 rowkeys
}), action){
  switch(action.type){
    case CATEGORY_MANAGEMENT_DATA_LOAD:
    case PRODUCT_DATA_LOAD:
    case PRODUCT_SAVE:
    case PROGRAM_ITEM_SAVE:
    case PRODUCT_UP_VERSION_START:
    case PRODUCT_ACTIVE_ENABLE_START:
    case PROGRAM_ITEM_EDIT_START:
    case PRODUCT_SCOPE_LIST:
    case PRODUCT_SCOPE_ADD_START:
    case PRODUCT_SCOPE_DELETE:
    // case PRODUCT_SCOPE_RESULT_LIST:
    case PRODUCT_SCOPE_RESULT_DELETE:
    case ASYNC_ADD_TESTFLOW_SCOPE_START:
    case ASYNC_EDIT_TESTFLOW_SCOPE_START:
    case ASYNC_ADD_SCOPE_RECORD_START:
    case ASYNC_EDIT_SCOPE_RECORD_START:
      return state.set('isLoading', true);
    case CATEGORY_MANAGEMENT_DATA_LOAD_SUCCESS :
      let rootNode = action.categoryInfo;
      rootNode.subordinate = action.categoryData;
      return state.set('isLoading', false).set('categoryData', [rootNode]).set('selectedItemKey', rootNode.subordinate && rootNode.subordinate.length > 0 ? rootNode.subordinate[0].id : []).set('preparedItems',[]).set('preparedPrograms',[]);
    case PRODUCT_DATA_LOAD_SUCCESS:
      let productData = action.receipt;
      let selectedItemKey = action.selectedItemKey
      return state.set('productData', productData ? productData : {}).set('selectedItemKey', selectedItemKey).set('isLoading', false).set('preparedItems', []).set('preparedKeys', []).set('needReload', false).set('preparedPrograms',[]).set('currentItem', []);
    case PRODUCT_ADD:
      return state.set('editType', '新增').set('isLoading', true);
    case PRODUCT_SAVE_SUCCESS:
      let et = state.get('editType');
      let savedItems = action.receipt;
      let result = [];
      if(et === '新增'){
         result = state.get('productData').concat(savedItems);
      }else if(et === '编辑'){
        replaceNodeById(state.get('productData'), 'id', savedItems);
        result = state.get('productData');
      }
      return state.set('editType', '').set('isLoading', false).set('productData', result);
    case PRODUCT_PREPARE:
      let preparedItems = action.preparedItems;
      let preparedKeys = action.preparedKeys;
      return state.set('preparedItems', preparedItems).set('preparedKeys', preparedKeys);
    case PRODUCT_EDIT:
      return state.set('editType', '编辑').set('isLoading', true);
    case ADD_EDIT_CANCEL:
      return state.set('editType', '').set('isLoading', false);
    case PRODUCT_DELETE_CONFIRM:
      return state.set('editType', '').set('isLoading', true);
    case PRODUCT_DELETE_SUCCESS:
      let removeIds = action.removedIds;
      removeNodeById(state.get('productData'), 'id', removeIds);
      return state.set('isLoading', false).set('currentItem', []).set('preparedItems', []).set('preparedKeys', []).set('needReload', true);
    case PRODUCT_DELETE_CANCEL:
      return state.set('editType', '').set('isLoading', false);
    case PRODUCT_UP_VERSION:
      return state.set('editType', 'upversion').set('isLoading', true).set('modalTitle', '产品升版').set('modalInformation', '确定要为当前产品升级版本？');
    case PRODUCT_UP_VERSION_SUCCESS:
      let newVersion = action.newVersion;
      let oldVersion = [action.oldVersion];
      removeNodeById(state.get('productData'), 'id', oldVersion);
      state.get('productData').push(newVersion[0]);
      return state.set('editType', '').set('isLoading', false)
    case PRODUCT_VIEW_OLD_VERSION_START:
      return state.set('editType', 'oldversion').set('isLoading', true);
    case PRODUCT_VIEW_OLD_VERSION_SUCCESS:
      let oldVersions = action.oldVersions;
      return state.set('oldVersions', oldVersions);
    case PRODUCT_ACTIVE:
      return state.set('editType', 'activated_disabled').set('isLoading', true).set('modalTitle', '产品激活').set('modalInformation', '确定要激活当前版本产品？');
    case PRODUCT_ENABLE:
      return state.set('editType', 'activated_disabled').set('isLoading', true).set('modalTitle', '产品禁用').set('modalInformation', '确定要禁用当前版本产品？');
    case PRODUCT_ACTIVE_ENABLE_SUCCESS:
      let active_enable_item = action.newVersion;
      replaceNodeById(state.get('productData'), 'id', active_enable_item);
      return state.set('editType', '').set('isLoading', false);
    case PRODUCT_CURRENT:
      // 表格点击项变化时才需要清空子表勾选对象
      let currentItem = action.currentItem;
      if(state.get('currentItem') === currentItem){
        return state.set('currentItem', currentItem);
      }
      return state.set('currentItem', currentItem).set('preparedPrograms', []);
    case PROGRAM_ITEM_PREPARE:
      let preparedTestProgram =  Array.from(new Set(action.preparedPrograms));
      return state.set('preparedPrograms', preparedTestProgram).set('preparedProgramKeys', action.preparedProgramKeys);
    case PROGRAM_ITEM_ADD:
      return state.set('editType', '新增检测方案').set('isLoading', true);
    case PROGRAM_ITEM_ADD_CANCEL:
      return state.set('editType', '').set('isLoading', false);
    case PROGRAM_ITEM_SAVE_SUCCESS:
      let savedTestProgram = action.receipt;
      let addProduct = state.get('currentItem');
      if(addProduct.productTest){
        addProduct.productTest = addProduct.productTest.concat(savedTestProgram);
        return state.set('editType', '').set('isLoading', false);
      }
      addProduct.productTest = savedTestProgram;
      return state.set('editType', '').set('isLoading', false);
    case PROGRAM_ITEM_SHOW:
      return state.set('editType', 'programshow');
    case PROGRAM_ITEM_DELETE_CONFIRM:
      return state.set('editType', '').set('isLoading', true);
    case PROGRAM_ITEM_DELETE_SUCCESS:
      removeIds = action.removedIds;
      let pid = state.get('preparedPrograms')[0].product.id;
      let parentItem = findParentNodeById(state.get('productData'), 'id', pid);
      removeNodeById(parentItem.productTest, 'id', removeIds);
      return state.set('isLoading', false).set('preparedPrograms', []);
    case PROGRAM_ITEM_EDIT:
      return state.set('editType', '编辑检测方案');
    case PROGRAM_ITEM_EDIT_SUCCESS:
      let updateProgram = action.receipt;
      let updatePid = action.pid;
      let updateParentItem = findParentNodeById(state.get('productData'), 'id', updatePid);
      replaceNodeById(updateParentItem.productTest, 'id', updateProgram);
      return state.set('editType', '').set('isLoading', false);
    // 新修改 检测范围
    // 检测范围 列表
    case PRODUCT_SCOPE_LIST_SUCCESS:
      let productScopeData = action.data;
      for(let i = 0; i < productScopeData.length; i++){
        if(productScopeData[i].productTestScopeResult && productScopeData[i].productTestScopeResult.length > 0){
          productScopeData[i].productTestScopeResult = productScopeData[i].productTestScopeResult.map((item) => {
            item.key = item.id + '';
            return item;
          });
        }
      }
      return state.set('isLoading', false).set('productScopeData', productScopeData);
    // 列表 rows rowKeys
    case PRODUCT_SCOPE_LIST_ROWS:
      return state.set('productSRows', action.rows).set('productSRowKeys', action.rowKeys)
    // 获取检测项目 点击项
    case PRODUCT_SCOPE_LIST_CLICT:
      return state.set('productSClick', action.record)
    // 检测范围新增、修改
    case PRODUCT_SCOPE_ADD:
      return state.set('isLoading', true).set('handleType', '添加');
    case PRODUCT_SCOPE_EDIT:
      return state.set('isLoading', true).set('handleType', '编辑');
    case PRODUCT_SCOPE_ADD_SUCCESS:
      let productSAction = action.data;
      let productSData = state.get('productScopeData');
      if (productSAction.length) {
        productSAction.map(item => {
          return productSData.unshift(item);
        })
      };
      return state.set('isLoading', false).set('productScopeData', productSData)
    // 检测范围 删除
    case PRODUCT_SCOPE_DELETE_SUCCESS:
      let del = action.del;
      removeNodeById(state.get('productScopeData'), 'id', del);
      return state.set('isLoading', false).set('productSRows', []).set('productSRowKeys', []).set('productSClick', {})
    // 检测范围 结果项 列表
    // case PRODUCT_SCOPE_RESULT_LIST_SUCCESS:
    //   return state.set('isLoading', false).set('productSResultData', action.data)
    // 列表 结果项 rows rowKeys
    case PRODUCT_SCOPE_RESULT_LIST_ROWS:
      return state.set('productSResultRows', action.rows).set('productSResultRowKeys', action.rowKeys)
    // 检测范围 结果项 删除
    case PRODUCT_SCOPE_RESULT_DELETE_SUCCESS:
      removeNodeById(action.productTestFlow.productTestScopeResult, 'id', action.del);
      return state.set('isLoading', false);
    // ===============================
    case ASYNC_ADD_TESTFLOW_SCOPE_SUCCESS:
      let testFlowScope = action.data;
      let newTestFlowScope = state.get('productScopeData').concat(testFlowScope);
      return state.set('productScopeData', newTestFlowScope).set('handleType', '').set('isLoading', false);
    case ASYNC_EDIT_TESTFLOW_SCOPE_SUCCESS:
      testFlowScope = action.data;
      testFlowScope[0].key = testFlowScope[0].id + '';
      replaceNodeById(state.get('productScopeData'), 'id', testFlowScope);
      return state.set('handleType', '').set('isLoading', false);
    case ASYNC_QUERY_SCOPE_RECORD_START:
      return state.set('isLoading', true).set('handleType', '新增检测范围结果项');
    case ASYNC_QUERY_SCOPE_RECORD_SUCCESS:
      let scopeRecord = action.data;
      return state.set('productSResultData', scopeRecord).set('isLoading', false);
    case EDIT_SCOPE_RECORD:
      return state.set('isLoading', true).set('handleType', '编辑检测范围结果项');
    case PRODUCT_SCOPE_CANCEL:
      return state.set('isLoading', false).set('handleType', '');
    case ASYNC_ADD_SCOPE_RECORD_SUCCESS:
      let addScopeRecords = action.data;
      state.get('productSClick').productTestScopeResult = state.get('productSClick').productTestScopeResult.concat(addScopeRecords);
      AddKeyForData(state.get('productSClick').productTestScopeResult);
      return state.set('isLoading', false).set('handleType', '');
    case ASYNC_EDIT_SCOPE_RECORD_SUCCESS:
    let editScopeRecords = action.data;
    editScopeRecords = AddKeyForData(editScopeRecords);
    replaceNodeById(state.get('productSClick').productTestScopeResult, 'id', editScopeRecords);
    return state.set('isLoading', false).set('handleType', '');
    default :
      return state;
  }
}
