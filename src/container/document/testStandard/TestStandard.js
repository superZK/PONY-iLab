import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import TestStandard from '../../../component/document/testStandard/TestStandard';
import {
  asyncLoadData,
  asyncSelectItem,
  addItem,
  asyncSaveItem,
  prepareItem,
  editItem,
  asyncDeleteItems,
  getTestItems,
  upItem,
  asyncUpVersion,
  activeItem,
  enableItem,
  asyncActiveEnable,
  viewOldVersionItem,
  discardItem,
  asyncDiscard,
  importItem,
  exportItem,
  cancelAddEdit,
  cancelDeleteItems,
} from '../../../action/document/testStandard/testStandardAction';

const mapStateToProps = (state) => ({
  isLoading : state.TestStandard.get('isLoading'),
  editType : state.TestStandard.get('editType'),
  categoryData : state.TestStandard.get('categoryData'),
  selectedItemKey : state.TestStandard.get('selectedItemKey'),
  standardData : state.TestStandard.get('standardData'),
  preparedItems : state.TestStandard.get('preparedItems'),
  preparedKeys : state.TestStandard.get('preparedKeys'),
  modalTitle : state.TestStandard.get('modalTitle'),
  modalInformation : state.TestStandard.get('modalInformation'),
  oldVersions : state.TestStandard.get('oldVersions'),
  needReload : state.TestStandard.get('needReload'),
  standardLinkedTestItems : state.TestStandard.get('standardLinkedTestItems'),
});

const mapDispatchToProps = (dispatch, ownProps) => {
  return bindActionCreators({
    asyncLoadData,
    asyncSelectItem,
    addItem,
    asyncSaveItem,
    prepareItem,
    editItem,
    asyncDeleteItems,
    getTestItems,
    upItem,
    asyncUpVersion,
    activeItem,
    enableItem,
    asyncActiveEnable,
    viewOldVersionItem,
    discardItem,
    asyncDiscard,
    importItem,
    exportItem,
    cancelAddEdit,
    cancelDeleteItems,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(TestStandard);
