import fetchData from '../../../util/fetchGateway'
// import { spliceUrlByParams } from '../../../util/treeUtils'
import * as types from './ActionTypes'

// 搜索searchTree
export const searchStart = () => ({
  type: types.MARKREPORT_SEARCH_START
});

export const searchSuccess = (data) => ({
  type: types.MARKREPORT_SEARCH_SUCCESS,
  data
});

export const searchTrees = () => (dispatch, state) => {
  dispatch(searchStart());
  const url = '/biz/order/sample/query/verifier';
  fetchData(url, {}).then(
    (receipt) => {
      dispatch(searchSuccess(receipt.data));
      const dataF = receipt.data && receipt.data.length > 0;
      const dataS = receipt.data[0];
      markReportSampleList(dataF ? dataS.id : [])(dispatch, state);
      markReportBtnList(dataF ? dataS.id : [])(dispatch, state);

      // 改变 SearchableTree 数据
      // if(dataF) {
      //   receipt.data.map(item => {
      //     return item.subordinate = item.sampleType;
      //     item.key = 'O' + item.key;
      //     if(item.subordinate && item.subordinate.length > 0) {
      //       item.subordinate.map(v => {
      //         return v.key = 'S' + v.key;
      //       })
      //     }
      //   })
      // }
      if(dataF) {
        receipt.data.map(v => {
          if(v.id) v.key = v.id;
          v.orderOrderNo = (v.orders && v.orders.orderNo) || '空';
          v.serialNoTestName = (v.testName && v.serialNo) ? (v.testName +'-'+ v.serialNo) : '空';
          return v;
        })
      }

     },
    (error) => {
      dispatch(cancelMarkReport());
      console.log(error);
    }
  )
}

// 报告模板搜索下面的列表
// 样品
export const markReportSampleStart = () => ({
  type: types.MARKREPORT_SAMPLE_START
})
export const markReportSampleSuccess = (data, selectedId) => ({
  type: types.MARKREPORT_SAMPLE_SUCCESS,
  data,
  selectedId
})
export const markReportSampleList = (selectedId) => (dispatch, state) => {
  dispatch(markReportSampleStart())
  fetchData('/biz/order/report/query/sid/' + selectedId, {}).then(
    (receipt) => {
      dispatch(markReportSampleSuccess(receipt.data, selectedId))
    },
    (error) => {
      dispatch(cancelMarkReport());
      console.log(error)
    }
  )
}

// 获取首页列表的rowsKey
export const markReportListKey = (rows, rowKeys) => ({
  type: types.MARKREPORT_LIST_KEY,
  rows,
  rowKeys,
})

// 编制报告 列表 查询
export const markReportBtnListStart = () => ({
  type: types.MARKREPORT_BTN_LIST_START
})
export const markReportBtnListSuccess = (data) => ({
  type: types.MARKREPORT_BTN_LIST_SUCCESS,
  data
})
export const markReportBtnList = (selectedId) => (dispatch, state) => {
  dispatch(markReportBtnListStart())
  fetchData('/report/reportcompile/query/' + selectedId, {}).then(
    (receipt) => {
      dispatch(cancelMarkReport());
      dispatch(markReportBtnListSuccess(receipt.data))
    }
  )
}

// 新增 / 编辑 报告模板
export const addReportTemplate = () => ({
  type: types.MARKREPORT_ITEM_ADD
});
export const editReportTemplate = () => ({
  type: types.MARKREPORT_ITEM_EDIT,
});
export const saveReportTemplate = () => ({
  type: types.MARKREPORT_ITEM_SAVE
});
export const saveReportTemplateSuccess = (data) => ({
  type: types.MARKREPORT_ITEM_SAVE_SUCCESS,
  data
});
export const markReportAdd = (data, editType, selectedKey) => (dispatch, state) => {
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
      dispatch(cancelMarkReport());
      console.log(error);
    }
  )
}

