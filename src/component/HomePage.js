import React, {Component} from 'react';
import { Card, Col, Row } from 'antd';

export default class HomePage extends Component{
  render(){
    return (
    <div>
      <img src='/home_bg.jpg' style={{ marginTop: `-20px`, height:document.body.clientHeight}} />
    </div>
    );
  }
}
