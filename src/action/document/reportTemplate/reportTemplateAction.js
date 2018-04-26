import fetchData from '../../../util/fetchGateway'
import { spliceUrlByParams } from '../../../util/treeUtils'
import * as types from './ActionTypes'

// 搜索search
export const searchStart = () => ({
  type: types.REPORTTEMPLATE_SEARCH_START
});

export const searchSuccess = (info, data) => ({
  type: types.REPORTTEMPLATE_SEARCH_SUCCESS,
  info,
  data
});

export const searchTrees = (type, name) => (dispatch, state) => {
  dispatch(searchStart());
  fetchData('/doc/categories/type/' + type, {}).then(
    (receipt) => {
      dispatch(searchSuccess({
        id: 0,
        code: 'R' + type,
        name: name,
        shorthand: '',
        type: type,
      }, receipt.data));
      reportTemplatList((receipt.data && receipt.data.length > 0) ? [receipt.data[0].id] : [])(dispatch, state)
    },
    (error) => {
      console.log(error);
    }
  )
}

// 报告模板搜索下面的列表
export const reportTemplatStart = () => ({
  type: types.REPORTTEMPLATE_START
})
export const reportTemplatSuccess = (data, key) => ({
  type: types.REPORTTEMPLATE_SUCCESS,
  data,
  key
})
export const reportTemplatList = (selectedKeys) => (dispatch, state) => {
  if(!selectedKeys || !selectedKeys[0]) return;
  dispatch(reportTemplatStart())
  let selectedId = Number.parseInt(selectedKeys[0], 10);
  fetchData('/orders/reporttemplate/query/' + selectedId, {}).then(
    (receipt) => {
      dispatch(reportTemplatSuccess(receipt.data, selectedId))
    },
    (error) => {console.log(error)}
  )
}

// 获取首页列表的rowsKey
export const reportTemplatListKey = (rows, rowKeys) => ({
  type: types.REPORTTEMPLATE_LIST_KEY,
  rows,
  rowKeys,
})

// 获取列表模板点击项
export const getCurrentReport = (record) => ({
  type: types.REPORTTEMPLATE_LIST_CLICK,
  record
})

// 新增 / 编辑 报告模板
export const addReportTemplate = () => ({
  type: types.REPORTTEMPLATE_ITEM_ADD
});
export const editReportTemplate = () => ({
  type: types.REPORTTEMPLATE_ITEM_EDIT,
});
export const saveReportTemplate = () => ({
  type: types.REPORTTEMPLATE_ITEM_SAVE
});
export const saveReportTemplateSuccess = (data) => ({
  type: types.REPORTTEMPLATE_ITEM_SAVE_SUCCESS,
  data
});
export const reportTemplatAdd = (data, editType, selectedKey) => (dispatch, state) => {
  dispatch(saveReportTemplate());
  let url = '';
  if (editType === '新增报告模板') {
    url = '/orders/reporttemplate/save?typeId=' + selectedKey;
  } else if(editType === '编辑报告模板') {
    url = '/orders/reporttemplate/update?typeId=' + selectedKey;
  };
  fetchData(url, {
    body: JSON.stringify(data)
  }).then(
    (receipt) => {
      dispatch(saveReportTemplateSuccess(receipt.data));
    }, (error) => {
      console.log(error);
    }
  )
}

// 删除报告模板
export const deleteReportTemplatStart = () => ({
  type: types.DELETE_REPORTTEMPLATE_START
});
export const deleteReportTemplatSuccess = (del) => ({
  type: types.DELETE_REPORTTEMPLATE_SUCCESS,
  del
});
export const reportTemplatDelete = (ids) => (dispatch, getState) => {
  dispatch(deleteReportTemplatStart());
  fetchData('/orders/reporttemplate/delete', {
    body: JSON.stringify(ids)
  }).then(
    (receipt) => {
      dispatch(deleteReportTemplatSuccess(receipt.data));
    }, (error) => {
      console.log(error);
    }
  )
}

