import React, {Component} from 'react';
import { Row, Col, Spin, Button, Select } from 'antd';
import PrivilegeGrantDialog from './PrivilegeGrantDialog';
import SearchableTree from '../../public/SearchableTree';
import BaseTable from '../../public/BaseTable';
import SecurityButtonBox from '../../public/SecurityButtonBox';
import Setting from '../../../config/index';

import 'antd/dist/antd.css';

export default class PrivilegeGrant extends Component{

  constructor(props){
    super(props);
    this.state = {
      preparedPrivilegeKeys: [],
      selectedGroupKey: '',
      selectedPrivilegeType: '501',
    };
  }

  componentDidMount(){
    const {asyncLoadGroupData} = this.props;
    asyncLoadGroupData("1016", "用户组");
  }

  render(){
    const { isLoading, groupData, privilegeData } = this.props;
    const {
      asyncSelectGroup, // 选取用户组，加载权限数据
      asyncLoadAuthData, // 加载待授权权限
      asyncRevokeAuthData, // 回收权限
      asyncComfirmAuthDataSave, // 确认授权操作
      cancelAuthDataSave, // 取消授权操作
    } = this.props;

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

    /* 用户组树节点选取 */
    const handleGroupSelect = (selectedKeys) => {
      let groupId = (selectedKeys && selectedKeys.length > 0) ? selectedKeys[0] : '' ;
      this.setState({selectedGroupKey: groupId});
      asyncSelectGroup(groupId, this.state.selectedPrivilegeType);
    }

    /* 权限表数据勾选 */
    const handlePrivilegePrepare = (records) => {
      let keys = records.map(item => item.key);
      this.setState({preparedPrivilegeKeys: keys});
    }

    /* 授权对话框确认 */
    const handleAuthConfirm = (preparedPrivilegeKeys) => {
      asyncComfirmAuthDataSave(this.state.selectedGroupKey, this.state.selectedPrivilegeType, preparedPrivilegeKeys);
    }

    /* 授权对话框取消 */
    const handleAuthCancel = () => {
      cancelAuthDataSave();
    }

    /* 授予权限按钮点击 */
    const handleGrantAuthorization = () => {
      asyncLoadAuthData(this.state.selectedGroupKey, this.state.selectedPrivilegeType);
    }

    /* 回收权限按钮点击 */
    const handleRevokeAuthorization = () => {
      asyncRevokeAuthData(this.state.selectedGroupKey, this.state.selectedPrivilegeType, this.state.preparedPrivilegeKeys);
    }

    /* 权限类型切换 */
    const handlePrivilegeTypeChange = (value) => {
      this.setState({selectedPrivilegeType: value});
      asyncSelectGroup(this.state.selectedGroupKey, value);
    }

    /* 权限表结构 */
    const { PrivilegeGrantSetting } = Setting;

    return (
      <div>
        <Spin spinning={isLoading} delay={300} >
          <Row gutter={16} style={{marginLeft: 0, marginRight: 0}}>
            <Col span={4}>
              <SearchableTree
                categoryData = {groupData}
                selectedKeys = {[this.state.selectedGroupKey]}
                onSelect={handleGroupSelect}
                isMatch={isGroupMatch}
                renderTitle={renderGroupTitle}
              />
            </Col>
            <Col span={20}>
              <div className="panel panel-info">
                <div className="panel-body">
                  <div style={{ marginBottom: 16 }}>
                    <label>权限类型:</label>
                    <Select style={{marginLeft: 5, width: 120}} defaultValue='501' onChange={handlePrivilegeTypeChange}>
                      <Select.Option value="501">菜单</Select.Option>
                      <Select.Option value="502">按钮</Select.Option>
                    </Select>
                    {/*<SecurityButtonBox>
                      <Button key='auth.privilege.management.grant.authorize' style={{marginLeft: 20}} disabled={!this.state.selectedGroupKey || !this.state.selectedPrivilegeType} icon="file-add" onClick={handleGrantAuthorization}> 权限授予 </Button>
                      <Button key='auth.privilege.management.grant.revoke' style={{marginLeft: 10}} disabled={!this.state.preparedPrivilegeKeys || this.state.preparedPrivilegeKeys.length === 0} icon="file-add" onClick={handleRevokeAuthorization}> 权限回收 </Button>
                    </SecurityButtonBox>*/}
                    <Button key='auth.privilege.management.grant.authorize' style={{marginLeft: 20}} disabled={!this.state.selectedGroupKey || !this.state.selectedPrivilegeType} icon="file-add" onClick={handleGrantAuthorization}> 权限授予 </Button>
                    <Button key='auth.privilege.management.grant.revoke' style={{marginLeft: 10}} disabled={!this.state.preparedPrivilegeKeys || this.state.preparedPrivilegeKeys.length === 0} icon="file-add" onClick={handleRevokeAuthorization}> 权限回收 </Button>
                  </div>
                  <BaseTable
                    onPrepare={handlePrivilegePrepare}
                    isExpanded={false}
                    setting={PrivilegeGrantSetting.table.privilegeTable}
                    data={privilegeData}
                  />
                </div>
              </div>
            </Col>
          </Row>
          <PrivilegeGrantDialog
            data = {this.props.authorizationData}
            onConfirm = {handleAuthConfirm}
            onCancel = {handleAuthCancel}
            visible = {this.props.isEditing}
            setting = {PrivilegeGrantSetting.table.privilegeTable}
          />
        </Spin>
      </div>
    );
  }
}
