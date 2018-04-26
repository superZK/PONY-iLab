import {fromJS} from 'immutable';
import moment from 'moment';
import {
  CATEGORY_MANAGEMENT_DATA_LOAD,
  CATEGORY_MANAGEMENT_DATA_LOAD_SUCCESS,
  TEST_STANDARD_DATA_LOAD,
  TEST_STANDARD_DATA_LOAD_SUCCESS,
  TEST_STANDARD_ADD,
  TEST_STANDARD_SAVE,
  TEST_STANDARD_SAVE_SUCCESS,
  TEST_STANDARD_PREPARE,
  TEST_STANDARD_EDIT,
  ADD_EDIT_CANCEL,
  TEST_STANDARD_DELETE_CONFIRM,
  TEST_STANDARD_DELETE_SUCCESS,
  TEST_STANDARD_DELETE_CANCEL,
  TEST_STANDARD_UP_VERSION,
  TEST_STANDARD_UP_VERSION_START,
  TEST_STANDARD_UP_VERSION_SUCCESS,
  TEST_STANDARD_VIEW_OLD_VERSION_START,
  TEST_STANDARD_VIEW_OLD_VERSION_SUCCESS,
  TEST_STANDARD_ACTIVE,
  TEST_STANDARD_ENABLE,
  TEST_STANDARD_ACTIVE_ENABLE_START,
  TEST_STANDARD_ACTIVE_ENABLE_SUCCESS,
  TEST_STANDARD_DISCARD,
  TEST_STANDARD_DISCARD_START,
  TEST_STANDARD_DISCARD_SUCCESS,
  QUERY_TEST_ITEM_LINKED_TEST_METHOD_START,
  QUERY_TEST_ITEM_LINKED_TEST_METHOD_SUCCESS,
} from '../../../action/document/testStandard/testStandardAction';
import { findNodeById, replaceNodeById, removeNodeById } from '../../../util/treeUtils';

