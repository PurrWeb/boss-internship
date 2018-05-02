import React from 'react';
import { connect } from 'react-redux';
import Page from '../components/page';
import { addVenue, editVenue } from '../redux/actions';

const mapStateToProps = state => {
  return {
    venues: state.get('venues'),
  };
};

const mapDispatchToProps = {
  addVenue,
  editVenue,
};

export default connect(mapStateToProps, mapDispatchToProps)(Page);
