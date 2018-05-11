import React from 'react';
import { connect } from 'react-redux';
import Page from '../components/page';
import { addSecurityVenue, editSecurityVenue } from '../redux/actions';
import { getSecurityVenues } from '../selectors';

const mapStateToProps = state => {
  return {
    securityVenues: getSecurityVenues(state),
  };
};

const mapDispatchToProps = {
  addSecurityVenue,
  editSecurityVenue,
};

export default connect(mapStateToProps, mapDispatchToProps)(Page);
