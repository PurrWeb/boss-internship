import React, { Component } from 'react';
import PropTypes from 'prop-types';
import oFetch from 'o-fetch';
import ImmutablePropTypes from 'react-immutable-proptypes';

class SecurityShiftRequestVenueList extends Component {
  renderItems(securityShiftRequestsGrouppedByVenueId) {
    const venueCardRenderer = oFetch(this.props, 'venueCardRenderer');

    if (securityShiftRequestsGrouppedByVenueId.size === 0) {
      return <h1 className="boss-page-main__text-placeholder">No requests found</h1>
    }

    return securityShiftRequestsGrouppedByVenueId.entrySeq().map(([venueId, securityShiftRequests]) => {
      if (securityShiftRequests.size === 0) return;
      return React.cloneElement(venueCardRenderer(securityShiftRequests, venueId), {
        key: venueId.toString(),
      });
    });
  }
  render() {
    const securityShiftRequestsGrupedByVenueId = oFetch(this.props, 'securityShiftRequestsGrupedByVenueId');
    return (
      <div className="boss-board__inner">
        <div className="boss-board__cards">
          {this.renderItems(securityShiftRequestsGrupedByVenueId)}
        </div>
      </div>
    );
  }
}

SecurityShiftRequestVenueList.propTypes = {
  securityShiftRequestsGrupedByVenueId: ImmutablePropTypes.map.isRequired,
  venueCardRenderer: PropTypes.func.isRequired,
};

export default SecurityShiftRequestVenueList;
