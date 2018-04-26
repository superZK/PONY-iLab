import {fromJS} from 'immutable';
import {
  CATEGORY_MANAGEMENT_DATA_LOAD,
  CATEGORY_MANAGEMENT_DATA_LOAD_SUCCESS,
  TEST_ITEM_DATA_LOAD,
  TEST_ITEM_DATA_LOAD_SUCCESS,
  TEST_ITEM_ADD,
  TEST_ITEM_SAVE,
  TEST_ITEM_SAVE_SUCCESS,
  TEST_ITEM_PREPARE,
  TEST_ITEM_EDIT,
  ADD_EDIT_CANCEL,
  TEST_ITEM_DELETE_CONFIRM,
  TEST_ITEM_DELETE_SUCCESS,
  TEST_ITEM_DELETE_CANCEL,
  TEST_ITEM_UP_VERSION,
  TEST_ITEM_UP_VERSION_START,
  TEST_ITEM_UP_VERSION_SUCCESS,
  TEST_ITEM_VIEW_OLD_VERSION_START,
  TEST_ITEM_VIEW_OLD_VERSION_SUCCESS,
  TEST_ITEM_ACTIVE,
  TEST_ITEM_ENABLE,
  TEST_ITEM_ACTIVE_ENABLE_START,
  TEST_ITEM_ACTIVE_ENABLE_SUCCESS,
  TEST_ITEM_CURRENT,
  RECORD_ITEM_PREPARE,
  RECORD_ITEM_ADD,
  RECORD_ITEM_ADD_CANCEL,
  RECORD_ITEM_EDIT,
  RECORD_ITEM_EDIT_SAVE,
  RECORD_ITEM_EDIT_SAVE_SUCCESS,
  RECORD_ITEM_DELETE_CONFIRM,
  RECORD_ITEM_DELETE_SUCCESS,
} from '../../../action/document/testItems/testItemsAction';
import { findNodeById, replaceNodeById, removeNodeById, analysisDataIndex } from '../../../util/treeUtils';

