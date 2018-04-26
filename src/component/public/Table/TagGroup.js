import React, { Component } from 'react';
import { Tag, } from 'antd';
import { findNodeById, analysisDataIndex } from '../../../util/treeUtils';

export default class TagGroup extends Component {
  state = {
    tags: [{key:'1', name:'无任何勾选项'}],
  };

  componentWillReceiveProps(nextProps) {
    this.setState({
      tags: nextProps.data,
    });
  }

  render() {
    const { tags } = this.state;

    const { filterPreparedKeys, clearAll } = this.props;

    const handleClose = (removedTag) => {
      // 因为删除tag标签时是根据id：removedTag来进行过滤，但是在表格组件中勾选状态是根据key：preparedKey来进行过滤，所以应该在func: filterPreparedKeys中传递id对应的key值
      let filterTag = findNodeById(this.state.tags, 'id', '', removedTag);
      let tags = this.state.tags.filter(tag => tag.id !== removedTag);
      this.setState({ tags });
      if(this.props.filterPreparedKeys)
      filterPreparedKeys(filterTag.key);
    }

    const renderRule = (item, keys=['name']) => {
      let renderKeys = [];
      keys.map( (key) => {
        // renderKeys.push(item[key]);
        renderKeys.push(analysisDataIndex(item, key));
      });
      let filterRenderKeys = renderKeys.filter(item => item !== undefined)
      return filterRenderKeys.join('__');
    }

    return (
      <div>
        {tags.map((tag) => {
          const tagElem = (
            <Tag style={{margin: '1px 2px'}} color='#2db7f5' key={tag.key} closable={true} afterClose={() => handleClose(tag.id)}>
              {renderRule(tag, tag.name === '无任何勾选项' ? ['name'] : this.props.renderKey)}
            </Tag>
          );
          return (clearAll ? <Tag style={{margin: '1px 2px'}} color='#2db7f5' key={'1'} closable={true}>
          {renderRule({key:'1', name:'无任何勾选项'}, ['name'])}
        </Tag> : tagElem);
        })}
      </div>
    );
  }
}