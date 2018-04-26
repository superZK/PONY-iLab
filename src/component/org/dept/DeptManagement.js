import React, { Component } from 'react';
import fetchData from '../../../util/fetchGateway';
import { Row, Col, Spin, Button } from 'antd';
import DeptAddEditDialog from './DeptAddEditDialog';
import SearchableTree from '../../public/SearchableTree';
import SearchableSelector from '../../public/SearchableSelector';
import ConfirmModal from '../../public/ConfirmModal';
import Setting from '../../../config/index';
import BaseTable from '../../public/BaseTable';
import SecurityButtonBox from '../../public/SecurityButtonBox';
import { getPreparedItems } from '../../../util/getPreparedItems';
import 'antd/dist/antd.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class DeptManagement extends Component {
  state = {defaultSite: '', siteName: ''}

  // 获取当前用户组织信息首选项查询用户
  getDefaultSite = () => {
    fetchData('/sys/mode').then(
      (receipt) => {
        this.setState({
          defaultSite: receipt.data[0].siteId ? receipt.data[0].siteId : '',
          siteName: receipt.data[0].siteName ? receipt.data[0].siteName : '',
        });
        let siteName = receipt.data[0].siteName ? receipt.data[0].siteName : '';
        let siteId = receipt.data[0].siteId ? receipt.data[0].siteId : '';
        const { asyncLoadDept } = this.props;
        asyncLoadDept(siteId, siteName);
      },
      (error) => {console.log(error)}
    );
  }

  // 加载用户组数据
  componentDidMount(){
    this.getDefaultSite();
  }

  render() {
    const { defaultSite, siteName } = this.state;
    const {
      isLoading,
      deptTree,//组织+部门数据树结构
      editType,//操作类型
      selectedDeptItem,//可搜索树选中的部门数据
      preparedDepts,//表格勾选项
      preparedKeys,//表格勾选项Keys
      modalTitle,//公用modal标题
      modalInformation,//公用modal内容
    } = this.props;

    const {
      asyncLoadDept,//加载部门数据
      selectedDept,//获取可搜索树选中的节点
      addDept,//打开新增modal
      asyncSaveDept,//新增+编辑部门数据
      preparedDept,//获取表格勾选项
      editDept,//打开编辑modal
      deleteDept,//打开删除modal
      asyncDeleteDepts,//删除部门数据
      addSubordinate,//复制部门数据添加到树节点中
      cancelHandle,//取消操作
    } = this.props;

    const deptTableSetting = Setting.DeptSetting.table.Dept;//表格配置项

    // 可搜索树匹配规则
    const isMatch = (item, searchValue) => {
      return (
        (item.name && item.name.includes(searchValue))
        || (item.code && item.code.includes(searchValue))
        || (item.shorthand && item.shorthand.includes(searchValue))
      );
    }
    // 可搜索树渲染规则
    const renderTreeNodeTitle = (item) => {
      return `${item.name}`;
    }

    // 选中select中某一节点时，发送查询部门数据请求
    const handleSelect = (value, option) => {
      asyncLoadDept(option.props.value, option.props.label);
      this.setState({
        defaultSite: value,
        siteName: option.props.label,
      });
    }

    const handleChange = (value, option) => {
      this.setState({
        defaultSite: value || '',
      });
      if(!value){
        this.setState({
          siteName: '',
        });
      }
    }

    // 新增+编辑部门数据
    const handleTableButtonAdd = () => {
      addDept();
    }

    const handleTableButtonEdit = () => {
      editDept();
    }

    const handleAddEditFormSubmitSuccess = (values) => {
      let c = {
        name: values.name,
        code: values.code,
        siteId: this.state.defaultSite,
        typeId: values.deptTypeId,
        service_groupId: values.serviceGroupId,
      };
      // let idStr = selectedDeptItem ? selectedDeptItem.id : '';
      // let selectedDeptItemId = idStr.toString().replace(/[^0-9]/ig,"");

      // 判断pid是数字还是字符，如果为字符串，则父对象为组织对象
      let selectedItemId = selectedDeptItem ? selectedDeptItem.id : '';
      let selectedDeptItemId = '';
      if(typeof(selectedItemId) !== 'string'){
        selectedDeptItemId = selectedItemId;
      }
      if(editType === '编辑')
        c.id = preparedDepts[0].id;
      asyncSaveDept(c, editType, selectedDeptItemId, c.siteId, c.typeId, c.service_groupId);
    }

    // 删除部门数据
    const handleTableButtonDelete = () => {
      deleteDept();
    }

    const handleDeleteSuccess = () => {
      asyncDeleteDepts(preparedDepts.map((item) => (item.id)));
    }

    // 获取表格勾选项
    const handleTablePrepare = (rows, rowKeys) => {
      preparedDept(rows, rowKeys);
    }

    //通用取消方法
    const handleFormCancel = () => {
      cancelHandle();
    }

    const prepareItems = getPreparedItems(selectedDeptItem ? selectedDeptItem.subordinate : [], preparedKeys)

    return(
      <div>
      <Spin spinning={isLoading} delay={300} >
        <Row gutter={16} style={{marginLeft: 0, marginRight: 0}}>
          <Col span={4}>
            <SearchableSelector
            options={{allowClear:true, style:{ width: '100%'} }}
            onSelect={handleSelect}
            onChange={handleChange}
            disabled={false}
            lazyMode={false}
            defaultValue={this.state.defaultSite}
            url='/org/site/select' />
            <SearchableTree
            categoryData = {deptTree}
            defaultExpandedKeys={[deptTree.length ? deptTree[0].id + '' : '']}
            selectedKeys = {["" + selectedDeptItem.id]}
            onSelect={selectedDept}
            isMatch={isMatch}
            renderTitle={renderTreeNodeTitle}
            />
          </Col>
          <Col span={20}>
            <div className="panel panel-info" style={{margin: 0}}>
              <div className="panel-body">
                <div style={{ marginBottom: 16 }}>
                  <SecurityButtonBox>
                    <Button.Group>
                      <Button key={'org.dept.management.add'} disabled={!('id' in selectedDeptItem)} icon="file-add" onClick={handleTableButtonAdd} > 新增 </Button>
                      <Button key={'org.dept.management.edit'} disabled={preparedDepts.length !== 1} icon="edit" onClick={handleTableButtonEdit} > 编辑 </Button>
                      <Button key={'org.dept.management.delete'} disabled={!preparedDepts.length} icon="delete" onClick={handleTableButtonDelete} > 删除 </Button>
                    </Button.Group>
                  </SecurityButtonBox>
                </div>
                <BaseTable
                  options={ {pagination:{pageSize:5, showQuickJumper:true,}} }
                  onPrepare={handleTablePrepare}
                  isExpanded={false}
                  setting={deptTableSetting}
                  data={selectedDeptItem ? selectedDeptItem.subordinate : []}
                />
              </div>
            </div>
          </Col>
        </Row>
        <DeptAddEditDialog
          editType = {this.props.editType}
          visible = {editType === '新增' || editType === '编辑'}
          onFormSubmit = {handleAddEditFormSubmitSuccess}
          onFormCancel = {handleFormCancel}
          editItem = {prepareItems[0]}
          defaultSite = {this.state.defaultSite}
          siteName = {this.state.siteName}
          />
        <ConfirmModal
          visible = {editType === 'delete'}
          title ={modalTitle}
          information = {modalInformation}
          onConfirm = {handleDeleteSuccess}
          onCancel = {handleFormCancel}
          />
      </Spin>
    </div>
    );

  }

}
