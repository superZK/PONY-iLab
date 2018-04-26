
import CategoryManagement from './document/category/CategoryManagement';
import MeasureUnitTable from './document/unit/Unit';
import TestItems from './document/testItems/TestItems';
import TestStandard from './document/testStandard/TestStandard';
import TestMethod from './document/testMethod/TestMethod';
import Product from './document/product/Product';
import ProgramEditDialog from './document/product/ProgramEditDialog';
import OrganizationManagement from './org/organization/OrganizationManagement';
import DeptManagement from './org/dept/DeptManagement';
import UserManagement from './auth/user/UserManagement';
import PrivilegeGrant from './auth/group/PrivilegeGrant';
import OrderEntry from './biz/orderEntry/OrderEntry';
import ReportEntry from './biz/reportEntry/ReportEntry';
import DataVerify from './biz/dataVerify/DataVerify';
import ReportVerify from './biz/reportVerify/ReportVerify';
import UserMenu from './public/UserMenu';
import QualificationManagement from './doc/qualification/QualificationManagement';
import ReportTemplateManagement from './doc/reportTemplate/ReportTemplateManagement';
import MarkReportManagement from './report/markReport/MarkReportManagement';
import ReportSentManagement from './report/reportSent/ReportSentManagement';
import ReportArchivedManagement from './report/reportArchived/ReportArchivedManagement';
import DeptTaskScope from './doc/relation/DeptTaskScope';
import rpt_query_ReportQuery from './rpt/query/ReportQuery';
import OrderDispatch from './dispatch/orderDispatch/OrderQuery';
import TaskDispatch from './dispatch/taskDispatch/TaskQuery';
import SampleManagement from './smp/sampling/SampleManagement';
import LocationManagement from './doc/location/LocationManagement';
import TestUI from '../component/public/TestUI';
import MaterialManagement from './mat/material/MaterialManagement';
import StoreManagement from './mat/store/StoreManagement';
import OfferPrice from './biz/offerPrice/OfferPrice';
import OfferManagement from './biz/offer/OfferManagement';

const PonyComp = {
  CategoryManagement,
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
  OrderEntry,
  ReportEntry,
  DataVerify,
  ReportVerify,
  UserMenu,
  TestUI,
  QualificationManagement,
  ReportTemplateManagement,
  MarkReportManagement,
  ReportSentManagement,
  ReportArchivedManagement,
  DeptTaskScope,
  rpt_query_ReportQuery,
  OrderDispatch,
  TaskDispatch,
  SampleManagement,
  LocationManagement,
  MaterialManagement,
  StoreManagement,
  OfferPrice,
  OfferManagement,
};

export default PonyComp;
