import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Product from '../../../component/document/product/Product';
import * as productAction from '../../../action/document/product/productAction';
import * as programEditDialogAction from '../../../action/document/product/programEditDialogAction';

const mapStateToProps = (state) => ({
  isLoading: state.Product.get('isLoading'),
  editType: state.Product.get('editType'),
  categoryData: state.Product.get('categoryData'),
  selectedItemKey: state.Product.get('selectedItemKey'),
  productData: state.Product.get('productData'),
  preparedItems: state.Product.get('preparedItems'),
  preparedKeys: state.Product.get('preparedKeys'),
  preparedProgramKeys: state.Product.get('preparedProgramKeys'),
  currentItem: state.Product.get('currentItem'),
  preparedPrograms: state.Product.get('preparedPrograms'),
  modalTitle: state.Product.get('modalTitle'),
  modalInformation: state.Product.get('modalInformation'),
  oldVersions: state.Product.get('oldVersions'),
  needReload: state.Product.get('needReload'),
  productScopeData: state.Product.get('productScopeData'),
  productSRows: state.Product.get('productSRows'),
  productSRowKeys: state.Product.get('productSRowKeys'),
  handleType: state.Product.get('handleType'),
  productSClick: state.Product.get('productSClick'),
  productSResultData: state.Product.get('productSResultData'),
  productSResultRows: state.Product.get('productSResultRows'),
  productSResultRowKeys: state.Product.get('productSResultRowKeys'),
  testFlowData : state.ProgramEditDialog.get('testFlowData'),
  preparedTestFlows : state.ProgramEditDialog.get('preparedTestFlows'),
  preparedTestFlowKeys : state.ProgramEditDialog.get('preparedTestFlowKeys'),
  preparedRecords : state.ProgramEditDialog.get('preparedRecords'),
});

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    productAction: bindActionCreators(productAction, dispatch),
    programEditDialogAction: bindActionCreators(programEditDialogAction, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Product);