export default function TestStandard(state = fromJS({
  isLoading: false,
  categoryData: [],
  selectedItemKey: [],
  standardData: [],
  preparedItems: [],
  preparedKeys: [],
  editType: '',
  standardLinkedTestItems: [],
  modalTitle: '',
  modalInformation: '',
  oldVersions: [],
  needReload: false,
}), action){
  switch(action.type){
    case CATEGORY_MANAGEMENT_DATA_LOAD:
    case TEST_STANDARD_DATA_LOAD:
    case TEST_STANDARD_SAVE:
    case TEST_STANDARD_UP_VERSION_START:
    case TEST_STANDARD_ACTIVE_ENABLE_START:
    case TEST_STANDARD_DISCARD_START:
    case QUERY_TEST_ITEM_LINKED_TEST_METHOD_START:
      return state.set('isLoading', true);
    case CATEGORY_MANAGEMENT_DATA_LOAD_SUCCESS :
      let rootNode = action.categoryInfo;
      rootNode.subordinate = action.categoryData;
      return state.set('isLoading', false).set('categoryData', [rootNode]).set('selectedItemKey', rootNode.subordinate && rootNode.subordinate.length > 0 ? rootNode.subordinate[0].id : []).set('standardLinkedTestItems', []).set('preparedItems',[]);
    case TEST_STANDARD_DATA_LOAD_SUCCESS:
      let standardData = action.receipt;
      let selectedItemKey = action.selectedItemKey
      return state.set('standardData', standardData ? standardData : {}).set('selectedItemKey', selectedItemKey).set('isLoading', false).set('preparedItems', []).set('needReload', false);
    case TEST_STANDARD_ADD:
      return state.set('editType', '新增').set('isLoading', true);
    case TEST_STANDARD_SAVE_SUCCESS:
      let et = state.get('editType');
      let savedItems = action.receipt;
      let result = [];
      if(savedItems[0].effectiveDate)
      savedItems[0].effectiveDate = moment(savedItems[0].effectiveDate).format('YYYY-MM-DD');
      if(savedItems[0].expiryDate)
      savedItems[0].expiryDate = moment(savedItems[0].expiryDate).format('YYYY-MM-DD');
      if(savedItems[0].publishDate)
      savedItems[0].publishDate = moment(savedItems[0].publishDate).format('YYYY-MM-DD');
      if(et === '新增'){
         result = state.get('standardData').concat(savedItems);
      }else if(et === '编辑'){
        replaceNodeById(state.get('standardData'), 'id', savedItems);
        result = state.get('standardData');
      }
      return state.set('editType', '').set('isLoading', false).set('standardData', result);
    case TEST_STANDARD_PREPARE:
      let preparedItems = action.preparedItems;
      return state.set('preparedItems', preparedItems).set('preparedKeys', action.preparedKeys);
    case TEST_STANDARD_EDIT:
      return state.set('editType', '编辑').set('isLoading', true);
    case ADD_EDIT_CANCEL:
      return state.set('editType', '').set('isLoading', false);
    case TEST_STANDARD_DELETE_CONFIRM:
      return state.set('editType', '').set('isLoading', true);
    case TEST_STANDARD_DELETE_SUCCESS:
      let removeIds = action.removedIds;
      removeNodeById(state.get('standardData'), 'id', removeIds);
      return state.set('isLoading', false).set('preparedItems', []).set('needReload', true);
    case TEST_STANDARD_DELETE_CANCEL:
      return state.set('editType', '').set('isLoading', false);
    case TEST_STANDARD_UP_VERSION:
      return state.set('editType', 'upversion').set('isLoading', true).set('modalTitle', '检测标准升版').set('modalInformation', '确定要为当前检测标准升级版本？');
    case TEST_STANDARD_UP_VERSION_SUCCESS:
      let newVersion = action.newVersion;
      let oldVersion = [action.oldVersion];
      removeNodeById(state.get('standardData'), 'id', oldVersion);
      if(newVersion[0].effectiveDate)
      newVersion[0].effectiveDate = moment(newVersion[0].effectiveDate).format('YYYY-MM-DD');
      if(newVersion[0].expiryDate)
      newVersion[0].expiryDate = moment(newVersion[0].expiryDate).format('YYYY-MM-DD');
      if(newVersion[0].publishDate)
      newVersion[0].publishDate = moment(newVersion[0].publishDate).format('YYYY-MM-DD');
      state.get('standardData').push(newVersion[0]);
      return state.set('editType', '').set('isLoading', false).set('preparedItems', []);
    case TEST_STANDARD_VIEW_OLD_VERSION_START:
      return state.set('editType', 'oldversion').set('isLoading', true);
    case TEST_STANDARD_VIEW_OLD_VERSION_SUCCESS:
      let oldVersions = action.oldVersions;
      return state.set('oldVersions', oldVersions);
    case TEST_STANDARD_ACTIVE:
      return state.set('editType', 'activated_disabled').set('isLoading', true).set('modalTitle', '检测标准激活').set('modalInformation', '确定要激活当前版本检测标准？');
    case TEST_STANDARD_ENABLE:
      return state.set('editType', 'activated_disabled').set('isLoading', true).set('modalTitle', '检测标准禁用').set('modalInformation', '确定要禁用当前版本检测标准？');
    case TEST_STANDARD_ACTIVE_ENABLE_SUCCESS:
      let active_enable_item = action.newVersion;
      replaceNodeById(state.get('standardData'), 'id', active_enable_item);
      return state.set('editType', '').set('isLoading', false);
    case TEST_STANDARD_DISCARD:
      return state.set('editType', 'discard').set('isLoading', true).set('modalTitle', '检测标准废弃').set('modalInformation', '注意：废弃状态不可更改!  确定要废弃当前版本检测标准？');
    case TEST_STANDARD_DISCARD_SUCCESS:
      let disCard = action.newVersion;
      replaceNodeById(state.get('standardData'), 'id', disCard);
      return state.set('editType', '').set('isLoading', false);
    case QUERY_TEST_ITEM_LINKED_TEST_METHOD_SUCCESS:
      let testItems = action.testItems;
      return state.set('standardLinkedTestItems', testItems).set('isLoading',false);
    default :
      return state;
  }
}
