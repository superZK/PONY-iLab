import React, { Component } from 'react';
import { Row, Col, Spin, Button, Modal, message, Menu, Icon, Dropdown } from 'antd';
import CategoryEditDialog from './CategoryEditDialog';
import SearchableTree from '../../public/SearchableTree';
import BaseTable from '../../public/BaseTable';
import SecurityButtonBox from '../../public/SecurityButtonBox';
import Setting from '../../../config/index';
import { getPathOfNode } from '../../../util/treeUtils';
import { getPreparedItems } from '../../../util/getPreparedItems';
import 'antd/dist/antd.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class CategoryManagement extends Component{

  componentDidMount(){
    const {asyncLoadData} = this.props;
    asyncLoadData(this.props.categoryType, this.props.categoryName);
  }

  render(){
    const {
      isLoading,
      editType,
      categoryData,
      selectedCategory,
      preparedCategories = [],
      preparedKeys,//勾选项的key
      maxLevel = 10,
    } = this.props;

    const {
      addCategory,
      asyncSaveCategory,
      selectCategory,
      prepareCategory,
      editCategory,
      cancelEditCategory,
      asyncDeleteCategories,
    } = this.props;

    const categoryTableSetting = Setting.CategorySetting.table.category;

    // 可搜索树渲染规则与匹配规则
    const isMatch = (item, searchValue) => {
      return (
        (item.name && item.name.includes(searchValue))
        || (item.code && item.code.includes(searchValue))
        || (item.shorthand && item.shorthand.includes(searchValue))
      );
    }

    const renderTreeNodeTitle = (item) => {
      return `${item.name}(${item.code})`;
    }

    // 获取最高层级
    const getSelectCategoryLevel = () => {
      let path = getPathOfNode(categoryData, 'id', 'subordinate', selectedCategory.id);
      return path.length - 1;
    }

    // 新增+编辑
    const handleTableButtonAdd = (event) => {
      if(maxLevel <= getSelectCategoryLevel()){
        message.error(`超出当前类型层级限制，最多[${maxLevel}]级`);
        return;
      }
      addCategory();
    }

    const handleTableButtonEdit = (event) => {
      editCategory();
    }

    const handleEditFormSubmitSuccess = (values) => {
      let c = {
        code: values.code,
        name: values.name,
        nameEN: values.nameEN,
        type: this.props.categoryType,
        subordinate: []
      };
      if(editType !== '新增')
        c.id = preparedCategories[0].id;
      asyncSaveCategory(c, selectedCategory, editType, this.props.categoryType);
    }

    const handleTablePrepare = (rows, rowKeys) => {
      prepareCategory(rows, rowKeys);
    }

    // 删除
    const handleTableButtonDelete = () => {
      let hasChildren = false;
      for(let c of preparedCategories){
        if(c && c.subordinate && c.subordinate.length > 0){
          hasChildren = true;
          break;
        }
      }

      Modal.confirm({
        title: "删除目录",
        content: hasChildren ? "所选目录包含下级目录，将一并被删除。是否确认？" : "是否确认删除所选目录？",
        onOk(){ asyncDeleteCategories(preparedCategories.map((item) => (item.id))) },
        onCancel(){ handleEditFormCancel() },
      });
    }

    // 取消操作
    const handleEditFormCancel = () => {
      cancelEditCategory();
    }

    const prepareItems = getPreparedItems(selectedCategory ? selectedCategory.subordinate : [], preparedKeys);
    const isOnlyRadio = prepareItems.length === 1;
    const isMultipleChoice = prepareItems.length >= 1;

    return (
      <div>
        <Spin spinning={isLoading} delay={300} >
          <Row gutter={16} style={{marginLeft: 0, marginRight: 0}}>
            <Col span={4}>
              <SearchableTree
                maxHeight = {80}
                categoryData = {categoryData}
                selectedKeys = {["" + selectedCategory.id]}
                onSelect={selectCategory}
                isMatch={isMatch}
                renderTitle={renderTreeNodeTitle}
                />
            </Col>
            <Col span={20}>
              <div className="panel panel-info" style={{margin:0}}>
                <div className="panel-heading">
                  <SecurityButtonBox>
                    <Button style={{marginLeft: 10}} key={this.props.nodeId + '.add'} disabled={!('id' in selectedCategory)} icon="file-add" onClick={handleTableButtonAdd} > 新增 </Button>
                    <Button style={{marginLeft: 10}} key={this.props.nodeId + '.edit'} disabled={!(isOnlyRadio)} icon="edit" onClick={handleTableButtonEdit} > 编辑 </Button>
                    <Button style={{marginLeft: 10}} key={this.props.nodeId + '.delete'} disabled={!(isMultipleChoice)} icon="delete" onClick={handleTableButtonDelete} > 删除 </Button>
                  </SecurityButtonBox>
                </div>
                <div className="panel-body">
                  <BaseTable
                    onPrepare={handleTablePrepare}
                    isExpanded={false}
                    setting={categoryTableSetting}
                    data={selectedCategory ? selectedCategory.subordinate : []}
                  />
                </div>
              </div>
            </Col>
          </Row>
          <CategoryEditDialog
            editType = {this.props.editType}
            visible = {editType === '新增' || editType === '编辑'}
            onFormSubmit = {handleEditFormSubmitSuccess}
            onFormCancel = {handleEditFormCancel}
            editCategory = {prepareItems[0]} />
        </Spin>
      </div>
    );
  }
}