// 报告模板列表数据
export const markReportTemplateStart = () => ({
  type: types.MARKREPORT_REPORTTEMPLATE_START
})
export const markReportTemplateSuccess = (data) => ({
  type: types.MARKREPORT_REPORTTEMPLATE_SUCCESS,
  data
})
export const markReportTemplateList = (id) => (dispatch, state) => {
  dispatch(markReportTemplateStart())
  fetchData('/orders/reporttemplate/query/' + id, {}).then(
    (receipt) => {
      dispatch(markReportTemplateSuccess(receipt.data))
    },
    (error) => {
      dispatch(cancelMarkReport());
      console.log(error)
    }
  )
}
// 获取报告模板的rowsKey
export const rowsMarkreportTemplate = (rows, rowKeys) => ({
  type: types.ROWS_MARKREPORT_TEMPLATE,
  rows,
  rowKeys,
})

// 获取签章列表
export const markReportSignatureStart = () => ({
  type: types.MARKREPORT_SIGNATURE_START
})
export const markReportSignatureSuccess = (data) => ({
  type: types.MARKREPORT_SIGNATURE_SUCCESS,
  data
})
export const markReportSignatureList = () => (dispatch, state) => {
  dispatch(markReportSignatureStart())
  fetchData('/report/signet/query', {}).then(
    (receipt) => {
      dispatch(markReportSignatureSuccess(receipt.data))
    },
    (error) => {
      dispatch(cancelMarkReport());
      console.log(error)
    }
  )
}
// 获取签章的rowsKey
export const rowsMarkreportQualification = (rows, rowKeys) => ({
  type: types.ROWS_MARKREPORT_QUALIFICATION,
  rows,
  rowKeys,
})


// 编制报告 按钮
export const markReportBtnStart = () => ({
  type: types.MARKREPORT_BTN_START
})
export const markReportBtnSuccess = (data) => ({
  type: types.MARKREPORT_BTN_SUCCESS,
  data
})
export const markReportBtn = (data) => (dispatch, state) => {
  dispatch(markReportBtnStart())
  // let url = spliceUrlByParams('/report/reportcompile/save', [id], 'id');
  fetchData('/report/reportcompile/save', {
    body: JSON.stringify(data)
  }).then(
    (receipt) => {
      dispatch(markReportBtnSuccess(receipt.data))
    }
  )
}

export const markReporTableRows = (rows, rowKeys) => ({
  type: types.MARKREPORT_TABLE_ROWS,
  rows,
  rowKeys
})

// 报告作废 按钮
export const markReportVoid = () => ({
  type: types.MARKREPORT_VOID_BTN_START
})
export const markReportVoidSuccess = (data) => ({
  type: types.MARKREPORT_VOID_BTN_SUCCESS,
  data
})
export const voidMarkReportBtn = (ids) => (dispatch, state) => {
  dispatch(markReportVoid());
  fetchData('/report/reportcompile/update/disable', {
    body: JSON.stringify(ids)
  }).then(
    (receipt) => {
      dispatch(markReportVoidSuccess(receipt.data))
    }
  )
}

// 删除报告模板
export const deleteMarkReport = () => ({
  type: types.DELETE_MARKREPORT_START
});
export const deleteMarkReportSuccess = (del) => ({
  type: types.DELETE_MARKREPORT_SUCCESS,
  del
});
export const markReportDelete = (ids) => (dispatch, getState) => {
  dispatch(deleteMarkReport());
  fetchData('/report/reportcompile/delete', {
    body: JSON.stringify(ids)
  }).then(
    (receipt) => {
      dispatch(deleteMarkReportSuccess(receipt.data));
    }, (error) => {
      dispatch(cancelMarkReport());
      console.log(error);
    }
  )
}

// 编制报告 完成
export const doneMarkReport = () => ({
  type: types.DONE_MARKREPORT_START
})
export const doneMarkReportSuccess = (data) => ({
  type: types.DONE_MARKREPORT_SUCCESS,
  data
})
export const markReportDone = (ids) => (dispatch, state) => {
  dispatch(doneMarkReport())
  fetchData('/report/reportcompile/commit', {
    body: JSON.stringify(ids)
  }).then(
    (receipt) => {
      dispatch(doneMarkReportSuccess(receipt.data))
    }, (error) => {
      dispatch(cancelMarkReport());
      console.log(error);
    }
  )
}


// 取消操作
export const cancelMarkReport = () => ({
  type: types.CANCEL_MARKREPORT,
});
