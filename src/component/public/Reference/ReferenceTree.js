import React, { Component } from 'react';
import { Tree, Input, Button, Icon, Row, Col } from 'antd';
import classNames from 'classnames/bind';
import {searchTreeForKeys} from '../../../util/treeUtils';
import './index.css';
const TreeNode = Tree.TreeNode;

export default class ReferenceTree extends Component {
  constructor(props){
    super(props);

    this.state = {
        searchValue: '',
        autoExpandParent: true,
        expandedKeys: this.props.expandedKey || [],
    };
  }

  onExpand = (expandedKeys) => {
      this.setState({
          expandedKeys,
          autoExpandParent: false,
      });
  }

  componentWillReceiveProps(nextProps){
      if(this.props.categoryData != nextProps.categoryData && nextProps.categoryData[0]){
          this.setState({
              expandedKeys: ''+ nextProps.categoryData[0].id
          });
      }
  }

  onSearch = (value) => {
      const { categoryData, isMatch } = this.props;
      this.setState({
          searchValue: value,
      });
      let pks = [];
      if(value){
        // 按条件搜索，匹配并展开上级
        let Keys = searchTreeForKeys(categoryData, 'id', 'subordinate', value, isMatch);
        console.log(Keys)
        pks = Keys.parentKeys.map((item) => ("" + item));
      }else if(categoryData.length){
        // 没有搜索条件，有可能是重置。展开第一级
        pks = [categoryData[0].id + ''];
      }
      this.setState({
          autoExpandParent: true,
          expandedKeys : pks,
      });
  }

  onSelect = (rowkeys, rows) => {
      if(this.props.onSelect){
          this.props.onSelect(rowkeys);
      }
  }

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
    const { categoryData, selectedKeys, onSelect, isMatch, renderTitle } = this.props;
    const { expandedKeys, searchValue, autoExpandParent } = this.state;
    const loop = (data) => data.map((item) => {
      let isMatch = searchValue && this.props.isMatch(item, searchValue);
      let isShow = (!searchValue) || isMatch;
      let title = (isMatch) ? (<span style={{color:'red'}} >{renderTitle(item)}</span>) : (<span>{renderTitle(item)}</span>);
      if(item.subordinate && item.subordinate.length > 0){
        let children = loop(item.subordinate);
        let hasShowChildren = false;
        for(let node of children){
          if(node){
            hasShowChildren = true;
            break;
          }
        }
        if(!isShow && !hasShowChildren) return null;
        return (
            <TreeNode key={"" + item.id} title={title}>
                {children}
            </TreeNode>
        );
      }else{
        return isShow ? (<TreeNode key={"" + item.id} title={title} />) : null;
      }
    }).filter(item => !!item);
    const treeStyle = this.getContentStyle();
    return (
      <div>
        <Tree
          showLine
          onExpand={this.onExpand}
          expandedKeys={expandedKeys}
          autoExpandParent={autoExpandParent}
          selectedKeys = {selectedKeys}
          onSelect={this.onSelect}
        >
          {loop(categoryData)}
        </Tree>
      </div>
    );
  }
}