import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import AccessoriesPage from '../components/accessories-page';

import {
  loadInitialData,
  createAccessory,
  updateAccessory,
  disableAccessory,
  restoreAccessory,
  loadMoreClick,
  filter,
  updateAccessoryFreeItems,
} from '../redux/actions';

const mapStateToProps = (state) => {
  return {
    accessories: state.getIn(['page', 'accessories']),
    pagination: state.getIn(['page', 'pagination']),
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators({
      loadInitialData,
      createAccessory,
      updateAccessory,
      disableAccessory,
      restoreAccessory,
      loadMoreClick,
      filter,
      updateAccessoryFreeItems,
    }, dispatch)
  };
}
@connect(mapStateToProps, mapDispatchToProps)
class AccessoriesPageContainer extends React.Component {
  componentWillMount() {
    this.props.actions.loadInitialData();
  }

  render() {
    const props = {
      ...this.props,
      accessories: this.props.accessories.toJS(),
      pagination: this.props.pagination.toJS(),
    }

    return (
      <AccessoriesPage {...props}/>
    )
  }
}

export default AccessoriesPageContainer;
