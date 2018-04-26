import React, {Component} from 'react';
import {Tree} from 'antd';
import 'bootstrap/dist/css/bootstrap.min.css';

const TreeNode = Tree.TreeNode;

export default class OfferTree extends Component {

  getContentStyle = () => {
    let style = {};
    if(this.props.maxHeight){
      style.maxHeight = this.props.maxHeight + 'vh';
      style.overflowY = 'scroll';
    }
    if(this.props.minHeight){
      style.minHeight = this.props.minHeight + 'vh';
    }
    return style;
  }

  render() {
    const {
      searchData,
      offerPUpAddItem,//addItem 根据列表树 上级 查询列表
      offerPDownAddItem,//addItem 根据列表树 子级 查询列表
    } = this.props;

    const selectList = (selectedKeys, info) => {
      if(info.node && info.node.props && info.node.props.children) {
        offerPUpAddItem(selectedKeys[0].slice(1));
      } else {
        offerPDownAddItem(selectedKeys);
      }
    }


    const loop = (data) => data.map(item => {
      const children = (item.productTest || item.productTest.length > 0 || []).map(v => {
        return (
          <TreeNode title={v.testPlan && v.testPlan.name} key={"" + (v.id)} />
        )
      })
      if (item && item.productTest && item.productTest.length > 0) {
        return (
          <TreeNode title={item.name} key={'P' + "" + item.id}>
            {children}
          </TreeNode>
        )
      } else {
        return <TreeNode title={item.name} key={'P' + "" + item.id} />
      }
    }).filter(item => !!item)
    const treeStyle = this.getContentStyle();
    return (
      <div className='panel panel-info'>
        <div className='panel-body' style={treeStyle} >
          <Tree
            showLine
            defaultExpandedKeys={['0-0']}
            onSelect={selectList}
            selectedKeys={["" + searchData && searchData[0] && searchData[0].id]}// 设置选中树节点
            >
            <TreeNode title="产品列表" key='0-0' >
              {loop(searchData || [])}
            </TreeNode>
          </Tree>
        </div>
      </div>
    )
  }
}
