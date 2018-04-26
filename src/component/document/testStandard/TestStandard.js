import React, {Component} from 'react';
import { Row, Col, Spin, Button, Modal } from 'antd';
import TestStandardAddEditDialog from './TestStandardAddEditDialog';
import TestStandardOldVersion from './TestStandardOldVersion';
import SearchableTree from '../../public/SearchableTree';
import AdvancedTable from '../../public/Table/AdvancedTable';
import ConfirmModal from '../../public/ConfirmModal';
import SecurityButtonBox from '../../public/SecurityButtonBox';
import Setting from '../../../config/index';
import { getPreparedItems, isAllActiveOrDisable } from '../../../util/getPreparedItems';
import 'antd/dist/antd.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class TestStandard extends Component{
  componentDidMount(){
    const {asyncLoadData} = this.props;
    asyncLoadData("1004", "检测标准");
  }

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
      standardData,
      preparedItems,
      preparedKeys,//勾选项的key
      modalTitle,
      modalInformation,
      oldVersions,
      standardLinkedTestItems,
    } = this.props;

    const {
      asyncSelectItem,
      addItem,
      asyncSaveItem,
      prepareItem,
      editItem,
      asyncDeleteItems,
      getTestItems,
      upItem,
      asyncUpVersion,
      activeItem,
      enableItem,
      asyncActiveEnable,
      viewOldVersionItem,
      discardItem,
      asyncDiscard,
      // importItem,
      // exportItem,
      cancelAddEdit,
      cancelDeleteItems,
    } = this.props;

    const standradTableSetting = Setting.TestStandardSetting.table.testStandard;
    const testItemTableSetting = Setting.TestItemSetting.table.testItem;
    const searchFormSetting = Setting.TestStandardSetting.form.searchForm;

    //搜索树的匹配规则
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

    //获取表格勾选项的keys
    const handleTablePrepare = (rows, rowKeys) => {
      prepareItem(rows, rowKeys);
    }

    // 获取表格点击项，并查询关联检测项目
    const handleTableSelect = (record) => {
      getTestItems(record.id);
    };

    // 新增 + 编辑检测标准
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
        nation: values.nation,
        standardIntro: values.standardIntro,
        effectiveDate: values.effectiveDate,
        expiryDate: values.expiryDate,
        standardReplace: values.standardReplace,
        qualificationType: values.qualificationType,
        publishUnit: values.publishUnit,
        publishDate: values.publishDate,
        releventUnit: values.releventUnit,
        publishNo: values.publishNo,
        officialSource: values.officialSource,
        icsclass: values.icsclass,
      };
      if(editType === '编辑'){
        c.id = preparedItems[0].id;
        c.version = preparedItems[0].version;
        let testStandardParentId = (preparedItems && preparedItems.length > 0 ) ? preparedItems[0].standardParent.id : '';
        asyncSaveItem(c, editType, selectedItemKey, testStandardParentId);
      }else if(editType === '新增'){
        asyncSaveItem(c, editType, selectedItemKey);
      }
    }

    // 删除检测标准
    const handleTableButtonDelete = () => {
      let hasChildren = false;
      for(let c of preparedItems){
        if(c.resultRecord && c.resultRecord.length > 0){
          hasChildren = true;
          break;
        }
      }
      Modal.confirm({
        title: "删除检测标准",
        content: hasChildren ? "所选检测标准已经在质量标准、检测方法步骤、结果、报告中使用了，确认删除？" : "是否确认删除所选目录？",
        onOk(){ asyncDeleteItems(preparedItems.map((item) => (item.id))) },
        onCancel(){ cancelDeleteItems() },
      });
    }

    // 检测标准升版
    const handleTableButtonUp = (event) => {
      upItem();
    }

    const handleUpVersionSuccess = () => {
      let parentId = (preparedItems && preparedItems.length > 0 ) ? preparedItems[0].standardParent.id : '';
      let standradId = (preparedItems && preparedItems.length > 0 ) ? preparedItems[0].id : '';
      asyncUpVersion(parentId, standradId);
    }

    // 检测标准激活与禁用
    const handleTableButtonActive = (event) => {
      activeItem();
    }
    const handleTableButtonEnable = (event) => {
      enableItem();
    }

    const handleActiveEnable = () => {
      asyncActiveEnable(preparedItems.map((items) => {return items.id}));
    }

    // 废弃状态
    const handleDiscard = (event) => {
      asyncDiscard(preparedItems[0].id);
    }

    const viewOldVersion = (event) => {
      let parentId = (preparedItems && preparedItems.length > 0 ) ? preparedItems[0].standardParent.id : '';
      viewOldVersionItem(parentId);
    }

    // 取消操作
    const handleAddEditFormCancel = () => {
      cancelAddEdit();
    }

    const handleTableButtonDiscard = (event) => {
      discardItem();
    }

    // 检测标准导出与导入(未实现)
    // const handleTableButtonImport = (event) => {
    //   importItem();
    // }
    // const handleTableButtonExport = (event) => {
    //   exportItem();
    // }

    const prepareItems = getPreparedItems(standardData, preparedKeys);
    const isOnlyRadio = prepareItems.length === 1;
    const isMultipleChoice = prepareItems.length >= 1;
    const isDiscard = isOnlyRadio && prepareItems[0].discard === true;
    const notAllSame = isAllActiveOrDisable(prepareItems) === 'notAllSame';
    const allActive = isAllActiveOrDisable(prepareItems) === 'allActive';
    const allDisable = isAllActiveOrDisable(prepareItems) === 'allDisable';

    return (
      <div>
        <Spin spinning={isLoading} delay={300} >
          <Row gutter={16} style={{marginLeft: 0, marginRight: 0}}>
            <Col span={4}>
              <SearchableTree
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
                        <Button key={'doc.testStandard.management.add'} disabled={!selectedItemKey} icon="file-add" onClick={handleTableButtonAdd} > 新增 </Button>
                        <Button key={'doc.testStandard.management.edit'} disabled={!(isOnlyRadio && !isDiscard)} icon="edit" onClick={handleTableButtonEdit} > 编辑 </Button>
                        <Button key={'doc.testStandard.management.delete'} disabled={!(isMultipleChoice && !isDiscard)} icon="delete" onClick={handleTableButtonDelete} > 删除 </Button>
                      </Button.Group>
                      <Button.Group>
                        <Button key={'doc.testStandard.management.active'} disabled={!(isMultipleChoice && !notAllSame && allDisable)} icon="check-circle-o" onClick={handleTableButtonActive} > 激活 </Button>
                        <Button key={'doc.testStandard.management.disable'} disabled={!(isMultipleChoice && !notAllSame && allActive)} icon="close-circle-o" onClick={handleTableButtonEnable} > 禁用 </Button>
                      </Button.Group>
                      <Button.Group>
                        <Button key={'doc.testStandard.management.upVersion'} disabled={!(isOnlyRadio)} icon="plus-circle-o" onClick={handleTableButtonUp} > 升版 </Button>
                        <Button key={'doc.testStandard.management.viewVersion'} disabled={!(isOnlyRadio)} icon="search" onClick={viewOldVersion} > 查看所有版本 </Button>
                      </Button.Group>
                        <Button style={{marginRight: 10}} key={'doc.testStandard.management.discard'} disabled={!(isOnlyRadio)} icon="exclamation-circle-o" onClick={handleTableButtonDiscard} > 废弃 </Button>
                      {/* <Button.Group>
                        <Button disabled={!preparedItems.length} icon="login" onClick={handleTableButtonImport} > 导入 </Button>
                        <Button disabled={!preparedItems.length} icon="logout" onClick={handleTableButtonExport} > 导出 </Button>
                      </Button.Group> */}
                    </SecurityButtonBox>
                  </div>
                  <AdvancedTable
                    pagination={{pageSize:100, showQuickJumper:true}}
                    scroll={{x:0, y:185}}
                    onSelect={handleTableSelect}
                    onPrepare={handleTablePrepare}
                    isExpanded={true}
                    setting={standradTableSetting}
                    data={standardData}
                    colNum={'1'}
                    renderKey={['code', 'name']}
                    simpleSearchKey={[['名称','name'], ['代码','code'], ['快捷码','shorthand'], ['标准替换','standardReplace']]}
                    avancedSearchForm={searchFormSetting}
                  />
                  <AdvancedTable
                    mode={'Simple'}
                    pagination={{pageSize:5, showQuickJumper:true}}
                    onPrepare={false}
                    isExpanded={true}
                    setting={testItemTableSetting}
                    data={standardLinkedTestItems}
                  />
                </div>
              </div>
            </Col>
          </Row>

          <TestStandardAddEditDialog
            editType = {this.props.editType}
            visible = {editType === '新增' || editType === '编辑'}
            onFormSubmit = {handleEditFormSubmitSuccess}
            onFormCancel = {handleAddEditFormCancel}
            editItem = {preparedItems[0]} />

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

          <ConfirmModal
            visible = {editType === 'discard'}
            title ={modalTitle}
            information = {modalInformation}
            onConfirm = {handleDiscard}
            onCancel = {handleAddEditFormCancel} />

          <TestStandardOldVersion
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
