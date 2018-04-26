import React, {Component} from 'react';
import { Row, Col, Spin, Button, Modal, Icon } from 'antd';
import TestItemsEditDialog from './TestItemsEditDialog';
import ResultRecordEditDialog from './ResultRecordEditDialog';
import TestItemsOldVersion from './TestItemsOldVersion';
import SearchableTree from '../../public/SearchableTree';
import AdvancedTable from '../../public/Table/AdvancedTable';
import ConfirmModal from '../../public/ConfirmModal';
import SecurityButtonBox from '../../public/SecurityButtonBox';
import Setting from '../../../config/index';
import { getPreparedItems, isAllActiveOrDisable } from '../../../util/getPreparedItems';
import { analysisDataIndex, cloneObj } from '../../../util/treeUtils';
import 'antd/dist/antd.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class TestItems extends Component{
  // 加载搜索树数据
  componentDidMount(){
    const {asyncLoadData} = this.props;
    asyncLoadData("1002", "检测项目");
  }

  // 关于版本的操作后重新查询一遍数据
  componentWillReceiveProps(prop){
    const {asyncSelectItem} = this.props;
    if(prop.needReload){
      asyncSelectItem([this.props.selectedItemKey]);
    }
  }

  render(){
    const {
      isLoading,
      editType,
      categoryData,
      selectedItemKey,
      itemData,
      preparedItems,
      preparedKeys,
      preparedRecordKeys,
      currentItem,
      preparedRecords,
      modalTitle,
      modalInformation,
      oldVersions,
      needReload,
    } = this.props;

    const {
      asyncSelectItem,
      addItem,
      editItem,
      asyncSaveItem,
      prepareItem,
      asyncDeleteItems,
      upItem,
      asyncUpVersion,
      activeItem,
      enableItem,
      asyncActiveEnable,
      viewOldVersionItem,
      getCurrentItem,
      preparedRecord,
      addRecordItem,
      editRecordItem,
      asyncEditRecordItem,
      asyncDeleteRecords,
      cancelAddEdit,
      cancelDeleteItems,
      importItem,
      exportItem,
    } = this.props;

    const testItemTableSetting = Setting.TestItemSetting.table.testItem;
    const recordTableSetting = Setting.TestItemSetting.table.resultRecord;
    const searchFormSetting = Setting.TestItemSetting.form.searchForm;

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

    // 获取检测项目表格勾选项节点
    const handleTablePrepare = (rows, rowKeys) => {
      prepareItem(rows, rowKeys);
    }

    // 新增 + 编辑检测项目
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
        displayAs: values.displayAs,
        alias: values.alias,
        instrumentGroup: values.instrumentGroup,
        instrumentNumber: values.instrumentNumber,
        reportName: values.reportName,
        reportNameEN: values.reportNameEN,
        description: values.description,
        lab: values.lab,
        cas: values.cas,
        synonyms: values.synonyms,
        testLocation: values.testLocation,
        storageCondition: values.storageCondition,
        inspectDosage: values.inspectDosage,
        dosageUnit: values.dosageUnit,
        inspectInterval: values.inspectInterval,
        unitPrice: values.unitPrice,
        aliquotGroup: values.aliquotGroup,
        autoAuthorize: values.autoAuthorize,
        autoReject: values.autoReject,
        destructiveness: values.destructiveness,
      };
      if(editType === '编辑'){
        c.id = preparedItems[0].id;
        c.version = preparedItems[0].version;
        let testItemParentId = (preparedItems && preparedItems.length > 0 ) ? preparedItems[0].testItemParent.id : '';
        asyncSaveItem(c, editType, selectedItemKey, testItemParentId);
      }else if(editType === '新增'){
        asyncSaveItem(c, editType, selectedItemKey);
      }
    }

    // 删除检测项目
    const handleTableButtonDelete = () => {
      let hasChildren = false;
      for(let c of preparedItems){
        if(c.resultRecordList && c.resultRecordList.length > 0){
          hasChildren = true;
          break;
        }
      }
      Modal.confirm({
        title: "删除检测项目",
        content: hasChildren ? "所选检测项目已经在质量标准、检测方法步骤、结果、报告中使用了，确认删除？" : "是否确认删除所选目录？",
        onOk(){ asyncDeleteItems( preparedItems.map((item) => (item.id))) },
        onCancel(){ cancelDeleteItems() },
      });
    }

    // 检测项目升版
    const handleTableButtonUp = (event) => {
      upItem();
    }

    const handleUpVersionSuccess = () => {
      let testItemId = (preparedItems && preparedItems.length > 0 ) ? preparedItems[0].testItemParent.id : '';
      let testItemVersionId = (preparedItems && preparedItems.length > 0 ) ? preparedItems[0].id : '';
      asyncUpVersion(testItemId, testItemVersionId);
    }

    // 检测项目激活与禁用
    const handleTableButtonActive = (event) => {
      activeItem();
    }
    const handleTableButtonEnable = (event) => {
      enableItem();
    }

    // 查看检测项目所有版本
    const viewOldVersion = (event) => {
      let testItemVersionId = (preparedItems && preparedItems.length > 0 ) ? preparedItems[0].testItemParent.id : '';
      viewOldVersionItem(testItemVersionId);
    }

    const handleTestItemActiveEnable = () => {
      asyncActiveEnable((preparedItems && preparedItems.length > 0) && preparedItems.map((items) => {return items.id}));
    }

    //检测项目导出与导入（未实现）
    // const handleTableButtonImport = (event) => {
    //   importItem();
    // }
    // const handleTableButtonExport = (event) => {
    //   exportItem();
    // }

    // 获取检测项目表格点击行对象
    const handleTableSelect = (record, index) => {
      getCurrentItem(record);
    };

    // 获取结果项表格勾选项节点
    const recordTablePrepare = (rows, rowKeys) => {
      preparedRecord(rows, rowKeys);
    }


    //新增 + 编辑结果项
    const handleRecordButtonAdd = (event) => {
      addRecordItem();
    }

    const handleRecordButtonEdit = (event) => {
      editRecordItem();
    }

    const handleEditRecordSubmitSuccess = (values) => {
      if(editType === '编辑检测项目结果项'){
        values.id = preparedRecords[0].id;
        var pid = analysisDataIndex(preparedRecords[0], 'testItem.id');
      }else if (editType === '新增检测项目结果项'){
        pid = currentItem.id;
      }
      let c = cloneObj(values)
      delete c.measUnit;
      delete c.resultType;
      delete c.roundRule;
      delete c.resultsFile;
      let measUnitId = analysisDataIndex(values, 'measUnit.id');
      let resultId = analysisDataIndex(values, 'resultType.id');
      let roundRuleId = analysisDataIndex(values, 'roundRule.id');
      let resultsFileId = analysisDataIndex(values, 'resultsFile.id');
      asyncEditRecordItem(c, pid, resultId, measUnitId, roundRuleId, resultsFileId, editType);
    }

    // 删除结果项
    const handleRecordButtonDelete = () => {
      let recordIds = preparedRecords.map((item) => (item.id));
      Modal.confirm({
        title: "删除结果项",
        content: "是否确认删除所选结果项？",
        onOk(){ asyncDeleteRecords(recordIds) },
        onCancel(){ cancelDeleteItems() },
      });
    }

    // 取消操作
    const handleAddEditFormCancel = () => {
      cancelAddEdit();
    }

    const prepareItems = getPreparedItems(itemData, preparedKeys);
    const prepareRocords = getPreparedItems(currentItem ? currentItem.resultRecordList : [], preparedRecordKeys);
    const isOnlyRadio = prepareItems.length === 1;
    const isMultipleChoice = prepareItems.length >= 1;
    const isDisable = isOnlyRadio && prepareItems[0].activation === false;
    const isActive = isOnlyRadio && prepareItems[0].activation === true;
    const notAllSame = isAllActiveOrDisable(prepareItems) === 'notAllSame';
    const allActive = isAllActiveOrDisable(prepareItems) === 'allActive';
    const allDisable = isAllActiveOrDisable(prepareItems) === 'allDisable';

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
              <div className="panel panel-info" style={{ margin:0}}>
                <div className="panel-body">
                  <div style={{ marginBottom: 16 }}>
                    <SecurityButtonBox>
                      <Button.Group>
                        <Button key={'doc.testItem.management.testItem.add'} disabled={!selectedItemKey} icon="file-add" onClick={handleTableButtonAdd} > 新增 </Button>
                        <Button key={'doc.testItem.management.testItem.edit'} disabled={!(isOnlyRadio)} icon="edit" onClick={handleTableButtonEdit} > 编辑 </Button>
                        <Button key={'doc.testItem.management.testItem.delete'} disabled={!(isMultipleChoice)} icon="delete" onClick={handleTableButtonDelete} > 删除 </Button>
                      </Button.Group>
                      <Button.Group style={{marginLeft: 10}}>
                        <Button key={'doc.testItem.management.testItem.active'} disabled={!(isMultipleChoice && !notAllSame && allDisable)} icon="check-circle-o" onClick={handleTableButtonActive} > 激活 </Button>
                        <Button key={'doc.testItem.management.testItem.disable'} disabled={!(isMultipleChoice && !notAllSame && allActive)} icon="close-circle-o" onClick={handleTableButtonEnable} > 禁用 </Button>
                      </Button.Group>
                      <Button.Group style={{marginLeft: 10}}>
                        <Button key={'doc.testItem.management.testItem.upVersion'} disabled={!(isOnlyRadio)} icon="plus-circle-o" onClick={handleTableButtonUp} > 升版 </Button>
                        <Button key={'doc.testItem.management.testItem.viewVersion'} disabled={!(isOnlyRadio)} icon="search" onClick={viewOldVersion} > 查看所有版本 </Button>
                      </Button.Group>
                      {/* <Button.Group style={{marginLeft: 10}}>
                        <Button style={{marginLeft: 10}} disabled={!preparedItems.length} icon="login" onClick={handleTableButtonImport} > 导入 </Button>
                        <Button style={{marginLeft: 10}} disabled={!preparedItems.length} icon="logout" onClick={handleTableButtonExport} > 导出 </Button>
                      </Button.Group> */}
                    </SecurityButtonBox>
                  </div>
                  <AdvancedTable
                    pagination={{pageSize:100, showQuickJumper:true}}
                    scroll={{x:0, y:125}}
                    onSelect={handleTableSelect}
                    onPrepare={handleTablePrepare}
                    isExpanded={true}
                    setting={testItemTableSetting}
                    data={itemData}
                    colNum={'1'}
                    simpleSearchKey={[['名称','name'], ['','displayAs'], ['','alias'], ['代码','code'], ['快捷码','shorthand']]}
                    avancedSearchForm={searchFormSetting}
                  />

                  <div style={{ marginBottom: 16, marginTop: 16 }}>
                    <SecurityButtonBox>
                      <Button.Group>
                        <Button key={'doc.testItem.management.resultRecord.add'} disabled={!currentItem.id} icon="file-add" onClick={handleRecordButtonAdd} > 添加结果项 </Button>
                        <Button key={'doc.testItem.management.resultRecord.edit'} disabled={!(preparedRecords.length === 1)} icon="edit" onClick={handleRecordButtonEdit} > 编辑结果项 </Button>
                        <Button key={'doc.testItem.management.resultRecord.delete'} disabled={!preparedRecords.length} icon="delete" onClick={handleRecordButtonDelete} > 删除结果项 </Button>
                      </Button.Group>
                    </SecurityButtonBox>
                  </div>
                    <AdvancedTable
                      mode={'Simple'}
                      pagination={{pageSize:5, showQuickJumper:true}}
                      onPrepare={recordTablePrepare}
                      isExpanded={true}
                      setting={recordTableSetting}
                      data={currentItem ? currentItem.resultRecordList : []}
                    />
                </div>
              </div>
            </Col>
          </Row>

          <TestItemsEditDialog
            editType = {this.props.editType}
            visible = {editType === '新增' || editType === '编辑'}
            onFormSubmit = {handleEditFormSubmitSuccess}
            onFormCancel = {handleAddEditFormCancel}
            editItem = {prepareItems[0]} />

          <ResultRecordEditDialog
            editType = {this.props.editType}
            visible = {editType === '新增检测项目结果项' || editType === '编辑检测项目结果项'}
            onFormSubmit = {handleEditRecordSubmitSuccess}
            onFormCancel = {handleAddEditFormCancel}
            editingRecordItem = {prepareRocords[0]} />

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
            onConfirm = {handleTestItemActiveEnable}
            onCancel = {handleAddEditFormCancel} />

          <TestItemsOldVersion
            visible = {editType === 'oldversion'}
            dataSource = {oldVersions}
            onConfirm = {handleAddEditFormCancel}
            onCancel = {handleAddEditFormCancel}
             />
        </Spin>
      </div>
    );
  }
}
