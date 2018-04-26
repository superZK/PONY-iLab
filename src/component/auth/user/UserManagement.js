import React, { Component } from 'react';
import fetchData from '../../../util/fetchGateway';
import { Row, Col, Spin, Tree, Table, Breadcrumb, Button, Modal, message } from 'antd';
import UserAddEditDialog from './UserAddEditDialog';
import UserForbidDialog from './UserForbidDialog';
import UserLinkGroupDialog from './UserLinkGroupDialog';
import SearchableTree from '../../public/SearchableTree';
import SearchableSelector from '../../public/SearchableSelector';
import BaseForm from '../../public/BaseForm';
import BaseTable from '../../public/BaseTable';
import ConfirmModal from '../../public/ConfirmModal';
import SecurityButtonBox from '../../public/SecurityButtonBox';
import Setting from '../../../config/index';
import { getPathOfNode, filterUrlByParams } from '../../../util/treeUtils';
import { getPreparedItems } from '../../../util/getPreparedItems';
import 'antd/dist/antd.css';
import 'bootstrap/dist/css/bootstrap.min.css';
const TreeNode = Tree.TreeNode;

export default class UserManagement extends Component {
  state = {
    siteId: '',//下拉框组织ID
    deptId: '',//下拉框部门ID
    defaultSiteId: '',//首加载组织Id
  }

  // 获取当前用户组织信息首选项查询用户
  getDefaultSite_User = () => {
    fetchData('/sys/mode').then(
      (receipt) => {
        this.setState({
          defaultSiteId: receipt.data[0].siteId ? receipt.data[0].siteId : '',
        });
        const { asyncLoadUser } = this.props;
        let defaultSiteId = receipt.data[0].siteId ? receipt.data[0].siteId : '';
        asyncLoadUser(defaultSiteId);
      },
      (error) => {console.log(error)}
    );
  }

  // 加载用户组数据
  componentWillMount(){
    const {asyncLoadGroupData} = this.props;
    asyncLoadGroupData('1016', '用户组');
    this.getDefaultSite_User();
  }

