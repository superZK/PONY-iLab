import {fromJS} from 'immutable';
import moment from 'moment';
import {
  CATEGORY_MANAGEMENT_DATA_LOAD,
  CATEGORY_MANAGEMENT_DATA_LOAD_SUCCESS,
  TEST_METHOD_DATA_LOAD,
  TEST_METHOD_DATA_LOAD_SUCCESS,
  TEST_METHOD_ADD,
  TEST_METHOD_SAVE,
  TEST_METHOD_SAVE_SUCCESS,
  TEST_METHOD_PREPARE,
  TEST_METHOD_EDIT,
  ADD_EDIT_CANCEL,
  TEST_METHOD_DELETE_CONFIRM,
  TEST_METHOD_DELETE_SUCCESS,
  TEST_METHOD_DELETE_CANCEL,
  TEST_METHOD_UP_VERSION,
  TEST_METHOD_UP_VERSION_START,
  TEST_METHOD_UP_VERSION_SUCCESS,
  TEST_METHOD_VIEW_OLD_VERSION_START,
  TEST_METHOD_VIEW_OLD_VERSION_SUCCESS,
  TEST_METHOD_ACTIVE,
  TEST_METHOD_ENABLE,
  TEST_METHOD_ACTIVE_ENABLE_START,
  TEST_METHOD_ACTIVE_ENABLE_SUCCESS,
  TEST_METHOD_DISCARD,
  TEST_METHOD_DISCARD_START,
  TEST_METHOD_DISCARD_SUCCESS,
  QUERY_TEST_ITEM_LINKED_TEST_METHOD_START,
  QUERY_TEST_ITEM_LINKED_TEST_METHOD_SUCCESS,
  UPLOAD_TEST_METHOD,
  UPLOAD_TEST_METHOD_START,
  UPLOAD_TEST_METHOD_SUCCESS,
} from '../../../action/document/testMethod/testMethodAction';
import { replaceNodeById, removeNodeById } from '../../../util/treeUtils';

