import React, { Component } from 'react';
import { Button, Dropdown, Icon, Menu } from 'antd';
import fetchData from '../../util/fetchGateway';

export default class SecurityButtonBox extends Component {

  constructor(props){
    super(props);
    this.state = {
      authButtonKeys: [],
    };
  }

  loadAuthrozation(){
    let url = '/auth/entry/filter?type=502';
    let scope = this.getAllButtonKeys();
    fetchData(url, {
      body: JSON.stringify(scope)
    }).then(
      (receipt) => {
        let keys = receipt.data.map((item) => item);
        this.setState({authButtonKeys: keys});
      },
      (error) => {console.log(error)}
    );
  }

  componentDidMount(){
    this.loadAuthrozation();
  }

  isButton(obj){
    return obj.props.prefixCls && 'ant-btn' === obj.props.prefixCls;
  }

  getAllButtonKeys = () => {
    let allButtonKeys = [];
    let children = [];
    if(this.props.children.length) children=this.props.children
      else children.push(this.props.children)
    if( children ){
      children.map((button) => {
        if(this.isButton(button)){
          if(button.key && '' !== button.key) allButtonKeys.push(button.key);
        }else{
          // ButtonGroup, 只支持一级
          if(button.props.children && button.props.children.length > 0){
            button.props.children.map((subButton) => {
              if(this.isButton(subButton)){
                if(subButton.key && '' !== subButton.key) allButtonKeys.push(subButton.key);
              }
            });
          }
        }
      });
    }
    return allButtonKeys;
  }

  render(){
    const isButtonShow = (button) => (this.state.authButtonKeys.includes(button.key));

    const isButtonGroupShow = (group) => {
      if(group.props.children && group.props.children.length > 0){
        for(let btn of group.props.children){
          if(isButtonShow(btn)){
            return true;
          }
        }
      }
      return false;
    };

    const renderButton = (button) => {
      if(isButtonShow(button)) return button;
    };

    const renderButtonGroup = (group) => {
      if(isButtonGroupShow(group)){
        return (
          <Button.Group>
            {group.props.children.map((btn) => (renderButton(btn)))}
          </Button.Group>
        );
      }
    };

    return(
      <div style={this.props.style}>
        {this.props.children.length ? this.props.children.map((child)=>{
            if(this.isButton(child)) {
              return renderButton(child);
            }else{
              return renderButtonGroup(child);
            }
          }) : (this.isButton(this.props.children) ? renderButton(this.props.children) : renderButtonGroup(this.props.children))
        }
      </div>
    );
  }
}
