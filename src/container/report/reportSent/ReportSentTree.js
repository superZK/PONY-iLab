import React, {Component} from 'react';
import {searchTreeForKeys} from '../../../util/treeUtils';
import {Tree, Input} from 'antd';
import 'bootstrap/dist/css/bootstrap.min.css';

const TreeNode = Tree.TreeNode;
const Search = Input.Search;

export default class ReportSentTree extends Component {
    constructor(props){
        super(props);

        this.state = {
            searchValue: '',
            autoExpandParent: true,
            expandedKeys: [],
        };
      }

    onExpand = (expandedKeys) => {
        this.setState({
            expandedKeys,
            autoExpandParent: false,
        });
    }

    componentWillReceiveProps(nextProps){
      if(nextProps.categoryData) {
        if(this.props.categoryData !== nextProps.categoryData && nextProps.categoryData[0]){
            this.setState({
                expandedKeys: ''+ nextProps.categoryData[0].id
            });
        }
      }
    }

    loopTree = (tree, callBack, parent) => {
      if(tree && tree.length > 0){
        for(let node of tree){
          console.log(node);
          console.log(parent);
          callBack(node, parent);
          if(node.sampleType && node.sampleType.length > 0) {
            this.loopTree(node.sampleType, callBack, node);
          }
        }
      }
    }

    searchTreeForKeys = (tree, idField, subField, value, isMatch) => {
      let parentKeys = [];
      let matchedKeys = [];
      let match = (node, parent) => {
        if(isMatch(node, value)){
          let pk = parent[idField];
          let nk = node[idField];
          console.log(pk, nk);
          if(!matchedKeys.includes(nk)) matchedKeys.push(nk);
          if(!parentKeys.includes(pk)) parentKeys.push(pk);
        }
      }
      console.log(matchedKeys, parentKeys);
      this.loopTree(tree, match, {});
      return {matchedKeys, parentKeys};
    }

    onSearch = (value) => {
        const { categoryData, isMatch } = this.props;
        this.setState({
            searchValue: value,
        });
        let pks = [];
        if(value){
          // 按条件搜索，匹配并展开上级
          let Keys = this.searchTreeForKeys(categoryData, 'id', 'sampleType', value, isMatch);
          console.log(categoryData);
          console.log(Keys)
          pks = Keys.parentKeys.map((item) => ("" + item));
          console.log(pks);
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
        const { categoryData, selectedKeys } = this.props;
        const { expandedKeys, searchValue, autoExpandParent } = this.state;
        const loop = (data) => data.map((item) => {
          let isMatch = searchValue && this.props.isMatch(item, searchValue);
          let isShow = (!searchValue) || isMatch;
          console.log(isMatch);
          let title = (isMatch) ? (<span style={{color:'red'}} >{item.name + ':' + item.orderNo}</span>) : (<span>{item.name + ':' + item.orderNo}</span>);
          const children = (item.sampleType || item.sampleType.length > 0 || []).map(v => {
            let title2 = (isMatch) ? (<span style={{color:'red'}} >{v.testName + ':' + v.serialNo}</span>) : (<span>{v.testName + ':' + v.serialNo}</span>);
            return (
              <TreeNode title={title2} key={"" + v.id} />
            )
          })

          if(item.sampleType && item.sampleType.length > 0){
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
            <div className='panel panel-info'>
              <div className='panel-heading'>
                <Search placeholder="Search" onSearch={this.onSearch} />
              </div>
              <div className='panel-body' style={treeStyle}>
                <Tree
                    showLine
                    onExpand={this.onExpand}
                    expandedKeys={expandedKeys}
                    autoExpandParent={autoExpandParent}
                    selectedKeys = {selectedKeys}
                    onSelect={this.onSelect}
                >
                  <TreeNode title="订单列表" key='0-0' >
                    {loop(categoryData || [])}
                  </TreeNode>
                </Tree>
              </div>
            </div>
        );
    }
}
