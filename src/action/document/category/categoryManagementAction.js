import fetchData from '../../../util/fetchGateway';

export const CATEGORY_MANAGEMENT_DATA_LOAD = 'CATEGORY_MANAGEMENT_DATA_LOAD';
export const CATEGORY_MANAGEMENT_DATA_LOAD_SUCCESS = 'CATEGORY_MANAGEMENT_DATA_LOAD_SUCCESS';
export const CATEGORY_MANAGEMENT_ITEM_SELECT = 'CATEGORY_MANAGEMENT_ITEM_SELECT';
export const CATEGORY_MANAGEMENT_ITEM_PREPARE = 'CATEGORY_MANAGEMENT_ITEM_PREPARE';
export const CATEGORY_MANAGEMENT_ITEM_ADD = 'CATEGORY_MANAGEMENT_ITEM_ADD';
export const CATEGORY_MANAGEMENT_ITEM_ADD_CANCEL = 'CATEGORY_MANAGEMENT_ITEM_ADD_CANCEL';
export const CATEGORY_MANAGEMENT_ITEM_EDIT = 'CATEGORY_MANAGEMENT_ITEM_EDIT';
export const CATEGORY_MANAGEMENT_ITEM_EDIT_CANCEL = 'CATEGORY_MANAGEMENT_ITEM_EDIT_CANCEL';
export const CATEGORY_MANAGEMENT_ITEM_SAVE = 'CATEGORY_MANAGEMENT_ITEM_SAVE';
export const CATEGORY_MANAGEMENT_ITEM_SAVE_SUCCESS = 'CATEGORY_MANAGEMENT_ITEM_SAVE_SUCCESS';
export const CATEGORY_MANAGEMENT_ITEM_DELETE_CONFIRM = 'CATEGORY_MANAGEMENT_ITEM_DELETE_CONFIRM';
export const CATEGORY_MANAGEMENT_ITEM_DELETE_FAIL = 'CATEGORY_MANAGEMENT_ITEM_DELETE_FAIL';
export const CATEGORY_MANAGEMENT_ITEM_DELETE_SUCCESS = 'CATEGORY_MANAGEMENT_ITEM_DELETE_SUCCESS';

// 加载可搜索树数据
export const loadData = () => ({
  type : CATEGORY_MANAGEMENT_DATA_LOAD
});

export const loadDataSuccess = (categoryInfo, categoryData) => ({
  type: CATEGORY_MANAGEMENT_DATA_LOAD_SUCCESS,
  categoryData: categoryData,
  categoryInfo: categoryInfo
});

export const asyncLoadData = (type, name) => (dispatch, state) => {
  dispatch(loadData());
  fetchData('/doc/categories/type/' + type, {}).then(
    (receipt) => {
      dispatch(loadDataSuccess({
        id: 0,
        code: 'R'+type,
        name: name,
        shorthand: '',
        type: type
      }, receipt.data));
    },
    (error) => {console.log(error)}
  );
};

// 获取选中树节点
export const selectCategory = (selectedKeys, info) => ({
  type: CATEGORY_MANAGEMENT_ITEM_SELECT,
  selectedCategoryId: Number.parseInt(selectedKeys[0], 10)
});

// 获取表格勾选项
export const prepareCategory = (selectedCategories, selectedKeys) => ({
  type: CATEGORY_MANAGEMENT_ITEM_PREPARE,
  preparedCategories: selectedCategories,
  preparedKeys: selectedKeys
});

// 新增 + 编辑类型
export const addCategory = () => ({
  type: CATEGORY_MANAGEMENT_ITEM_ADD
});

export const editCategory = () => ({
  type: CATEGORY_MANAGEMENT_ITEM_EDIT
});

export const saveCategory = () => ({
  type: CATEGORY_MANAGEMENT_ITEM_SAVE
});

export const saveCategorySuccess = (receipt) => ({
  type: CATEGORY_MANAGEMENT_ITEM_SAVE_SUCCESS,
  receipt: receipt
});

export const asyncSaveCategory = (category, parent, editType, categoryType) => (dispatch, state) => {
  dispatch(saveCategory());
  let url = '';
  if(editType === '新增'){
    url = '/doc/categories/add';
  }else if(editType === '编辑'){
    url = '/doc/categories/update';
  }
  url += "?parent=" + parent.id + "&type=" + categoryType;
  fetchData(url, {
    body: JSON.stringify([category])
  }).then(
    (receipt) => {
      dispatch(saveCategorySuccess(receipt.data));
    },
    (error) => {
      console.log(error);
    }
  )
}

// 删除类型
export const confirmDeleteCategories = () => ({
  type: CATEGORY_MANAGEMENT_ITEM_DELETE_CONFIRM
});

export const deleteCategoriesSuccess = (receipt) => ({
  type: CATEGORY_MANAGEMENT_ITEM_DELETE_SUCCESS,
  removedIds: receipt
});

export const deleteCategoriesFail = () => ({
  type: CATEGORY_MANAGEMENT_ITEM_DELETE_FAIL
});

export const asyncDeleteCategories = (ids) => (dispatch, state) => {
  dispatch(confirmDeleteCategories());
  let url = '/doc/categories/delete';
  fetchData(url, {
    body: JSON.stringify(ids)
  }).then(
    (receipt) => {
      dispatch(deleteCategoriesSuccess(receipt.data));
    },
    (error) => {
      dispatch(deleteCategoriesFail());
      console.log(error);
    }
  )
}

// 取消操作
export const cancelAddCategory = () => ({
  type: CATEGORY_MANAGEMENT_ITEM_ADD_CANCEL
});

export const cancelEditCategory = () => ({
  type: CATEGORY_MANAGEMENT_ITEM_EDIT_CANCEL
});
