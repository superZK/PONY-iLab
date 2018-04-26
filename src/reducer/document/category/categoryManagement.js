import {fromJS} from 'immutable';
import {
  CATEGORY_MANAGEMENT_DATA_LOAD,
  CATEGORY_MANAGEMENT_DATA_LOAD_SUCCESS,
  CATEGORY_MANAGEMENT_ITEM_SAVE,
  CATEGORY_MANAGEMENT_ITEM_SAVE_SUCCESS,
  CATEGORY_MANAGEMENT_ITEM_SELECT,
  CATEGORY_MANAGEMENT_ITEM_PREPARE,
  CATEGORY_MANAGEMENT_ITEM_EDIT,
  CATEGORY_MANAGEMENT_ITEM_EDIT_CANCEL,
  CATEGORY_MANAGEMENT_ITEM_ADD,
  CATEGORY_MANAGEMENT_ITEM_ADD_CANCEL,
  CATEGORY_MANAGEMENT_ITEM_DELETE_CONFIRM,
  CATEGORY_MANAGEMENT_ITEM_DELETE_SUCCESS,
  CATEGORY_MANAGEMENT_ITEM_DELETE_FAIL,
} from '../../../action/document/category/categoryManagementAction';
import { findNodeById, replaceChildrenById, removeChildrenById } from '../../../util/treeUtils';


export default function categoryManagement(state = fromJS({
  isLoading: false,
  editType: '',
  categoryData: [],
  selectedCategory: {},
  preparedCategories: [],
  preparedKeys: [],
}), action){
  switch(action.type){
    case CATEGORY_MANAGEMENT_DATA_LOAD:
    case CATEGORY_MANAGEMENT_ITEM_SAVE:
      return state.set('isLoading', true);
    case CATEGORY_MANAGEMENT_DATA_LOAD_SUCCESS :
      let rootNode = action.categoryInfo;
      rootNode.subordinate = action.categoryData ? action.categoryData : [];
      return state.set('isLoading', false).set('categoryData', [rootNode]).set('selectedCategory', [rootNode][0]).set('preparedCategories',[]);
    case CATEGORY_MANAGEMENT_ITEM_SELECT :
      let currentCategory = findNodeById(state.get('categoryData'), 'id', 'subordinate', action.selectedCategoryId);
      return state.set('selectedCategory', currentCategory ? currentCategory : {});
    case CATEGORY_MANAGEMENT_ITEM_PREPARE:
      return state.set('preparedCategories', action.preparedCategories).set('preparedKeys', action.preparedKeys);
    case CATEGORY_MANAGEMENT_ITEM_EDIT:
      return state.set('editType', '编辑');
    case CATEGORY_MANAGEMENT_ITEM_EDIT_CANCEL:
      return state.set('editType', '').set('isLoading', false);
    case CATEGORY_MANAGEMENT_ITEM_ADD:
      return state.set('editType', '新增').set('isLoading', true);
    case CATEGORY_MANAGEMENT_ITEM_ADD_CANCEL:
      return state.set('editType', '').set('isLoading', false);
    case CATEGORY_MANAGEMENT_ITEM_SAVE_SUCCESS:
      let et = state.get('editType');
      let savedCategories = action.receipt ? action.receipt : [];
      if(et === '新增'){
          state.get('selectedCategory').subordinate = (state.get('selectedCategory').subordinate) ? state.get('selectedCategory').subordinate.concat(savedCategories) : savedCategories;
      }else if(et === '编辑'){
        replaceChildrenById(state.get('selectedCategory'), 'id', 'subordinate', savedCategories);
      }
      return state.set('isLoading', false).set('editType', '');
    case CATEGORY_MANAGEMENT_ITEM_DELETE_CONFIRM:
      return state.set('editType', '').set('isLoading', true);
    case CATEGORY_MANAGEMENT_ITEM_DELETE_FAIL:
      return state.set('isLoading', false);
    case CATEGORY_MANAGEMENT_ITEM_DELETE_SUCCESS:
      let removeIds = action.removedIds;
      removeChildrenById(state.get('selectedCategory'), 'id', 'subordinate', removeIds);
      return state.set('isLoading', false).set('preparedCategories', []);
    default :
      return state;
  }
}
