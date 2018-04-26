import React, { Component } from 'react';
import pathToRegexp from 'path-to-regexp';
import logo from './logo.svg';
import { Menu, Icon, Avatar, Row, Col, Layout } from 'antd';
import { BrowserRouter as Router, Link, Route, Redirect } from 'react-router-dom';
import PonyComp from "./container";
import HomePage from './component/HomePage';
import fetchData from './util/fetchGateway';
import {isDevelopMode} from './util/sysinfo';
import {getPermissionPath} from './util/treeUtils';
import UserMenu from './container/public/UserMenu';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
// const { SubMenu, ItemGroup: MenuGroup, Item: MenuItem } = Menu;
const SubMenu = Menu.SubMenu;
const MenuGroup = Menu.ItemGroup;
const MenuItem = Menu.Item;

export default class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      menuData: [],
      menuPath: [],
      currentMenuKey: '',
      userName: '',
    };
  }

  // 获取菜单
  loadMenuData(){
    fetchData('/sys/menu/').then(
      (receipt) => {
        if(receipt.code !== '0'){
          console.log(`Server error occurred (code=${receipt.code}) => ${receipt.message}`)
        }
        this.setState({
          menuData: receipt.data,
          menuPath: getPermissionPath(receipt.data),
        });
      },
      (error) => {console.log(error)}
    );
  }

  // 获取用户信息
  getSeverInfo = () => {
    fetchData('/sys/mode').then(
      (receipt) => {
        this.setState({
          userName: receipt.data[0] ? receipt.data[0].userName : '',
        });
      },
      (error) => {console.log(error)}
    );
  }

  componentWillMount(){
    this.loadMenuData();
    this.getSeverInfo();
  }

  handleClick = (e) => {
    this.setState({
      currentMenuKey: e.key,
    });
  }

  render() {
    const pickCategoryManagement = ({match}) => {
      return (<PonyComp.CategoryManagement nodeId={match.params.nodeId} categoryType={match.params.id} categoryName={match.params.name} maxLevel={match.params.maxLevel} />)};

    const renderMenu = (menu) => {
      let type = menu.code.slice(0, 1);
      switch(type){
        case 'M':
          return (
            <SubMenu key={'M' + menu.id} title={menu.name} >
              {(menu.subordinate && menu.subordinate.length > 0) ? menu.subordinate.map((item) => renderMenu(item)) : '' }
              {(menu.subMenu && menu.subMenu.length > 0) ? menu.subMenu.map((item) => renderMenu(item)) : '' }
            </SubMenu>
          );
        case 'G':
          return (
            <MenuGroup key={'G' + menu.id} title={menu.name} >
              {(menu.subordinate && menu.subordinate.length > 0) ? menu.subordinate.map((item) => renderMenu(item)) : '' }
              {(menu.subMenu && menu.subMenu.length > 0) ? menu.subMenu.map((item) => renderMenu(item)) : '' }
            </MenuGroup>
          );
        default:
          // let flag = menu.link.slice(0, 1);
          return(
            <MenuItem key={menu.id + ''}>
              <Link to={menu.link} >{menu.name}</Link>
            </MenuItem>
          );
      }
    };

    const examinePermissions = (path) => {
      return this.state.menuPath.includes(path);
    }

    const PrivateRoute = ({ component: Component, ...rest }) => (
      <Route {...rest} render={props => (
        setTimeout(() => {
          examinePermissions(props.location.pathname)
        },1000) ? (
          <Component {...props}/>
        ) : (
          <Redirect to={{
            pathname: '/login',
            state: { from: props.location }
          }}/>
        )
      )}/>
    );

    return (
      <Router style={{height: '100%'}}>
        <div style={{height: '100%'}} className="App">
          <nav className="navbar navbar-default">
            <div className="navbar-header">
              <img className="App-logo" src={logo} />
            </div>
            <div className="navbar-collapse collapse" style={{padding:0}}>
              <div className="nav navbar-nav navbar-right banner-profile" style={{marginRight:10}} id={'dv'} >
              <UserMenu user={this.state.userName} elementId={'dv'} />
              </div>
              <Menu onClick={this.handleClick} selectedKeys={[this.state.current]} mode="horizontal" className="banner-menu" >
                {this.state.menuData.map((item) => renderMenu(item))}
                <MenuItem key={'企业标准查询'}>
                  <a style={{'fontSize': 15,'fontFamily': '微软雅黑'}} href='http://192.168.25.12:10002' target='_blank' >企业标准查询</a>
                </MenuItem>
              </Menu>
            </div>
          </nav>
          <div className='router'>
            {isDevelopMode() ? '' : <Redirect from="/" exact to="/route/homepage" />}
            <Route key="homepage" path="/route/homepage" component={HomePage} />
            <PrivateRoute key="doc.category.management" path="/route/category/:nodeId/:id/:name/:maxLevel" component={pickCategoryManagement} />
            {/*度量单位*/}
            <PrivateRoute key="doc.measureUnit.management" path="/route/doc.measureUnit.management" component={PonyComp.MeasureUnitTable} />
            {/*检测项目*/}
            <PrivateRoute key="doc.testItem.management" path="/route/doc.testItem.management" component={PonyComp.TestItems} />
            {/*检测标准*/}
            <PrivateRoute key="doc.testStandard.management" path="/route/doc.testStandard.management" component={PonyComp.TestStandard} />
            {/*检测方法*/}
            <PrivateRoute key="doc.testMethod.management" path="/route/doc.testMethod.management" component={PonyComp.TestMethod} />
            {/*产品*/}
            <PrivateRoute key="doc.product.management" path="/route/doc.product.management" component={PonyComp.Product} />
            {/*资质管理*/}
            <PrivateRoute key="doc.qualification.management" path="/route/doc.qualification.management" component={PonyComp.QualificationManagement} />
            {/*部门检测范围*/}
            <PrivateRoute key="doc.deptScope.management" path="/route/doc.deptScope.management" component={PonyComp.DeptTaskScope} />
            {/*抽样单管理*/}
            <PrivateRoute key="smp.sampling.management" path="/route/smp.sampling.management" component={PonyComp.SampleManagement} />
            {/*订单录入*/}
            <PrivateRoute key="odr.make" path="/route/odr.make" component={PonyComp.OrderEntry} />
            {/*订单查询*/}
            <PrivateRoute key="odr.query" path="/route/odr.query" component={PonyComp.OrderDispatch} />
            {/*任务调度*/}
            <PrivateRoute key="lab.task.dispatch" path="/route/lab.task.dispatch" component={PonyComp.TaskDispatch} />
            {/*数据录入*/}
            <PrivateRoute key="lab.testResult.make" path="/route/lab.testResult.make" component={PonyComp.ReportEntry} />
            {/*数据审核*/}
            <PrivateRoute key="lab.testResult.approve" path="/route/lab.testResult.approve" component={PonyComp.DataVerify} />
            {/*报告模板*/}
            <PrivateRoute key="rpt.doc.template.management" path="/route/rpt.doc.template.management" component={PonyComp.ReportTemplateManagement} />
            {/*印章管理*/}
            {/*<PrivateRoute key="rpt.signet.management" path="/route/rpt.signet.management" component={PonyComp.ReportTemplateManagement} />*/}
            {/*报告查询*/}
            {<PrivateRoute key="rpt.query" path="/route/rpt.query" component={PonyComp.rpt_query_ReportQuery} />}
            {/*报告编制*/}
            <PrivateRoute key="rpt.make" path="/route/rpt.make" component={PonyComp.MarkReportManagement} />
            {/*报告审核*/}
            <PrivateRoute key="rpt.approve" path="/route/rpt.approve" component={PonyComp.ReportVerify} />
            {/*报告交付*/}
            <PrivateRoute key="rpt.deliver" path="/route/rpt.deliver" component={PonyComp.ReportSentManagement} />
            {/*报告归档*/}
            <PrivateRoute key="rpt.archive" path="/route/rpt.archive" component={PonyComp.ReportArchivedManagement} />
            {/*组织管理*/}
            <PrivateRoute key="org.site.management" path="/route/org.site.management" component={PonyComp.OrganizationManagement} />
            {/*部门管理*/}
            <PrivateRoute key="org.dept.management" path="/route/org.dept.management" component={PonyComp.DeptManagement} />
            {/*用户管理*/}
            <PrivateRoute key="auth.user.management" path="/route/auth.user.management" component={PonyComp.UserManagement} />
            {/*权限分配*/}
            <PrivateRoute key="auth.privilege.management" path="/route/auth.privilege.management" component={PonyComp.PrivilegeGrant} />
            {/*For Develop*/}
            <PrivateRoute key="pub.testui" path="/route/pub.testui" component={PonyComp.TestUI} />
            {/* <Route key="org.job.management" path="/route/org.job.management" component={PonyComp.JobManagement} /> */}
            {/* 位置管理 */}
            <PrivateRoute key="doc.location.management" path="/route/doc.location.management" component={PonyComp.LocationManagement} />
            {/* 入库管理 */}
            <PrivateRoute key="mat.material.management" path="/route/mat.material.management" component={PonyComp.MaterialManagement} />
            {/* 库存管理 */}
            <PrivateRoute key="mat.store.management" path="/route/mat.store.management" component={PonyComp.StoreManagement} />
            {/* 价格维护 */}
            <PrivateRoute key="biz.offer.price" path="/route/biz.offer.price" component={PonyComp.OfferPrice} />
            {/* 报价单 */}
            <PrivateRoute key="biz.offer.management" path="/route/biz.offer.management" component={PonyComp.OfferManagement} />
          </div>
        </div>
      </Router>
    );
  }
};
