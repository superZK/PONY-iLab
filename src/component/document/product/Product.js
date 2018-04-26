import React, {Component} from 'react';
import { Row, Col, Spin, Button, Modal, Tabs } from 'antd';
import ProductAddEditDialog from './ProductAddEditDialog';
import ProductOldVersion from './ProductOldVersion';
import ProgramAddDialog from './ProgramAddDialog';
import ProgramEditDialog from '../../../container/document/product/ProgramEditDialog';
import SearchableTree from '../../public/SearchableTree';
import ConfirmModal from '../../public/ConfirmModal';
import BaseTable from '../../public/BaseTable';
import AdvancedTable from '../../public/Table/AdvancedTable';
import SecurityButtonBox from '../../public/SecurityButtonBox';
import Setting from '../../../config/index';
import { getPreparedItems, isAllActiveOrDisable } from '../../../util/getPreparedItems';
import { analysisDataIndex } from '../../../util/treeUtils';
import 'antd/dist/antd.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import ProgramEditBusiness from './ProgramEditBusiness';
import TestItemScopeAddEditDialog from './TestItemScopeAddEditDialog';
import ScopeRecordEditDialog from './ScopeRecordEditDialog';
import ScopeRecordAddDialog from './ScopeRecordAddDialog';

const TabPane = Tabs.TabPane;

export default class Product extends Component{
  state = { selectProgramId: 1 }

  componentDidMount(){
    const {asyncLoadData} = this.props.productAction;
    asyncLoadData("1003", "产品");
  }

  componentWillReceiveProps(prop){
    const { asyncSelectItem } = this.props.productAction;
    if(prop.needReload){
      asyncSelectItem([this.props.selectedItemKey]);
    }
  }

