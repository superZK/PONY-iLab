import React, { Component } from 'react';
import { Modal, Button } from 'antd';
import BaseTable from '../../public/BaseTable';
import SearchableSelector from '../../public/SearchableSelector';
import Setting from '../../../config/index';
import fetchData from '../../../util/fetchGateway';
import { spliceUrlByParams } from '../../../util/treeUtils';


export default class UserLinkGroupDialog extends Component {
  state = {
    site:'',
    dept:'',
    userData:[],
    preparedKeys:[],
  }

  // 根据条件查询用户
  queryUser = () => {
    const { associationGroupItem } = this.props;
    const { site, dept } = this.state;
    let groupId = associationGroupItem ? associationGroupItem.id : '';
    let searchValue = this.refs.SearchInput ? this.refs.SearchInput.value : '';
    let url = spliceUrlByParams('/auth/user/queryGroupUnselected',[site, dept, groupId, searchValue],'siteId', 'deptId', 'groupId', 'searchValue');
    fetchData(url, {}).then(
      (receipt) => {
        this.setState({
          userData: receipt.data,
        });
      },
      (error) => { console.log(error) }
    );
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.visible)
    this.queryUser();
  }

  render() {
    const {
      onSubmit,
      onCancel,
      editType,
      searchDivClass,
      inputClass,
      associationGroupItem,
    } = this.props;

    const {site, dept, userData, preparedKeys,} = this.state;

    const userTableSetting = Setting.UserSetting.table.User;//表格配置项

    // 批量关联用户与用户组
    const handleSubmitSuccess = () => {
      let selectGroupId = associationGroupItem ? associationGroupItem.id : '';
      onSubmit(this.state.site, this.state.dept, selectGroupId, this.state.preparedKeys);
    };

    // modal取消
    const handleCancel = (e) => {
      e.preventDefault();
      onCancel();
    }

    // 获取select 选中节点的value
    const handleSiteSelect = (value) => {
      this.setState({
        site: value,
      });
    }

    const handleDeptSelect = (value) => {
      this.setState({
        dept: value,
      });
    }

    // 更改select value
    const handleSiteChange = (value) => {
      this.setState({
        site: value || '',
      });
    }

    const handleDeptChange = (value) => {
      this.setState({
        dept: value || '',
      });
    }

    // 获取表格勾选项
    const handleTablePrepare =(selectedRows, selectedRowKeys) => {
      this.setState({
        preparedKeys: selectedRowKeys,
      })
    }

    return (
      <Modal
        width={'750px'}
        title={`${this.props.editType}`}
        visible={this.props.visible}
        onOk={handleSubmitSuccess}
        onCancel={handleCancel} >
        <div style={searchDivClass}>
          <label>组织:</label>
          <SearchableSelector
            options={{allowClear:true, style:{width:80,margin:'0 10px'} }}
            onSelect={handleSiteSelect}
            onChange={handleSiteChange}
            disabled={false}
            lazyMode={false}
            url='/org/site/select' />
            <label>部门:</label>
          <SearchableSelector
            options={{allowClear:true, style:{width:80,margin:'0 10px'} }}
            onSelect={handleDeptSelect}
            onChange={handleDeptChange}
            disabled={false}
            lazyMode={false}
            url={'/org/dept/select?siteId=' + site} />
          <input type='txt' ref='SearchInput' style={inputClass} placeholder={'请输入匹配条件'}/>
          <Button icon="search" onClick={this.queryUser} />
        </div>
        <BaseTable
          onPrepare={handleTablePrepare}
          isExpanded={false}
          setting={userTableSetting}
          data={this.state.userData}
        />
      </Modal>
    );
  }
}
