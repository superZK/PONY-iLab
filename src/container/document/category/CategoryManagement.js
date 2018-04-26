import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import comp from '../../../component/document/category/CategoryManagement';
import {
  asyncLoadData,
  asyncSaveCategory,
  selectCategory,
  prepareCategory,
  editCategory,
  cancelEditCategory,
  addCategory,
  asyncDeleteCategories,
} from '../../../action/document/category/categoryManagementAction';

const mapStateToProps = (state) => ({
  isLoading : state.categoryManagement.get('isLoading'),
  editType: state.categoryManagement.get('editType'),
  categoryData : state.categoryManagement.get('categoryData'),
  selectedCategory : state.categoryManagement.get('selectedCategory'),
  preparedCategories : state.categoryManagement.get('preparedCategories'),
  preparedKeys : state.categoryManagement.get('preparedKeys'),
});

const mapDispatchToProps = (dispatch, ownProps) => {
  return bindActionCreators({
    asyncLoadData,
    asyncSaveCategory,
    selectCategory,
    prepareCategory,
    editCategory,
    cancelEditCategory,
    addCategory,
    asyncDeleteCategories,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(comp);
