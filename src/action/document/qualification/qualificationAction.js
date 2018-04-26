import fetchData from '../../../util/fetchGateway'
import { spliceUrlByParams } from '../../../util/treeUtils'
import * as types from './ActionTypes'

// 暂存资质认证搜索抬头
export const temporaryDepositTitleStart = () => ({
  type: types.TEMPORARY_DEPOSIT_QUALIFICATION_TITLE_START
});

export const temporaryDepositQualificationTitleSuccess = temporaryStoredTitle => ({
  type: types.TEMPORARY_DEPOSIT_QUALIFICATION_TITLE_SUCCESS,
  temporaryStoredTitle
});

export const qualificationManagementTitle = (dept, qualificationTypeId, testMethodId, testItemId, productId) => (dispatch, state) => {
  dispatch(temporaryDepositTitleStart());
  let url = spliceUrlByParams('/auth/qualification/query', [dept, qualificationTypeId, testMethodId, testItemId, productId], 'dept', 'qualificationTypeId', 'testMethodId', 'testItemId', 'productId');
  fetchData(url, {}).then(
    (receipt) => {
      dispatch(temporaryDepositQualificationTitleSuccess(receipt.data));
    },
    (error) => {
      console.log(error);
    }
  )
}
// 获取首页列表的rowsKey
export const qualificationListKey = (rows, rowKeys) => ({
  type: types.QUALIFICATION_LIST_KEY,
  rows,
  rowKeys,
})
// 获取首页 列表 点击项
export const qualificationListClick = record => ({
  type: types.QUALIFICATION_LIST_CLICK,
  record,
})

// 新增资质 搜索接口 获取表格列表
export const addQualificationTitleStart = () => ({
  type: types.ADD_QUALIFICATION_TITLE_START
});

export const addQualificationTitleSuccess = temporaryStoredTitleAdd => ({
  type: types.ADD_QUALIFICATION_TITLE_SUCCESS,
  temporaryStoredTitleAdd,
});

export const qualificationAddTitle = (dept, qualificationTypeId, s) => (dispatch, state) => {
  dispatch(addQualificationTitleStart());
  let url = spliceUrlByParams('/auth/qualification/query/unconnect', [dept, qualificationTypeId, s], 'dept', 'qualificationTypeId', 's');
  fetchData(url, {}).then(
    (receipt) => {
      dispatch(addQualificationTitleSuccess(receipt.data));
      if(receipt.data && receipt.data.length > 0) {
        receipt.data.map(v => {
          v.testItemName = (v.testItem && v.testItem.name) || '空';
          v.testStandardCode = (v.testStandard && v.testStandard.code) || '空';
          v.testStandardName = (v.testStandard && v.testStandard.name) || '空';
          v.testMethodName = (v.testMethod && v.testMethod.name) || '空';
          v.testMethodStandardNo = (v.testMethod && v.testMethod.standardNo) || '空';
          return v;
        })
      }
    }, (error) => {
      console.log(error)
    }
  )
}

// 新增检验资质 按钮
export const addQualification = () => ({
  type: types.ADD_QUALIFICATION
});
export const addQualificationStart = () => ({
  type: types.ADD_QUALIFICATION_START
});
export const addQualificationSuccess = content => ({
  type: types.ADD_QUALIFICATION_SUCCESS,
  content,
});
export const qualificationAdd = (addQualify, dept, qualificationTypeId) => dispatch => {
  dispatch(addQualificationStart());
  let url = spliceUrlByParams('/auth/qualification/save', [dept, qualificationTypeId], 'dept', 'qualificationTypeId');
  fetchData(url, {
    body: JSON.stringify(addQualify)
  }).then(
    (receipt) => {
      dispatch(addQualificationSuccess(receipt.data));
    }, (error) => {
      console.log(error);
    }
  )
}

// 新增时加载列表存储key值
export const qualificationKey = (rows, rowKeys) => ({
  type: types.ADD_QUALIFICATION_KEY,
  rows,
  rowKeys,
})