export default function TestMethod(state = fromJS({
  isLoading: false,
  editType: '',
  categoryData: [],
  selectedItemKey: [],
  methodData: [],
  preparedItems: [],
  preparedKeys: [],
  methodLinkedTestItems: [],
  modalTitle: '',
  modalInformation: '',
  oldVersions: [],
  needReload: '',
  uploadData: [],
}), action){
  switch(action.type){
    case CATEGORY_MANAGEMENT_DATA_LOAD:
    case TEST_METHOD_DATA_LOAD:
    case TEST_METHOD_SAVE:
    case TEST_METHOD_UP_VERSION_START:
    case TEST_METHOD_ACTIVE_ENABLE_START:
    case TEST_METHOD_DISCARD_START:
    case QUERY_TEST_ITEM_LINKED_TEST_METHOD_START:
    case UPLOAD_TEST_METHOD_START:
      return state.set('isLoading', true);
    case CATEGORY_MANAGEMENT_DATA_LOAD_SUCCESS :
      let rootNode = action.categoryInfo;
      rootNode.subordinate = action.categoryData;
      return state.set('isLoading', false).set('categoryData', [rootNode]).set('selectedItemKey', rootNode.subordinate && rootNode.subordinate.length > 0 ? rootNode.subordinate[0].id : []).set('methodLinkedTestItems', []).set('preparedItems',[]);
    case TEST_METHOD_DATA_LOAD_SUCCESS:
      let methodData = action.receipt;
      let selectedItemKey = action.selectedItemKey
      return state.set('methodData', methodData ? methodData : {}).set('selectedItemKey', selectedItemKey).set('isLoading', false).set('preparedItems', []).set('needReload', false).set('methodLinkedTestItems', []);
    case TEST_METHOD_ADD:
      return state.set('editType', '新增').set('isLoading', true);
    case TEST_METHOD_SAVE_SUCCESS:
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
         result = state.get('methodData').concat(savedItems);
      }else if(et === '编辑'){
        replaceNodeById(state.get('methodData'), 'id', savedItems);
        result = state.get('methodData');
      }
      return state.set('editType', '').set('isLoading', false).set('methodData', result);
    case TEST_METHOD_PREPARE:
      let preparedItems = action.preparedItems;
      return state.set('preparedItems', preparedItems).set('preparedKeys', action.preparedKeys);
    case TEST_METHOD_EDIT:
      return state.set('editType', '编辑').set('isLoading', true);
    case ADD_EDIT_CANCEL:
      return state.set('editType', '').set('isLoading', false);
    case TEST_METHOD_DELETE_CONFIRM:
      return state.set('editType', '').set('isLoading', true);
    case TEST_METHOD_DELETE_SUCCESS:
      let removeIds = action.removedIds;
      removeNodeById(state.get('methodData'), 'id', removeIds);
      return state.set('isLoading', false).set('needReload', true).set('preparedItems', []);
    case TEST_METHOD_DELETE_CANCEL:
      return state.set('editType', '').set('isLoading', false);
    case TEST_METHOD_UP_VERSION:
      return state.set('editType', 'upversion').set('isLoading', true).set('modalTitle', '检测方法升版').set('modalInformation', '确定要为当前检测方法升级版本？');
    case TEST_METHOD_UP_VERSION_SUCCESS:
      let newVersion = action.newVersion;
      let oldVersion = [action.oldVersion];
      removeNodeById(state.get('methodData'), 'id', oldVersion);
      if(newVersion[0].effectiveDate)
      newVersion[0].effectiveDate = moment(newVersion[0].effectiveDate).format('YYYY-MM-DD');
      if(newVersion[0].expiryDate)
      newVersion[0].expiryDate = moment(newVersion[0].expiryDate).format('YYYY-MM-DD');
      if(newVersion[0].publishDate)
      newVersion[0].publishDate = moment(newVersion[0].publishDate).format('YYYY-MM-DD');
      state.get('methodData').push(newVersion[0]);
      return state.set('editType', '').set('isLoading', false).set('preparedItems', []);
    case TEST_METHOD_VIEW_OLD_VERSION_START:
      return state.set('editType', 'oldversion').set('isLoading', true).set('methodLinkedTestItems', []);
    case TEST_METHOD_VIEW_OLD_VERSION_SUCCESS:
      let oldVersions = action.oldVersions;
      return state.set('oldVersions', oldVersions);
    case TEST_METHOD_ACTIVE:
      return state.set('editType', 'activated_disabled').set('isLoading', true).set('modalTitle', '检测方法激活').set('modalInformation', '确定要激活当前版本检测方法？');
    case TEST_METHOD_ENABLE:
      return state.set('editType', 'activated_disabled').set('isLoading', true).set('modalTitle', '检测方法禁用').set('modalInformation', '确定要禁用当前版本检测方法？');
    case TEST_METHOD_ACTIVE_ENABLE_SUCCESS:
      let active_enable_item = action.newVersion;
      replaceNodeById(state.get('methodData'), 'id', active_enable_item);
      return state.set('editType', '').set('isLoading', false);
    case TEST_METHOD_DISCARD:
      return state.set('editType', 'discard').set('isLoading', true).set('modalTitle', '检测方法废弃').set('modalInformation', '确定要废弃当前版本检测方法？');
    case TEST_METHOD_DISCARD_SUCCESS:
      let disCard = action.newVersion;
      replaceNodeById(state.get('methodData'), 'id', disCard);
      return state.set('editType', '').set('isLoading', false);
    // 上传文件
    case UPLOAD_TEST_METHOD:
      return state.set('isLoading', true).set('editType', '上传文件')
    case UPLOAD_TEST_METHOD_SUCCESS:
      return state.set('isLoading', false).set('uploadData', action.data);
    case QUERY_TEST_ITEM_LINKED_TEST_METHOD_SUCCESS:
      let testItems = action.testItems;
      return state.set('methodLinkedTestItems', testItems).set('isLoading',false);
    default :
      return state;
  }
}
