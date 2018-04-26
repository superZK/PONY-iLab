import {fromJS} from 'immutable';
import {
  TEST_FLOW_DATA_LOAD,
  TEST_FLOW_DATA_LOAD_SUCCESS,
  TEST_FLOW_ADD_START,
  TEST_FLOW_ADD_CANCEL,
  TEST_FLOW_ADD,
  TEST_FLOW_ADD_SUCCESS,
  TEST_FLOW_ADD_BY_TABLE,
  TEST_FLOW_ADD_BY_TABLE_SUCCESS,
  TEST_FLOW_PREPARE,
  TEST_FLOW_DELETE_CONFIRM,
  TEST_FLOW_DELETE_SUCCESS,
  TEST_FLOW_DELETE_CANCEL,
  TEST_FLOW_EDIT,
  TEST_FLOW_EDIT_START,
  TEST_FLOW_EDIT_SUCCESS,
  RECORD_ITEM_STANDRAD_ADD,
  RECORD_ITEM_STANDRAD_ADD_SAVE,
  RECORD_ITEM_STANDRAD_ADD_SAVE_SUCCESS,
  TEST_FLOW_CURRENT,
  RECORD_ITEM_STANDRAD_PREPARE,
  RECORD_ITEM_STANDRAD_DELETE_CONFIRM,
  RECORD_ITEM_STANDRAD_DELETE_SUCCESS,
  RECORD_ITEM_STANDRAD_EDIT,
  RECORD_ITEM_STANDRAD_EDIT_SAVE,
  RECORD_ITEM_STANDRAD_EDIT_SAVE_SUCCESS,
  RESET_CURRENTITEM,
} from '../../../action/document/product/programEditDialogAction';
import { findNodeById, replaceNodeById, removeNodeById, findParentNodeById, AddKeyForData } from '../../../util/treeUtils';

export default function ProgramEditDialog(state = fromJS({
  testFlowData: [],
  handleType: '',
  preparedTestFlows: [],
  preparedTestFlowKeys: [],
  preparedRecordKeys: [],
  currentItem: {},
  preparedRecords: [],
  resultAddDataSource:[],
}), action){
  switch(action.type){
    case TEST_FLOW_DATA_LOAD:
    case TEST_FLOW_DELETE_CANCEL:
      return state.set('handleType', '');
    case TEST_FLOW_DATA_LOAD_SUCCESS:
      let testFlow = action.receipt;
      return state.set('testFlowData', testFlow).set('preparedRecords',[]).set('preparedTestFlows', []);
    case TEST_FLOW_ADD_START:
      return state.set('handleType', '添加');
    case TEST_FLOW_ADD_CANCEL:
      return state.set('handleType', '');
    case TEST_FLOW_ADD:
    case TEST_FLOW_ADD_BY_TABLE:
      return state.set('handleType', '添加');
    case TEST_FLOW_ADD_SUCCESS:
      let addTestFlow = action.receipt;
      let newTestFlow = state.get('testFlowData').concat(addTestFlow);
      return state.set('handleType', '').set('testFlowData', newTestFlow);
    case TEST_FLOW_ADD_BY_TABLE_SUCCESS:
      let addTestFlowByTable = action.receipt;
      let newTestFlowByTable = state.get('testFlowData').concat(addTestFlowByTable);
      return state.set('handleType', '').set('testFlowData', newTestFlowByTable);
    case TEST_FLOW_PREPARE:
      let preparedTestFlows = action.preparedTestFlows;
      return state.set('preparedTestFlows', preparedTestFlows).set('preparedTestFlowKeys', action.preparedTestFlowKeys);
    case TEST_FLOW_DELETE_CONFIRM:
      return state.set('handleType', 'delete');
    case TEST_FLOW_DELETE_SUCCESS:
      let deleteIds = action.removedIds;
      removeNodeById(state.get('testFlowData'), 'id', deleteIds);
      return state.set('preparedTestFlows', []).set('handleType', '');
    case TEST_FLOW_EDIT:
    case TEST_FLOW_EDIT_START:
      return state.set('handleType', '编辑');
    case TEST_FLOW_EDIT_SUCCESS:
      let updateTestFlow = action.receipt;
      replaceNodeById(state.get('testFlowData'), 'id', updateTestFlow);
      return state.set('handleType', '');
    case RECORD_ITEM_STANDRAD_ADD:
      let AddDataSource = action.addResultDateSource;
      return state.set('handleType', 'recordadd').set('resultAddDataSource', AddDataSource);
    case RECORD_ITEM_STANDRAD_ADD_SAVE:
      return state.set('handleType', 'recordadd');
    case RECORD_ITEM_STANDRAD_ADD_SAVE_SUCCESS:
      let addResultRecords = action.receipt;
      let newCurrentItem = state.get('currentItem');
      newCurrentItem.resultRecordStandard = newCurrentItem.resultRecordStandard ? newCurrentItem.resultRecordStandard : [];
      newCurrentItem.resultRecordStandard = newCurrentItem.resultRecordStandard.concat(addResultRecords);
      return state.set('handleType', '').set('currentItem', newCurrentItem).set('preparedRecords', []);
    case TEST_FLOW_CURRENT:
      let currentItem = action.currentItem;
      return state.set('currentItem', currentItem).set('preparedRecords',[]);
    case RECORD_ITEM_STANDRAD_PREPARE:
      let preparedResults =  Array.from(new Set(action.preparedRecords));
      return state.set('preparedRecords', preparedResults).set('preparedRecordKeys', action.preparedRecordKeys);
    case RECORD_ITEM_STANDRAD_DELETE_CONFIRM:
      return state.set('handleType', '');
    case RECORD_ITEM_STANDRAD_DELETE_SUCCESS:
      let removeIds = action.removedIds;
      // let pid = state.get('preparedRecords')[0].productTestFlowId;
      // let parentItem = findParentNodeById(state.get('testFlowData'), 'id', pid);
      let parentItem = state.get('currentItem');
      removeNodeById(parentItem.resultRecordStandard, 'id', removeIds);
      return state.set('preparedRecords', []);
    case RECORD_ITEM_STANDRAD_EDIT:
      return state.set('handleType', 'recordupdate');
    case RECORD_ITEM_STANDRAD_EDIT_SAVE:
      return state.set('handleType', 'recordupdate');
    case RECORD_ITEM_STANDRAD_EDIT_SAVE_SUCCESS:
      let updatePid = action.pid;
      let updateSavedRecordItem = action.receipt;
      let updateParentItem = findNodeById(state.get('testFlowData'), 'id', 'resultRecordStandard', updatePid);
      replaceNodeById(updateParentItem.resultRecordStandard, 'id', updateSavedRecordItem);
      return state.set('handleType', '');
    case RESET_CURRENTITEM:
      return state.set('currentItem', {});
    default :
      return state;
  }
}