// 编辑检验资质
export const editQualification = () => ({
  type: types.EDIT_QUALIFICATION
});
export const editQualificationStart = () => ({
  type: types.EDIT_QUALIFICATION_START
});
export const editQualificationSuccess = content => ({
  type: types.EDIT_QUALIFICATION_SUCCESS,
  content,
});
export const qualificationEdit = (values, dept, qualificationTypeId, testMethodId, testItemId) => (dispatch, state) => {
  dispatch(editQualificationStart());
  let url = spliceUrlByParams('/auth/qualification/update', [dept, qualificationTypeId, testMethodId, testItemId], 'dept', 'qualificationTypeId', 'testMethodId', 'testItemId');
  fetchData(url, {
    body: JSON.stringify(values)
  }).then(
    (receipt) => {
      dispatch(editQualificationSuccess(receipt.data));
    }, (error) => {
      console.log(error);
    }
  )
}

// 删除检验资质
export const deleteQualificationStart = () => ({
  type: types.DELETE_QUALIFICATION_START
});
export const deleteQualificationSuccess = (del) => ({
  type: types.DELETE_QUALIFICATION_SUCCESS,
  del
});
export const qualificationDelete = (ids) => (dispatch, getState) => {
  dispatch(deleteQualificationStart());
  fetchData('/auth/qualification/delete', {
    body: JSON.stringify(ids)
  }).then(
    (receipt) => {
      dispatch(deleteQualificationSuccess(receipt.data));
    }, (error) => {
      console.log(error);
    }
  )
}

// 激活/禁用检验资质
export const unActiveQualify = () => ({
  type: types.UNACTIVE_QUALIFICATION_START
})
export const unActiveQualifySuccess = (id) => ({
  type: types.UNACTIVE_QUALIFICATION_SUCCESS,
  id
})
export const activeQualify = () => ({
  type: types.ACTIVE_QUALIFICATION_START
})
export const activeQualifySuccess = (id) => ({
  type: types.ACTIVE_QUALIFICATION_SUCCESS,
  id
})
export const qualifyActive = (ids) => (dispatch, state) => {
  dispatch(activeQualify())
  dispatch(unActiveQualify())
  fetchData('/auth/qualification/update/activation', {
    body: JSON.stringify(ids)
  }).then(
    (receipt) => {
      dispatch(activeQualifySuccess(receipt.data))
      dispatch(unActiveQualifySuccess(receipt.data))
    }, (error) => {
      dispatch(cancelQualification())
      console.log(error)
    }
  )
}


// 关联产品搜索列表
export const connectProductTitleStart = () => ({
  type: types.CONNECT_PRODUCT_QUALIFICATION_TITLE_START
})
export const connectProductTitleSuccess = product => ({
  type: types.CONNECT_PRODUCT_QUALIFICATION_TITLE_SUCCESS,
  product
})
export const connectProductTitle = (dept, qualificationTypeId, testMethodId, testItemId) => (dispatch, state) => {
  dispatch(connectProductTitleStart());
  let url = spliceUrlByParams('/auth/qualification/connect/product/query', [dept, qualificationTypeId, testMethodId, testItemId], 'dept', 'qualificationTypeId', 'testMethodId', 'testItemId');
  fetchData(url, {}).then(
    (receipt) => {
      dispatch(connectProductTitleSuccess(receipt.data));
    }, (error) => {
      console.log(error)
    }
  )
}
// 关联产品
export const connectProduct = () => ({
  type: types.CONNECT_PRODUCT_QUALIFICATION
})
export const connectProductStart = () => ({
  type: types.CONNECT_PRODUCT_QUALIFICATION_START
})
export const connectProductSuccess = content => ({
  type: types.CONNECT_PRODUCT_QUALIFICATION_SUCCESS,
  content
})
export const qualificationConnect = (connectP, dept, qualificationTypeId, testMethodId, testItemId) => dispatch => {
  dispatch(connectProductStart());
  let url = spliceUrlByParams('/auth/qualification/connect/product/save', [dept, qualificationTypeId, testMethodId, testItemId], 'dept', 'qualificationTypeId', 'testMethodId', 'testItemId');
  fetchData(url, {
    body: JSON.stringify(connectP)
  }).then(
    (receipt) => {
      dispatch(connectProductSuccess(receipt.data));
    }, (error) => {
      console.log(error);
    }
  )
}

// 关联产品时加载列表存储key值
export const connectProductKey = (rows, rowKeys) => ({
  type: types.CONNECT_QUALIFICATION_KEY,
  rows,
  rowKeys,
})



// 取消操作
export const cancelQualification = () => ({
  type: types.CANCEL_QUALIFICATION,
});
