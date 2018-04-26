import {fromJS} from 'immutable';
import {
  CATEGORY_MANAGEMENT_DATA_LOAD,
  CATEGORY_MANAGEMENT_DATA_LOAD_SUCCESS,
  UNIT_DATA_LOAD,
  UNIT_DATA_LOAD_SUCCESS,
  UNIT_ITEM_ADD,
  UNIT_ITEM_SAVE,
  UNIT_ITEM_SAVE_SUCCESS,
  UNIT_ITEM_PREPARE,
  UNIT_ITEM_EDIT,
  UNIT_ITEM_DELETE_CONFIRM,
  UNIT_ITEM_DELETE_SUCCESS,
  UNIT_ITEM_CURRENT,
  TRANSFORM_UNIT_ITEM_PREPARE,
  TRANSFORM_UNIT_ITEM_ADD,
  TRANSFORM_UNIT_ITEM_SAVE,
  TRANSFORM_UNIT_ITEM_SAVE_SUCCESS,
  TRANSFORM_UNIT_ITEM_EDIT,
  TRANSFORM_UNIT_ITEM_EDIT_SAVE,
  TRANSFORM_UNIT_ITEM_EDIT_SAVE_SUCCESS,
  TRANSFORM_UNIT_ITEM_DELETE_CONFIRM,
  TRANSFORM_UNIT_ITEM_DELETE_SUCCESS,
  UNIT_ITEM_EDIT_CANCEL,
  TRANSFORM_UNIT_ITEM_ADD_CANCEL,
  TRANSFORM_UNIT_ITEM_EDIT_CANCEL,
  TRANSFORM_UNIT_ITEM_DELETE_CANCEL,
} from '../../../action/document/unit/unitAction';
import { findNodeById, replaceNodeById, removeNodeById } from '../../../util/treeUtils';


export default function MeasureUnitTable(state = fromJS({
  isLoading: false,
  categoryData: [],
  preparedUnits: [],
  preparedKeys: [],
  preparedTransformKeys: [],
  preparedTransforms: [],
  editType: '',
  unitData: [],
  selecctedUnitKey: [],
  currentUnit: {},
  needReload: false,
}), action){
  switch(action.type){
    case CATEGORY_MANAGEMENT_DATA_LOAD:
    case UNIT_ITEM_SAVE:
    case TRANSFORM_UNIT_ITEM_SAVE:
    case TRANSFORM_UNIT_ITEM_EDIT_SAVE:
    case UNIT_DATA_LOAD:
      return state.set('isLoading', true);
    case CATEGORY_MANAGEMENT_DATA_LOAD_SUCCESS :
      let rootNode = action.categoryInfo;
      rootNode.subordinate = action.categoryData;
      return state.set('isLoading', false).set('categoryData', [rootNode]).set('preparedUnits', []).set('preparedTransforms', []).set('currentUnit', {}).set('selecctedUnitKey', rootNode.subordinate && rootNode.subordinate.length > 0 ? rootNode.subordinate[0].id : []);
    case UNIT_DATA_LOAD_SUCCESS:
      let unitData = action.receipt;
      let selecctedUnitKey = action.selecctedUnitKey;
      return state.set('unitData', unitData).set('selecctedUnitKey', selecctedUnitKey).set('isLoading', false).set('preparedUnits', []).set('preparedTransforms', []).set('needReload', false).set('currentUnit', {});
    case UNIT_ITEM_PREPARE:
      let preparedUnits = action.preparedUnits;
      return state.set('preparedUnits', preparedUnits).set('preparedKeys', action.preparedKeys);
    case UNIT_ITEM_CURRENT:
      let currentUnits = action.currentUnit;
      return state.set('currentUnit', currentUnits).set('preparedTransforms',[]);
    case TRANSFORM_UNIT_ITEM_PREPARE:
      let preparedTrans = action.preparedTransforms;
      return state.set('preparedTransforms', preparedTrans).set('preparedTransformKeys', action.preparedTransformKeys);
    case UNIT_ITEM_EDIT:
      return state.set('editType', '编辑');
    case TRANSFORM_UNIT_ITEM_EDIT:
      return state.set('editType', '度量单位转换关系编辑');
    case UNIT_ITEM_EDIT_CANCEL:
      return state.set('editType', '').set('isLoading', false);
    case UNIT_ITEM_ADD:
      return state.set('editingUnit', {}).set('editType', '新增').set('isLoading', true);
    case TRANSFORM_UNIT_ITEM_ADD:
      return state.set('editingUnit', {}).set('editType', 'transadd').set('isLoading', true);
    case TRANSFORM_UNIT_ITEM_ADD_CANCEL:
      return state.set('editingUnit', {}).set('editType', '').set('isLoading', false);
    case TRANSFORM_UNIT_ITEM_EDIT_CANCEL:
      return state.set('editingUnit', {}).set('editType', '').set('isLoading', false);
    case TRANSFORM_UNIT_ITEM_DELETE_CANCEL:
      return state.set('editingUnit', {}).set('editType', '').set('isLoading', false);
    case UNIT_ITEM_SAVE_SUCCESS:
      let et = state.get('editType');
      let savedUnits = action.receipt;
      let result = [];
      if(et === '新增'){
        result = state.get('unitData').concat(savedUnits);
      }else if(et === '编辑'){
        replaceNodeById(state.get('unitData'), 'id', savedUnits);
        result = state.get('unitData');
      }
      return state.set('editType', '').set('isLoading', false).set('unitData' ,result);
    case TRANSFORM_UNIT_ITEM_SAVE_SUCCESS:
      let savedTransformUnit = action.receipt;
      let addPrepared = state.get('currentUnit');
      if(addPrepared.conversUnit){
        addPrepared.conversUnit = addPrepared.conversUnit.concat(savedTransformUnit);
        return state.set('editType', '').set('isLoading', false);
      }
      addPrepared.conversUnit = savedTransformUnit;
      return state.set('editType', '').set('isLoading', false);
    case TRANSFORM_UNIT_ITEM_EDIT_SAVE_SUCCESS:
      let unitcode = action.unitcode;
      let parentNode = findNodeById(state.get('unitData'), 'id', 'conversUnit', unitcode);
      replaceNodeById(parentNode.conversUnit, 'id', action.receipt);
      result = state.get('unitData');
      return state.set('editType', '').set('isLoading', false).set('unitData', result);
    case UNIT_ITEM_DELETE_CONFIRM:
      return state.set('editType', '').set('isLoading', true);
    case TRANSFORM_UNIT_ITEM_DELETE_CONFIRM:
      return state.set('editType', '').set('isLoading', true);
    case UNIT_ITEM_DELETE_SUCCESS:
      let removeIds = action.removedIds;
      removeNodeById(state.get('unitData'), 'id', removeIds);
      return state.set('isLoading', false).set('preparedUnits', []).set('needReload', true);
    case TRANSFORM_UNIT_ITEM_DELETE_SUCCESS:
      removeIds = action.removedIds;
      if(!removeIds || removeIds.length === 0)
        return state;

      state.get('unitData').forEach( u => removeNodeById(u.conversUnit, 'id', removeIds));
      return state.set('isLoading', false).set('preparedTransforms', []);
    default :
      return state;
  }
}