  render() {
    const {
      isLoading,
      editType,//操作类型
      userData,//用户数据
      groupData,//用户组树结构
      selectedGruop,//用户组树勾选对象
      preparedUsers,//表格勾选项
      preparedKeys,//勾选项的key
      modalTitle,//公用modal标题
      modalInformation,//公用modal内容
    } = this.props;

    const {
      handleGroupSelect,//用户组树节点选取
      asyncLoadUser,//查询用户信息
      addUser,//打开新增modal
      asyncSaveUser,//新增+编辑用户数据
      LinkGroup,//打开关联用户组modal
      asyncLinkUserToGroup,//关联用户组
      DisconnectGroup,//解除关联用户组
      preparedUser,//获取表格勾选项
      editUser,//打开编辑modal
      forbidUser,//打开锁定modal
      allowUser,//打开解除锁定modal
      asyncAllowForbid,//激活或锁定用户
      disableUser,//打开禁用modal
      activeUser,//打开激活modal
      asyncDisable,//禁用用户
      asyncModifyPws,//重置密码
      cancelHandle,//取消操作
    } = this.props;

    const {
      siteId,
      deptId,
      defaultSiteId,
    } = this.state;

    const userTableSetting = Setting.UserSetting.table.User;//表格配置项

    /* 用户组树搜索策略 */
    const isGroupMatch = (item, searchValue) => {
      return (
        (item.name && item.name.includes(searchValue))
        || (item.code && item.code.includes(searchValue))
        || (item.shorthand && item.shorthand.includes(searchValue))
      );
    }

    /* 绘制树节点显示 */
    const renderGroupTitle = (item) => {
      return `${item.name}(${item.code})`;
    }

    // 获取用户组树节点时，根据所选树节点查询用户
    const queryUserByGroup = (selectedKeys) => {
      handleGroupSelect(this.state.siteId, this.state.deptId, selectedKeys, this.refs.SearchInput.value);
    }

    // 根据条件查询用户
    const handleTableButtonSearch = () => {
      let groupId = selectedGruop ? selectedGruop.id : '';
      asyncLoadUser(siteId, deptId, groupId, this.refs.SearchInput.value);
    }

    // 新增+编辑部门数据
    const handleTableButtonAdd = () => {
      addUser();
    }

    const handleTableButtonEdit = () => {
      editUser();
    }

    const handleAddEditFormSubmitSuccess = (values) => {
      let c = {
        siteId: values.siteId,
        deptId: values.deptId,
        name: values.name,
        account: values.account,
        email: values.email,
        tel: values.tel,
        forbid: values.forbid,
        forbidReason: values.forbidReason,
        disable: values.disable,
      };
      let siteId = values.siteId;
      let deptId = values.deptId;
      if(editType === '编辑')
        c.id = preparedUsers[0].id;
      asyncSaveUser(c, editType, siteId, deptId, this.state.siteId, this.state.deptId, ("" + selectedGruop.id));
    }

    // 用户批量关联用户组
    const handleTableButtonLink = () => {
      LinkGroup();
    }

    // 批量解除用户关联用户组
    const handleTableButtonDisconnect = () => {
      Modal.confirm({
        title: "解除关联",
        content: "是否确认将所选用户与当前用户组解除关联？",
        onOk(){ DisconnectGroup(selectedGruop, preparedKeys) },
        onCancel(){ cancelHandle() },
      });
    }

    const handleLinkGroupSubimt = (site, dept, group, users) => {
      asyncLinkUserToGroup(site, dept, group, users);
    }

    // 获取表格勾选项
    const handleTablePrepare = (rows, rowKeys) => {
      preparedUser(rows, rowKeys);
    }

    // 清空或更改select选项时，更改状态
    const handleSiteChange = (value) =>{
      this.setState({
        siteId: value || '',
      });
    }

    const handleDeptChange = (value) =>{
      this.setState({
        deptId: value,
      });
    }

    // 获取组织下拉框选中节点id
    const handleSiteSelect = (value) => {
      this.setState({
        siteId: value,
      });
    }

    // 获取部门下拉框选中节点id
    const handleDeptSelect = (value) => {
      this.setState({
        deptId: value,
      });
    }

    // 用户锁定与解除锁定
    const handleTableButtonForbid = () => {
      forbidUser();
    }

    const handleTableButtonAllow = () => {
      allowUser();
    }

    const handleAllowForbid = (values) => {
      let forbidUser = {
        id: preparedUsers[0].id,
        forbidReason: values.forbidReason,
      };
      if(editType === '解除锁定')
      forbidUser.forbidReason = '';
      asyncAllowForbid(forbidUser);
    }

    // 用户禁用与激活
    const handleTableButtonDisable = () => {
      disableUser();
    }

    const handleTableButtonActive = () => {
      activeUser();
    }

    const handleDisable = () => {
      asyncDisable(preparedUsers[0].id);
    }

    // 重置密码
    const handleTableButtonModifyPWS = () => {
      let uid = preparedUsers[0].id;
      asyncModifyPws(uid);
    }

    //通用取消方法
    const handleFormCancel = () => {
      cancelHandle();
    }

    // 发送请求失败
    const handleSubmitFail = (err, values) => {
      console.log(err);
    }

    // input样式
    let inputClass = {
      outline:'none',
      userSelect:'none',
      boxSizing:'borderBox',
      backgroundColor:'#fff',
      borderRadius:4,
      border:'1px solid #d9d9d9',
      transition:'all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1)',
      position:'relative',
      height:'28',
      padding:'0 5px',
      fontSize:'12px',
      width:'100px',
    }

    // 搜索区样式
    let searchDivClass = {
      display: 'inline-block',
      border: '1px solid #ccc',
      padding: '10px 10px',
      borderRadius: 6,
    }

    // 按钮区样式
    let buttonDivClass = {
      display: 'inline-block',
      border: '1px solid #ccc',
      padding: '10px 10px 10px 10px',
      borderRadius: 6,
      marginLeft: 10,
      float:'right',
    }

    const prepareItems = getPreparedItems(userData, preparedKeys);
    const isOnlyRadio = prepareItems.length === 1;
    const isMultipleChoice = prepareItems.length >= 1;
    const isDisable = isOnlyRadio && prepareItems[0].disable === true;
    const isActive = isOnlyRadio && prepareItems[0].disable === false;
    const isForbid = isOnlyRadio && prepareItems[0].forbid === true;

    return(
      <div>
      <Spin spinning={isLoading} delay={300} >
        <Row gutter={16} style={{marginLeft: 0, marginRight: 0}}>
          <Col span={4}>
              <SearchableTree
                categoryData = {groupData}
                selectedKeys = {["" + selectedGruop.id]}
                onSelect={queryUserByGroup}
                isMatch={isGroupMatch}
                renderTitle={renderGroupTitle}
              />
            </Col>
            <Col span={20}>
              <div className="panel panel-info" style={{margin:0}}>
                <div className="panel-body">
                  <div style={{ marginBottom: 16 }}>
                    <Row gutter={16}>
                      <Col span={9}>
                        <div style={searchDivClass}>
                          <label>组织:</label>
                          <SearchableSelector
                            options={{allowClear:true, style:{width:80,margin:'0 10px'} }}
                            onSelect={handleSiteSelect}
                            onChange={handleSiteChange}
                            disabled={false}
                            lazyMode={false}
                            defaultValue={this.state.defaultSiteId + ''}
                            url='/org/site/select' />
                          <label>部门:</label>
                          <SearchableSelector
                            options={{allowClear:true, style:{width:80,margin:'0 10px'} }}
                            onSelect={handleDeptSelect}
                            onChange={handleDeptChange}
                            disabled={false}
                            lazyMode={false}
                            url={'/org/dept/select?siteId=' + siteId} />
                          <input type='txt' ref='SearchInput' style={inputClass} placeholder={'请输入匹配条件'}/>
                          <Button icon="search" onClick={handleTableButtonSearch} />
                        </div>
                      </Col>
                      <Col span={15}>
                        <div style={buttonDivClass}>
                          <SecurityButtonBox>
                            <Button.Group>
                              <Button key={'auth.user.management.linkGroup'} disabled={!selectedGruop.id} onClick={handleTableButtonLink} > 关联用户 </Button>
                              <Button key={'auth.user.management.disconnectGroup'} disabled={!(selectedGruop.id && isMultipleChoice)} onClick={handleTableButtonDisconnect} > 解除关联 </Button>
                            </Button.Group>
                            <Button.Group>
                              <Button key={'auth.user.management.add'} icon="file-add" onClick={handleTableButtonAdd} > 新增 </Button>
                              <Button key={'auth.user.management.edit'} disabled={!isOnlyRadio} icon="edit" onClick={handleTableButtonEdit} > 编辑 </Button>
                            </Button.Group>
                            <Button.Group>
                              <Button key={'auth.user.management.forbid'} disabled = {!(isOnlyRadio && isActive && !isForbid )} icon="lock" onClick={handleTableButtonForbid} > 锁定 </Button>
                              <Button key={'auth.user.management.allow'} disabled={!(isOnlyRadio && isActive && isForbid)} icon="unlock" onClick={handleTableButtonAllow} > 解锁 </Button>
                            </Button.Group>
                            <Button.Group>
                              <Button key={'auth.user.management.disable'} disabled={!(isOnlyRadio && isActive)} icon="close-circle-o" onClick={handleTableButtonDisable} > 禁用 </Button>
                              <Button key={'auth.user.management.active'} disabled={!(isOnlyRadio && isDisable)} icon="check-circle-o" onClick={handleTableButtonActive} > 激活 </Button>
                            </Button.Group>
                            <Button key={'auth.user.management.modifyPWS'} disabled={!(isOnlyRadio)} onClick={handleTableButtonModifyPWS} > 重置密码 </Button>
                          </SecurityButtonBox>
                        </div>
                      </Col>
                    </Row>
                  </div>
                  <BaseTable
                    onPrepare={handleTablePrepare}
                    isExpanded={false}
                    setting={userTableSetting}
                    data={userData}
                  />
                </div>
              </div>
            </Col>
        </Row>
        <UserAddEditDialog
          editType = {this.props.editType}
          visible = {editType === '新增' || editType === '编辑'}
          onFormSubmit = {handleAddEditFormSubmitSuccess}
          onFormCancel = {handleFormCancel}
          editItem = {prepareItems[0]}
          />
        <UserForbidDialog
          editType = {this.props.editType}
          visible = {editType === '锁定' || editType === '解除锁定'}
          onFormSubmit = {handleAllowForbid}
          onFormCancel = {handleFormCancel}
          editUser = {prepareItems[0]}
          />
        <UserLinkGroupDialog
          editType = {this.props.editType}
          visible = {editType === '关联用户组'}
          inputClass={inputClass}
          searchDivClass={searchDivClass}
          onSubmit = {handleLinkGroupSubimt}
          onCancel = {handleFormCancel}
          associationGroupItem = {selectedGruop}
          />
        <ConfirmModal
          visible = {editType === 'disable'}
          title ={modalTitle}
          information = {modalInformation}
          onConfirm = {handleDisable}
          onCancel = {handleFormCancel}
          />
      </Spin>
    </div>
    );
  }
}