export default function TestItems(state = fromJS({
  isLoading: false,
  categoryData: [],
  selectedItemKey: [],
  itemData: [],
  preparedItems: [],
  preparedKeys: [],
  preparedRecordKeys: [],
  editType: '',
  currentItem: {},
  preparedRecords: [],
  expandedItemDatas: [],
  modalTitle: '',
  modalInformation: '',
  oldVersions: [],
  needReload: false,
}), action){
  switch(action.type){
    case CATEGORY_MANAGEMENT_DATA_LOAD:
    case TEST_ITEM_SAVE:
    case TEST_ITEM_DATA_LOAD:
    case RECORD_ITEM_EDIT_SAVE:
    case TEST_ITEM_UP_VERSION_START:
    case TEST_ITEM_ACTIVE_ENABLE_START:
      return state.set('isLoading', true);
    case CATEGORY_MANAGEMENT_DATA_LOAD_SUCCESS :
      let rootNode = action.categoryInfo;
      rootNode.subordinate = action.categoryData;
      return state.set('isLoading', false).set('categoryData', [rootNode]).set('selectedItemKey', rootNode.subordinate && rootNode.subordinate.length > 0 ? rootNode.subordinate[0].id : []).set('preparedItems',[]).set('preparedRecords',[]).set('currentItem', {});
    case TEST_ITEM_DATA_LOAD_SUCCESS:
      let itemData = action.receipt;
      let selectedItemKey = action.selectedItemKey
      return state.set('itemData', itemData || {}).set('selectedItemKey', selectedItemKey).set('isLoading', false).set('preparedItems', []).set('currentItem', {}).set('needReload', false).set('preparedRecords',[]);
    case TEST_ITEM_ADD:
      return state.set('editType', '新增').set('isLoading', true);
    case TEST_ITEM_SAVE_SUCCESS:
      let et = state.get('editType');
      let savedItems = action.receipt;
      let result = [];
      if(et === '新增'){
        result = state.get('itemData').concat(savedItems);
      }else if(et === '编辑'){
        replaceNodeById(state.get('itemData'), 'id', savedItems);
        result = state.get('itemData');
      }
      return state.set('editType', '').set('isLoading', false).set('itemData' ,result);
    case TEST_ITEM_PREPARE:
      return state.set('preparedItems', action.preparedItems).set('preparedKeys', action.preparedKeys);
    case TEST_ITEM_EDIT:
      return state.set('editType', '编辑').set('isLoading', true);
    case ADD_EDIT_CANCEL:
      return state.set('editType', '').set('isLoading', false);
    case TEST_ITEM_DELETE_CONFIRM:
      return state.set('editType', '').set('isLoading', true);
    case TEST_ITEM_DELETE_SUCCESS:
      let removeIds = action.removedIds;
      removeNodeById(state.get('itemData'), 'id', removeIds);
      return state.set('isLoading', false).set('preparedItems', []).set('needReload', true);
    case TEST_ITEM_DELETE_CANCEL:
      return state.set('editType', '').set('isLoading', false);
    case TEST_ITEM_UP_VERSION:
      return state.set('editType', 'upversion').set('isLoading', true).set('modalTitle', '检测项目升版').set('modalInformation', '确定要为当前检测项目升级版本？');
    case TEST_ITEM_UP_VERSION_SUCCESS:
      let newVersion = action.newVersion;
      let oldVersionId = [action.oldVersionId];
      removeNodeById(state.get('itemData'), 'id', oldVersionId);
      state.get('itemData').push(newVersion[0]);
      return state.set('editType', '').set('isLoading', false);
    case TEST_ITEM_VIEW_OLD_VERSION_START:
      return state.set('editType', 'oldversion').set('isLoading', true).set('currentItem', {});
    case TEST_ITEM_VIEW_OLD_VERSION_SUCCESS:
      let oldVersions = action.oldVersions;
      return state.set('oldVersions', oldVersions);
    case TEST_ITEM_ACTIVE:
      return state.set('editType', 'activated_disabled').set('isLoading', true).set('modalTitle', '检测项目激活').set('modalInformation', '确定要激活当前版本检测项目？');
    case TEST_ITEM_ENABLE:
      return state.set('editType', 'activated_disabled').set('isLoading', true).set('modalTitle', '检测项目禁用').set('modalInformation', '确定要禁用当前版本检测项目？');
    case TEST_ITEM_ACTIVE_ENABLE_SUCCESS:
      let active_enable_item = action.newVersion;
      replaceNodeById(state.get('itemData'), 'id', active_enable_item);
      return state.set('editType', '').set('isLoading', false);
    case TEST_ITEM_CURRENT:
      let currentItem = action.currentItem;
      return state.set('currentItem', currentItem).set('preparedRecords',[]);
    case RECORD_ITEM_PREPARE:
      let preparedResults =  Array.from(new Set(action.preparedRecords));
      return state.set('preparedRecords', preparedResults).set('preparedRecordKeys', action.preparedRecordKeys);
    case RECORD_ITEM_ADD:
      return state.set('editType', '新增检测项目结果项').set('isLoading', true);
    case RECORD_ITEM_ADD_CANCEL:
      return state.set('editType', '').set('isLoading', false);
    case RECORD_ITEM_EDIT:
      return state.set('editType', '编辑检测项目结果项');
    case RECORD_ITEM_EDIT_SAVE_SUCCESS:
      let ret = state.get('editType');
      let pid = action.pid;
      let savedRecordItem = action.receipt || [];
      // 当名称相同，后台返回的是空数组的时候，不将其添加到resultRecord
      if(savedRecordItem && savedRecordItem.length !== 1){
        return state.set('editType', '').set('isLoading', false);
      }
      if(ret === '新增检测项目结果项'){
        let addPrepared = state.get('currentItem');
        if(addPrepared.resultRecordList === null){
          addPrepared.resultRecordList = savedRecordItem;
        }
        addPrepared.resultRecordList.push(savedRecordItem[0]);
      }else if(ret === '编辑检测项目结果项'){
        let parentItem = findNodeById(state.get('itemData'), 'id', 'resultRecord', pid);
        replaceNodeById(parentItem.resultRecordList, 'id', savedRecordItem);
      }
      return state.set('editType', '').set('isLoading', false);
    case RECORD_ITEM_DELETE_CONFIRM:
      return state.set('editType', '').set('isLoading', true);
    case RECORD_ITEM_DELETE_SUCCESS:
      removeIds = action.removedIds;
      pid = analysisDataIndex(state.get('preparedRecords')[0], 'testItem.id');
      let parentItem = findNodeById(state.get('itemData'), 'id', 'resultRecord', pid);
      removeNodeById(parentItem.resultRecordList, 'id', removeIds);
      return state.set('isLoading', false).set('preparedRecords', []).set('currentItem', parentItem);
    default :
      return state;
  }
}
