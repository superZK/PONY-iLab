import {combineReducers} from 'redux';

import categoryManagement from '../reducer/document/category/categoryManagement';
import MeasureUnitTable from '../reducer/document/unit/unit';
import TestItems from '../reducer/document/testItems/testItems';
import TestStandard from '../reducer/document/testStandard/testStandard';
import TestMethod from '../reducer/document/testMethod/testMethod';
import Product from '../reducer/document/product/product';
import ProgramEditDialog from '../reducer/document/product/programEditDialog';
import OrganizationManagement from '../reducer/org/organization/organizationManagement';
import DeptManagement from '../reducer/org/dept/deptManagement';
import UserManagement from '../reducer/auth/user/userManagement';
import PrivilegeGrant from '../reducer/auth/group/privilegeGrant';
import orderEntryReducer from "./biz/orderEntry/orderEntry";
import reportEntryReducer from "./biz/reportEntry/reportEntry";
import dataVerifyReducer from "./biz/dataVerify/dataVerify";
import reportVerifyReducer from "./biz/reportVerify/reportVerify";
import UserMenu from '../reducer/public/userMenu';
import qualificationManagement from "./doc/qualification/qualificationManagement";
import reportTemplateManagement from "./orders/reportTemplate/reportTemplateManagement";
import markReportManagement from "./report/markReport/markReportManagement";
import reportSentManagement from "./report/reportSent/reportSentManagement";
import reportArchivedManagement from "./report/reportArchived/reportArchivedManagement";
import deptTaskScope from "./doc/relation/deptTaskScope";
import orderDispatchReducer from "./dispatch/orderDispatch/orderDispatch";
import taskDispatchReducer from "./dispatch/taskDispatch/taskDispatch";
import sampleManagement from "./smp/sampling/sampleManagement";
import rpt_query_reportQuery from "./rpt/query/reportQuery";  // 报告查询
import locationManagement from "./doc/location/locationManagement";
import materialManagement from "./mat/material/materialManagement";
import storeManagement from "./mat/store/storeManagement";
import offerPrice from "./biz/offerPrice/offerPrice";
import offerManagement from "./biz/offer/offerManagement";

export {actions as rpt_query_reportQueryActions} from "./rpt/query/reportQuery";  // 报告查询
export { actions as orderEntryActions } from "./biz/orderEntry/orderEntry";
export { actions as reportEntryActions } from "./biz/reportEntry/reportEntry";
export { actions as dataVerifyActions } from "./biz/dataVerify/dataVerify";
export { actions as reportVerifyActions } from "./biz/reportVerify/reportVerify";
export { actions as qualificationManagementAction } from "./doc/qualification/qualificationManagement";
export { actions as orderDispatchActions } from "./dispatch/orderDispatch/orderDispatch";
export { actions as taskDispatchActions } from "./dispatch/taskDispatch/taskDispatch";
export { actions as materialActions } from "./mat/material/materialManagement";
export { actions as storeActions } from "./mat/store/storeManagement";
export { actions as offerPriceAction } from "./biz/offerPrice/offerPrice";
export { actions as offerManagementAction } from "./biz/offer/offerManagement";

export default combineReducers({
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
  orderEntryReducer,
  reportEntryReducer,
  dataVerifyReducer,
  reportVerifyReducer,
  UserMenu,
  qualificationManagement,
  reportTemplateManagement,
  markReportManagement,
  reportSentManagement,
  reportArchivedManagement,
  deptTaskScope,
  orderDispatchReducer,
  taskDispatchReducer,
  sampleManagement,
  rpt_query_reportQuery,
  locationManagement,
  materialManagement,
  storeManagement,
  offerPrice,
  offerManagement,
});
