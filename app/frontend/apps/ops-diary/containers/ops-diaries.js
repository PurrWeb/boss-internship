import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
  getDiaries,
  createDiary,
  enableDiary,
  disableDiary,
  updateDiary,
} from '../reducers/actions';
import OpsDiariesPage from '../components/ops-diaries-page';
import { getInitialFilterData } from '../components/ops-diaries-filter/utils';
import * as constants from '../constants';

const mapStateToProps = state => {
  return {
    users: state.get('users'),
    venues: state.get('venues'),
    diaries: state.get('diaries'),
    isLoaded: state.getIn(['page', 'isLoaded']),
    perPage: state.getIn(['page', 'perPage']),
    totalCount: state.getIn(['page', 'totalCount']),
    page: state.get('page'),
  };
};

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(
      {
        getDiaries,
        createDiary,
        enableDiary,
        disableDiary,
        updateDiary,
      },
      dispatch,
    ),
  };
};

@connect(mapStateToProps, mapDispatchToProps)
class OpsDiaries extends Component {
  componentWillMount() {
    this.props.actions.getDiaries({
      data: getInitialFilterData(),
    });
  }

  render() {
    if (!this.props.isLoaded) {
      return <span>Loading .....</span>;
    }
    return <OpsDiariesPage {...this.props} />;
  }
}

export default OpsDiaries;
