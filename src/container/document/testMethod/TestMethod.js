import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import TestMethod from '../../../component/document/testMethod/TestMethod';
import {
  asyncLoadData,
  asyncSelectItem,
  addItem,
  editItem,
  asyncSaveItem,
  prepareItem,
  asyncDeleteItems,
  getTestItems,
  upItem,
  asyncUpVersion,
  activeItem,
  enableItem,
  asyncActiveEnable,
  discardItem,
  asyncDiscard,
  viewOldVersionItem,
  importItem,
  exportItem,
  cancelAddEdit,
  cancelDeleteItems,
  uploadModalTestMethod,
  uploadTestMethod,
} from '../../../action/document/testMethod/testMethodAction';

const mapStateToProps = (state) => ({
  isLoading : state.TestMethod.get('isLoading'),
  editType : state.TestMethod.get('editType'),
  categoryData : state.TestMethod.get('categoryData'),
  selectedItemKey : state.TestMethod.get('selectedItemKey'),
  methodData : state.TestMethod.get('methodData'),
  preparedItems : state.TestMethod.get('preparedItems'),
  preparedKeys : state.TestMethod.get('preparedKeys'),
  methodLinkedTestItems : state.TestMethod.get('methodLinkedTestItems'),
  modalTitle : state.TestMethod.get('modalTitle'),
  modalInformation : state.TestMethod.get('modalInformation'),
  oldVersions : state.TestMethod.get('oldVersions'),
  needReload : state.TestMethod.get('needReload'),
  uploadData : state.TestMethod.get('uploadData'),
});

const mapDispatchToProps = (dispatch, ownProps) => {
  return bindActionCreators({
    asyncLoadData,
    asyncSelectItem,
    addItem,
    editItem,
    asyncSaveItem,
    prepareItem,
    asyncDeleteItems,
    getTestItems,
    upItem,
    asyncUpVersion,
    activeItem,
    enableItem,
    asyncActiveEnable,
    discardItem,
    asyncDiscard,
    viewOldVersionItem,
    importItem,
    exportItem,
    cancelAddEdit,
    cancelDeleteItems,
    uploadModalTestMethod,
    uploadTestMethod,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(TestMethod);
