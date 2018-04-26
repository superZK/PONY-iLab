import React, {Component} from 'react';
import {Tree} from 'antd';
import 'bootstrap/dist/css/bootstrap.min.css';

const TreeNode = Tree.TreeNode;

export default class MarkReportTree extends Component {
  render() {
    const {
      searchData,
      markReportList,
      selectedKeysData,
      markReportBtnList,
    } = this.props;

    const selectList = (selectedKeys, info) => {
      console.log(selectedKeys, info);
      markReportList(selectedKeys)
      markReportBtnList(selectedKeys)
    }


    const loop = (data) => data.map(item => {
      const children = (item.sampleType || item.sampleType.length > 0 || []).map(v => {
        return (
          <TreeNode title={v.testName + ':' + v.serialNo} key={"" + v.id} />
        )
      })
      if (item && item.sampleType && item.sampleType.length > 0) {
        return (
          <TreeNode title={item.name + ':' + item.orderNo} key={"" + item.id}>
            {children}
          </TreeNode>
        )
      } else {
        return <TreeNode title={item.name + ':' + item.orderNo} key={"" + item.id} />
      }
    }).filter(item => !!item)

    return (
      <div className='panel panel-info'>
        <div className='panel-body' >
          <Tree
            showLine
            defaultExpandedKeys={['0-0']}
            onSelect={selectList}
            selectedKeys={selectedKeysData}     // 设置选中树节点
            >
            <TreeNode title="订单列表" key='0-0' >
              {loop(searchData || [])}
            </TreeNode>
          </Tree>
        </div>
      </div>
    )
  }
}