  render(){

    const { selectProgramId } = this.state;

    const {
      isLoading,
      editType,
      categoryData,
      selectedItemKey,
      productData,
      preparedItems,
      preparedKeys,
      preparedProgramKeys,
      // editingItem,
      currentItem,
      preparedPrograms,
      modalTitle,
      modalInformation,
      oldVersions,
      // needReload,
      productScopeData,//新修改 检测范围data
      productSRows,//检测范围列表rows
      productSRowKeys,//检测范围列表rowKeys
      handleType,//弹框
      productSClick,//检测范围 点击项 data
      productSResultData,//检测范围 结果项 data
      productSResultRows,//检测范围 结果项 rows
      // productSResultRowKeys,//检测范围 结果项 rowKeys
    } = this.props;

    const {
      asyncSelectItem,
      addItem,
      asyncSaveItem,
      prepareItem,
      editItem,
      asyncDeleteItems,
      getCurrentItem,
      upItem,
      asyncUpVersion,
      viewOldVersionItem,
      activeItem,
      enableItem,
      asyncActiveEnable,
      // importItem,
      // exportItem,
      addProgramItem,
      preparedProgram,
      editProgram,
      asyncEditProgram,
      asyncAddProgram,
      showProgram,
      asyncDeletePrograms,
      cancelAddEdit,
      cancelDeleteItems,
      listProductScope,//检测范围 列表
      listProductScopeRows,//检测范围 列表rows
      productScopeAdd,//新增 弹框
      productScopeEdit,//编辑 弹框
      listProductScopeClick,//检测范围 点击项
      delProductScope,//检测范围 删除
      productScopeCancel,//检测范围 新增 编辑 弹框返回
      // listProductSResult,//结果项 列表
      listProductSResultRows,//结果项 rows action
      // saveProductSResult,//结果项 新增
      delProductSResult,//结果项 删除
      // =======================
      asyncAddTestFlowScope,//检测范围新增检测项目
      asyncEditTestFlowScope,//检测范围编辑检测项目
      asyncQueryScopeRecord,//查询可添加结果项
      asyncAddScopeRecord,//添加结果项
      editScopeRecord,//打开编辑modal
      asyncEditScopeRecord,//编辑结果项
    } = this.props.productAction;

    // 全项方案配置 传参
    const {
      addRecordItem,
    } = this.props.programEditDialogAction;

    const productTableSetting = Setting.ProductSetting.table.product;
    const programTableSetting = Setting.ProductSetting.table.testProgram;
    const searchFormSetting = Setting.ProductSetting.form.searchForm;

    // 搜索树的匹配规则
    const isMatch = (item, searchValue) => {
      return (
        (item.name && item.name.includes(searchValue))
        || (item.code && item.code.includes(searchValue))
        || (item.shorthand && item.shorthand.includes(searchValue))
      );
    }

    const renderTreeNodeTitle = (item) => {
      return item.name;
    }

    // 获取产品表格勾选项
    const handleTablePrepare = (rows, rowKeys) => {
      prepareItem(rows, rowKeys)
      if(rowKeys && rowKeys.length === 1) {
        listProductScope(rowKeys[0]);
      }
    }

    // 获取检测方案表格勾选项
    const handleProgramTablePrepare = (rows, rowKeys) => {
      preparedProgram(rows, rowKeys);
      if(rows[0]){
        this.setState({selectProgramId: rows[0].id});
      }
    };

    // 获取产品表格点击项
    const handleTableSelect = (record) => {
      getCurrentItem(record);
      if(record) {
        listProductScope(record.id);
      }
    };

    // 新增 + 编辑产品
    const handleTableButtonAdd = (event) => {
      addItem();
    }

    const handleTableButtonEdit = (event) => {
      editItem();
    }

    const handleEditFormSubmitSuccess = (values) => {
      let c = {
        code: values.code,
        name: values.name,
        nameEN: values.nameEN,
        testInvoicesName: values.testInvoicesName,
        secuityGroup: values.secuityGroup,
        synonyms: values.synonyms,
        description: values.description,
        remove: values.remove,
      };
      if(editType === '编辑'){
        c.id = preparedItems[0].id;
        c.version = preparedItems[0].version;
        let productParentId = preparedItems[0].productParent.id;
        asyncSaveItem(c, editType, selectedItemKey, productParentId);
      }else if(editType === '新增'){
        asyncSaveItem(c, editType, selectedItemKey);
      }
    }

    // 删除产品
    const handleTableButtonDelete = () => {
      let hasChildren = false;
      for(let c of preparedItems){
        if(c.resultRecord && c.resultRecord.length > 0){
          hasChildren = true;
          break;
        }
      }
      Modal.confirm({
        title: "删除产品",
        content: hasChildren ? "所选产品已经在质量标准、检测标准步骤、结果、报告中使用了，确认删除？" : "确认删除所选产品？",
        onOk(){ asyncDeleteItems(preparedItems.map((item) => (item.id))) },
        onCancel(){ cancelDeleteItems() },
      });
    }

    // 产品升版
    const handleTableButtonUp = (event) => {
      upItem();
    }

    const handleUpVersionSuccess = () => {
      let parentId = (preparedItems && preparedItems.length === 1) ? preparedItems[0].productParent.id : '';
      let productId = (preparedItems && preparedItems.length === 1) ? preparedItems[0].id : '';
      asyncUpVersion(parentId, productId);
    }

    // 查看产品所有版本
    const viewOldVersion = (event) => {
      let parentId = preparedItems[0].productParent.id;
      viewOldVersionItem(parentId);
    }

    // 激活与禁用产品
    const handleTableButtonActive = (event) => {
      activeItem();
    }
    const handleTableButtonEnable = (event) => {
      enableItem();
    }

    const handleActiveEnable = () => {
      asyncActiveEnable(preparedItems.map((items) => {return items.id}));
    }

    // 导入与导出（未实现）
    // const handleTableButtonImport = (event) => {
    //   importItem();
    // }
    // const handleTableButtonExport = (event) => {
    //   exportItem();
    // }

    // 新增 + 编辑检测方案
    const handleProgramButtonAdd = (event) => {
      addProgramItem();
    }

    const handleProgramButtonEdit = (event) => {
      editProgram();
    }

    const handleAddProgramSubmitSuccess = (values) => {
      let c = {
        samplingSite: values.samplingSite,
        description: values.description,
        testInvoicesName: values.testInvoicesName,
        alwaysDecide: values.alwaysDecide,
        continueDecide: values.continueDecide,
      };
      // let productGradeId = analysisDataIndex(values, 'productGrade.id');
      // let testPlanId = analysisDataIndex(values, 'productGrade.id');
      if(editType === '新增检测方案'){
        let productId = currentItem.id;
        asyncAddProgram(c, productId, values.productGradeId, values.testPlanId);
      }else if(editType === '编辑检测方案'){
        c.id = (preparedPrograms && preparedPrograms.length > 0) ? preparedPrograms[0].id : '';
        let productId = (preparedPrograms && preparedPrograms.length > 0) ? preparedPrograms[0].product.id : '';
        asyncEditProgram(c, productId, values.productGradeId, values.testPlanId);
      }
    }

    // 删除检测方案
    const handleProgramButtonDelete = () => {
      let programIds = preparedPrograms.map((item) => (item.id));
      Modal.confirm({
        title: "删除检测方案",
        content: "是否确认删除所选检测方案？",
        onOk(){ asyncDeletePrograms(programIds) },
        onCancel(){ cancelDeleteItems() },
      });
    }

    // 检测方案配置（打开项目标准方法组合modal）
    const handleProgramButtonShow = (event) => {
      showProgram();
    }

    // 检测范围 添加检测项目
    const handleSubmitSuccess = (values) => {
      let c = {
        samplingPoint: values.samplingPoint,
        description: values.description,
        numReplicates: values.numReplicates,
        reportedNameZH: values.reportedNameZH,
        reportedNameEN: values.reportedNameEN,
        costPrice: values.costPrice,
        quotePrice: values.quotePrice,
        requiredVolume: values.requiredVolume,
        testInterval: values.testInterval,
      };
      let product = currentItem && currentItem.id;
      let item = analysisDataIndex(values, 'testItem.id');
      let standard = analysisDataIndex(values, 'testStandard.id');
      let method = analysisDataIndex(values, 'testMethod.id');
      let serviceGroup = analysisDataIndex(values, 'serviceGroup.id');
      let measUnit = analysisDataIndex(values, 'measUnit.id');
      if(handleType === '编辑'){
        c.id = productSRows[0].id;
        asyncEditTestFlowScope(c, product, item, standard, method, serviceGroup, measUnit);
      }else if (handleType === '添加'){
        asyncAddTestFlowScope(c, product, item, standard, method, serviceGroup, measUnit);
      }
    }

    // 查询可添加结果项
    const addScopeRecord = (sid, tid) => {
      asyncQueryScopeRecord(sid, tid);
    }

    // 编辑结果项
    const handleEditRecordSubmitSuccess = (values) => {
      let c = {
        name: values.name,
        nameEN: values.nameEN,
        reportName: values.reportName,
        reportNameEN: values.reportNameEN,
        samplingSite: values.samplingSite,
        numReplicates: values.numReplicates,
        max: values.max,
        min: values.min,
        places: values.places,
        indexScope: values.indexScope,
        orderNumber: values.orderNumber,
        lowControl1: values.lowControl1,
        lowControl2: values.lowControl2,
        lowControl3: values.lowControl3,
        lowControl4: values.lowControl4,
        lowControl5: values.lowControl5,
        highControl1: values.highControl1,
        highControl2: values.highControl2,
        highControl3: values.highControl3,
        highControl4: values.highControl4,
        highControl5: values.highControl5,
        specRule: values.specRule,
        description: values.description,
        descriptionEN: values.descriptionEN,
      };
      c.id = productSResultRows[0].id;
      let pid = productSClick.id;
      let measureUnit = analysisDataIndex(values, 'measureUnit.id');
      let resultType = analysisDataIndex(values, 'resultType.id');
      let roundRule = analysisDataIndex(values, 'roundRule.id');
      let resultsFile = analysisDataIndex(values, 'resultsFile.id');
      asyncEditScopeRecord(c, pid, measureUnit, resultType, roundRule, resultsFile);
    }

    const handleAddRecordSubmitSuccess = (recordIdArr) => {
      let scope = productSClick.id;
      asyncAddScopeRecord(scope, recordIdArr);
    };

    // 取消操作
    const handleAddEditFormCancel = () => {
      cancelAddEdit();
    }

    const preparedProduct = getPreparedItems(productData, preparedKeys);
    const prepareProgram = getPreparedItems(currentItem ? currentItem.productTest : [], preparedProgramKeys);
    const isOnlyRadio = preparedProduct.length === 1;
    const isMultipleChoice = preparedProduct.length >= 1;
    const notAllSame = isAllActiveOrDisable(preparedProduct) === 'notAllSame';
    const allActive = isAllActiveOrDisable(preparedProduct) === 'allActive';
    const allDisable = isAllActiveOrDisable(preparedProduct) === 'allDisable';

    // const prepareRecords = getPreparedItems(productSClick ? productSClick.resultScopeStandard : [], productSResultRowKeys);
    const prepareTestFlows = getPreparedItems(productScopeData, productSRowKeys);

    return (
      <div>
        <Spin spinning={isLoading} delay={300} >
          <Row gutter={16} style={{marginLeft: 0, marginRight: 0}}>
            <Col span={4}>
              <SearchableTree
                maxHeight = {80}
                categoryData = {categoryData}
                selectedKeys = {["" + selectedItemKey]}
                onSelect={asyncSelectItem}
                isMatch={isMatch}
                renderTitle={renderTreeNodeTitle}
              />
            </Col>
            <Col span={20}>
              <div className="panel panel-info" style={{margin:0}}>
                <div className="panel-body">
                  <div style={{ marginBottom: 16 }}>
                    <SecurityButtonBox>
                      <Button.Group>
                        <Button key={'doc.product.management.product.add'} disabled={!selectedItemKey} icon="file-add" onClick={handleTableButtonAdd} > 新增 </Button>
                        <Button key={'doc.product.management.product.edit'} disabled={!(isOnlyRadio)} icon="edit" onClick={handleTableButtonEdit} > 编辑 </Button>
                        <Button key={'doc.product.management.product.delete'} disabled={!(isMultipleChoice)} icon="delete" onClick={handleTableButtonDelete} > 删除 </Button>
                      </Button.Group>
                      <Button.Group>
                        <Button key={'doc.product.management.product.active'} disabled={!(isMultipleChoice && !notAllSame && allDisable)} icon="check-circle-o" onClick={handleTableButtonActive} > 激活 </Button>
                        <Button key={'doc.product.management.product.disable'} disabled={!(isMultipleChoice && !notAllSame && allActive)} icon="close-circle-o" onClick={handleTableButtonEnable} > 禁用 </Button>
                      </Button.Group>
                      <Button.Group>
                        <Button key={'doc.product.management.product.upVersion'} disabled={!(isOnlyRadio)} icon="plus-circle-o" onClick={handleTableButtonUp} > 升版 </Button>
                        <Button key={'doc.product.management.product.viewVersion'} disabled={!(isOnlyRadio)} icon="search" onClick={viewOldVersion} > 查看所有版本 </Button>
                      </Button.Group>
                      {/* <Button.Group>
                        <Button disabled={!preparedItems.length} icon="login" onClick={handleTableButtonImport} > 导入 </Button>
                        <Button disabled={!preparedItems.length} icon="logout" onClick={handleTableButtonExport} > 导出 </Button>
                      </Button.Group> */}
                    </SecurityButtonBox>
                  </div>
                  <AdvancedTable
                    mode={'Search'}
                    pagination={{pageSize:100, showQuickJumper:true}}
                    scroll={{y:125}}
                    onSelect={handleTableSelect}
                    onPrepare={handleTablePrepare}
                    isExpanded={false}
                    setting={productTableSetting}
                    data={productData}
                    colNum={'1'}
                    simpleSearchKey={[['名称','name'],['','nameEN'],['','testInvoicesName'], ['代码','code'], ['快捷码','shorthand'], ['同义词','synonyms']]}
                    avancedSearchForm={searchFormSetting}
                  />
                  <Tabs defaultActiveKey="1" style={{marginTop: '10px',}}>
                    <TabPane tab="检测方案" key="1">
                      <div style={{ marginBottom: 16, }}>
                        <SecurityButtonBox>
                          <Button.Group>
                            <Button key={'doc.product.management.testProgram.add'} disabled={!currentItem.id} icon="file-add" onClick={handleProgramButtonAdd} > 添加检测方案 </Button>
                            <Button key={'doc.product.management.testProgram.edit'} disabled={!(preparedPrograms.length === 1)} icon="edit" onClick={handleProgramButtonEdit} > 编辑检测方案 </Button>
                            <Button key={'doc.product.management.testProgram.delete'} disabled={!preparedPrograms.length} icon="delete" onClick={handleProgramButtonDelete} > 删除检测方案 </Button>
                          </Button.Group>
                          <Button key={'doc.product.management.testProgram.programConfig'} disabled={!(preparedPrograms.length === 1)} icon="file-text" onClick={handleProgramButtonShow} > 方案配置 </Button>
                        </SecurityButtonBox>
                      </div>
                      <BaseTable
                        options={ {pagination:{pageSize:5, showQuickJumper:true,}} }
                        onPrepare={handleProgramTablePrepare}
                        isExpanded={false}
                        setting={programTableSetting}
                        data={currentItem ? currentItem.productTest : []}
                      />
                    </TabPane>
                    <TabPane tab="检测范围" key="2">
                      <ProgramEditBusiness
                        testFlowData={productScopeData}//检测范围list data
                        preparedTestFlows={productSRows}//检测范围列表 rows
                        preparedTestFlowKeys={productSRowKeys}//检测范围列表 rowKeys
                        addTestFlow={productScopeAdd}//新增 弹框
                        preparedTestFlow={listProductScopeRows}//列表rows action
                        asyncDeleteItems={delProductScope}//删除检测范围
                        editTestFlow={productScopeEdit}//编辑 弹框
                        getCurrentItem={listProductScopeClick}//检测范围 点击项action
                        cancelDeleteItems={productScopeCancel}// 弹框 返回
                        currentItem={productSClick}//检测范围 点击项 data
                        preparedRecords={productSResultRows}//检测范围 结果项list data
                        addScopeRecord={addScopeRecord}
                        addRecordItem={addRecordItem}
                        editRecordItem={editScopeRecord}
                        asyncDeleteRecords={delProductSResult}//结果项 删除
                        preparedRecord={listProductSResultRows}//结果项 rows action
                      />
                    </TabPane>
                  </Tabs>
                </div>
              </div>
            </Col>
          </Row>

          <ProductAddEditDialog
            editType = {this.props.editType}
            visible = {editType === '新增' || editType === '编辑'}
            onFormSubmit = {handleEditFormSubmitSuccess}
            onFormCancel = {handleAddEditFormCancel}
            editItem = {preparedProduct[0]} />

          <ConfirmModal
            visible = {editType === 'upversion'}
            title ={modalTitle}
            information = {modalInformation}
            onConfirm = {handleUpVersionSuccess}
            onCancel = {handleAddEditFormCancel} />

          <ConfirmModal
            visible = {editType === 'activated_disabled'}
            title ={modalTitle}
            information = {modalInformation}
            onConfirm = {handleActiveEnable}
            onCancel = {handleAddEditFormCancel} />

          <ProductOldVersion
            visible = {editType === 'oldversion'}
            dataSource = {oldVersions}
            onConfirm = {handleAddEditFormCancel}
            onCancel = {handleAddEditFormCancel} />

          <ProgramAddDialog
            editType = {this.props.editType}
            visible = {editType === '新增检测方案' || editType === '编辑检测方案'}
            onFormSubmit = {handleAddProgramSubmitSuccess}
            onRecordCancel = {handleAddEditFormCancel}
            editRecordItem = {prepareProgram[0]} />

          <ProgramEditDialog
            visible = {editType === 'programshow'}
            onRecordSubmitSuccess = {handleAddEditFormCancel}
            onRecordCancel = {handleAddEditFormCancel}
            selectProgramId = {selectProgramId}
            editProgramItem = {preparedPrograms[0]} />

          {/* 检测范围 */}
          <TestItemScopeAddEditDialog
            editType = {handleType}
            visible = {handleType === '添加' || handleType === '编辑'}
            onFormSubmit = {handleSubmitSuccess}
            onFormCancel = {productScopeCancel}
            editItem = {prepareTestFlows[0]}
            testProgram = {preparedPrograms[0]} />

          <ScopeRecordEditDialog
            visible = {handleType === '编辑检测范围结果项'}
            onFormSubmit = {handleEditRecordSubmitSuccess}
            onRecordCancel = {productScopeCancel}
            editRecordItem = {productSResultRows[0]} />

          <ScopeRecordAddDialog
            visible = {handleType === '新增检测范围结果项'}
            onScopeRecordSubmitSuccess = {handleAddRecordSubmitSuccess}
            onRecordCancel = {productScopeCancel}
            preparedRecord = {listProductSResultRows}
            resultRecordAdd = {productSResultData}
            preparedAddRecord = {productSResultRows} />
        </Spin>
      </div>
    );
  }
}
