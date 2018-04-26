import {combineReducers} from 'redux';
import categoryManagement from './document/category/categoryManagement';
import MeasureUnitTable from './document/unit/unit';
import TestItems from './document/testItems/testItems';
import TestStandard from './document/testStandard/testStandard';
import TestMethod from './document/testMethod/testMethod';
import Product from './document/product/product';
import ProgramEditDialog from './document/product/programEditDialog';
import OrganizationManagement from './org/organization/organizationManagement';
import DeptManagement from './org/dept/deptManagement';
import UserManagement from './auth/user/userManagement';
import PrivilegeGrant from './auth/group/privilegeGrant';
import UserMenu from './public/userMenu';

const reducer = combineReducers({
  categoryManagement,
  MeasureUnitTable,
  TestItems,
  TestStandard,
  TestMethod,
  Product,
  ProgramEditDialog,
  OrganizationManagement,
  DeptManagement,
  UserManagement,
  PrivilegeGrant,
  UserMenu,
})

export default reducer;
