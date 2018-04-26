import React, {Component} from 'react';
import { Modal, message } from 'antd';
import BaseForm from "../../../component/public/BaseForm";
import SearchableSelector from '../../../component/public/SearchableSelector';
import BaseTable from "../../../component/public/BaseTable";
import QualificationManageSetting from './column'
import moment from 'moment';
import { analysisDataIndex } from '../../../util/treeUtils';

export default class ConnectProduct extends Component{
  state = {
    siteId: '',
  }

  componentWillReceiveProps(nextProps) {
    // 关联产品弹框 && 加载根据rows搜索的列表
    if ((nextProps.visible !== this.props.visible) && (nextProps.visible === true)) {
      let values = this.props.selectRows;
      if (values.length) {
        this.props.connectProductTitle(analysisDataIndex(values[0], 'dept.id'), values[0].qualificationTypeId, values[0].testMethodId, values[0].testItemId)
      }
    }
  }

  render() {
    const {
      siteId,
    } = this.state;

    const {
      visible,
      onCancel,
      onEndSubmit,
      editObject,
      connectProductKey,    // 传过去的rows和rowKeys
      rowKeysConnect,       // 获取到的rowKeys
      // rowsConnect,          // 获取到的rows
      // connectProductTitle,  // 暂存搜索抬头
      temporaryStoredTitleProduct,  //表格列表数据
      selectRows           // 首页列表选中的rows
    } = this.props

    const editSiteId = analysisDataIndex(editObject, 'dept.site.id') ? analysisDataIndex(editObject, 'dept.site.id') : '';

    const siteSelect = {key: 'dept.site.id', label: '组织', component: (
      <SearchableSelector
        options={{allowClear:true}}
        // onChange={handleSiteChange}
        disabled={true}
        lazyMode={false}
        url='/org/site/select' />
    ), rules: []};

    const deptSelect = {key: 'dept.id', label: '部门', component: (
      <SearchableSelector
        options={{allowClear:true}}
        disabled={true}
        lazyMode={false}
        url={`/org/dept/select/506501?siteId=${editSiteId}&`} />
    ), rules: []};

    const connectProduct = QualificationManageSetting.form.connectProduct;
    const connectProductDis = QualificationManageSetting.form.connectProductDis;
    connectProductDis.items[0] = siteSelect;
    connectProductDis.items[1] = deptSelect;
    const connectProductTable = QualificationManageSetting.table.connectProduct;

    let editObject1 = editObject || {};
    if(editObject1) {
      editObject1.qualificationTypeId = editObject1.qualificationType && editObject1.qualificationType.id + '';
      editObject1.siteId = editObject1.site && editObject1.site.id +'';
      editObject1.effectDate = moment(editObject1.effectDate).format('YYYY-MM-DD');
      editObject1.expiryDate = moment(editObject1.expiryDate).format('YYYY-MM-DD');
    } else {
      editObject1.qualificationTypeId = '';
      editObject1.siteId = ''
      editObject1.effectDate = '';
      editObject1.expiryDate = '';
    }

    // 获取表格选择列表
    const handleTableSelect = (rows, rowKeys) => {
      connectProductKey(rows, rowKeys)
    }

    // 表单发送请求成功与失败
    const handleSubmitSuccess = () => {
      let values = this.refs.connectProductForm.getFieldsValue();
      this.refs.connectProductForm.validateFieldsAndScroll((err, value) => {
        if(!err) {
          if (values.effectDate) values.effectDate.format('YYYY-MM-DD');
          if (values.expiryDate) values.expiryDate.format('YYYY-MM-DD');
          values.productTestFlowList = rowKeysConnect;
          if(selectRows && selectRows.length > 0 && rowKeysConnect.length > 0) {
            onEndSubmit(values, analysisDataIndex(selectRows[0], 'dept.id'), selectRows[0].qualificationTypeId, selectRows[0].testMethodId, selectRows[0].testItemId )
          } else {
            message.error('请选择产品')
          }
        }
      })
    }

    return (
      <Modal
        style={{top:40}}
        width={'600px'}
        title={'关联产品'}
        visible={visible}
        onOk={handleSubmitSuccess}
        onCancel={onCancel} >
        <div className="panel panel-info" style={{margin:0}}>
          <div className="panel-heading" style={{height:245, backgroundColor: 'white', marginTop: 8}}>
            <BaseForm
              ref = 'connectProductFormDis'
              // colNum={2}
              setting = {connectProductDis}
              submitTitleClass = {{marginLeft:10, transform: 'translate(0px, -62px)', display: 'none'}}
              visible = {visible}
              footerRule = {'确认'}
              editObject={editObject1}
            />
          </div>
          <div className="panel-heading" style={{height:125}}>
            <BaseForm
              ref = 'connectProductForm'
              // colNum={2}
              setting = {connectProduct}
              visible={visible}
              submitTitleClass = {{marginLeft:10, transform: 'translate(0px, -62px)', display: 'none'}}
              footerRule = {'确认'}
            />
          </div>
          <div className="panel-body">
            <BaseTable
              options={{pagination:{pageSize:5, showQuickJumper:true,}} }
              isExpanded={false}
              onPrepare={handleTableSelect}
              setting={connectProductTable}
              data={temporaryStoredTitleProduct} />
          </div>
        </div>
      </Modal>
    )
  }
}