// 上传文件的弹框 / 确定
export const uploadModalReport = () => ({
  type: types.UPLOAD_MODAL_REPORTTEMPLATE
})
export const uploadReportTemplatStart = () => ({
  type: types.UPLOAD_REPORTTEMPLATE_START
})
export const uploadReportTemplatSuccess = (data) => ({
  type: types.UPLOAD_REPORTTEMPLATE_SUCCESS,
  data
})
export const uploadReportTemplat = (data, id) => (dispatch, state) => {
  dispatch(uploadReportTemplatStart())
  let url = spliceUrlByParams('/orders/reporttemplatefile/save', [id], 'id');
  fetchData(url, {
    body: JSON.stringify(data)
  }).then(
    (receipt) => {
      dispatch(uploadReportTemplatSuccess(receipt.data))
      uploadReportTemplatList(id)(dispatch, state)
      dispatch(cancelReportTemplat())
    },
    (error) => {console.log(error);}
  )
}

// 上传文件列表
export const uploadReportTemplatListStart = () => ({
  type: types.UPLOAD_REPORTTEMPLATE_LIST_START
})
export const uploadReportTemplatListSuccess = (data) => ({
  type: types.UPLOAD_REPORTTEMPLATE_LIST_SUCCESS,
  data
})
export const uploadReportTemplatList = (id) => (dispatch, state) => {
  dispatch(uploadReportTemplatListStart())
  fetchData('/orders/reporttemplatefile/query?pid=' + id, {}).then(
    (receipt) => {
      dispatch(uploadReportTemplatListSuccess(receipt.data))
    },
    (error) => {console.log(error);}
  )
}

// 删除上传文件
export const uploadReportTemplatDeleteStart = () => ({
  type: types.UPLOAD_REPORTTEMPLATE_DELETE_START
})
export const uploadReportTemplatDeleteSuccess = (del) => ({
  type: types.UPLOAD_REPORTTEMPLATE_DELETE_SUCCESS,
  del
})
export const uploadReportTemplatDelete = (data, id) => (dispatch, state) => {
  dispatch(uploadReportTemplatDeleteStart())
  // let url = spliceUrlByParams('/orders/reporttemplatefile/delete', [categoryTypeId, typeId, id], 'categoryTypeId', 'typeId', 'id');
  fetchData('/orders/reporttemplatefile/delete' + '?type=report//design' + '&id=' + id, {
    body: JSON.stringify(data)
  }).then(
    (receipt) => {
      dispatch(uploadReportTemplatDeleteSuccess(receipt.data))
    },
    (error) => {console.log(error);}
  )
}
export const uploadReportListKey = (rows, rowsKey) => ({
  type: types.UPLOAD_REPORTTEMPLATE_ROWS,
  rows,
  rowsKey,
})

// 激活 / 禁用
export const activeReport = () => ({
  type: types.ACTIVE_REPORTTEMPLATE_START
})
export const activeReportSuccess = (id) => ({
  type: types.ACTIVE_REPORTTEMPLATE_SUCCESS,
  id
})
export const unActiveReportSuccess = (id) => ({
  type: types.UNACTIVE_REPORTTEMPLATE_SUCCESS,
  id
})
export const reportTemplateActive = (ids) => (dispatch, state) => {
  dispatch(activeReport())
  fetchData('/orders/reporttemplate/update/activation', {
    body: JSON.stringify(ids)
  }).then(
    (receipt) => {
        dispatch(activeReportSuccess(receipt.data))
        dispatch(unActiveReportSuccess(receipt.data))
    }, (error) => {
      console.log(error)
    }
  )
}

// 设置主文件
export const mainFileReportStart = () => ({
  type: types.MAIN_FILE_REPORTTEMPLATE_START
})
export const mainFileReportSuccess = (data) => ({
  type: types.MAIN_FILE_REPORTTEMPLATE_SUCCESS,
  data
})
export const reportTemplateMainF = (pid, id) => (dispatch, state) => {
  dispatch(mainFileReportStart())
  fetchData('/orders/reporttemplatefile/update/major' + '?pid=' + pid + '&id=' + id, {}).then(
    (receipt) => {
      dispatch(mainFileReportSuccess(receipt.data))
    }
  )
}


// 取消操作
export const cancelReportTemplat = () => ({
  type: types.CANCEL_REPORTTEMPLATE,
});
