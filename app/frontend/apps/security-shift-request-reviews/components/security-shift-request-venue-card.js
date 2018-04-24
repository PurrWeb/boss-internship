import React, { Component } from 'react';
import PropTypes from 'prop-types';
import oFetch from 'o-fetch';
import ImmutablePropTypes from 'react-immutable-proptypes';

class SecurityShiftRequestVenueCard extends Component {
  renderItems(securityShiftRequests) {
    const itemRenderer = oFetch(this.props, 'itemRenderer');

    return securityShiftRequests.map(securityShiftRequest => {
      const jsSecurityShiftRequest = securityShiftRequest.toJS();
      const securityShiftRequestId = oFetch(jsSecurityShiftRequest, 'id');

      return React.cloneElement(itemRenderer(jsSecurityShiftRequest), {
        key: securityShiftRequestId.toString(),
      });
    });
  }
  render() {
    const securityShiftRequests = oFetch(this.props, 'securityShiftRequests');
    const isCompleted = oFetch(this.props, 'isCompleted');
    const venue = oFetch(this.props, 'venue');

    const venueJS = venue.toJS();

    return (
      <div className="boss-check boss-check_role_panel">
        <div className="boss-check__row">
          <div className="boss-check__cell">
            <p className="boss-check__title boss-check__title_role_venue">
              {oFetch(venueJS, 'name')}
            </p>
          </div>
        </div>
        <div className="boss-check__group">
          <div
            className={`boss-table boss-table_page_ssr-admin-${
              isCompleted ? 'completed' : 'pending'
            }`}
          >
            <div className="boss-table__row">
              <div className="boss-table__cell boss-table__cell_role_header">
                Requested times
              </div>
              <div className="boss-table__cell boss-table__cell_role_header">
                Note
              </div>
              {this.props.isCompleted && (
                <div className="boss-table__cell boss-table__cell_role_header">
                  Rotaed Shift
                </div>
              )}
              {this.props.isCompleted ? (
                <div className="boss-table__cell boss-table__cell_role_header">
                  Status
                </div>
              ) : (
                <div className="boss-table__cell boss-table__cell_role_header">
                  Actions
                </div>
              )}
            </div>
            {this.renderItems(securityShiftRequests)}
          </div>
        </div>
      </div>
    );
  }
}

SecurityShiftRequestVenueCard.propTypes = {
  isCompleted: PropTypes.bool,
  venue: ImmutablePropTypes.map.isRequired,
  securityShiftRequests: ImmutablePropTypes.list.isRequired,
  itemRenderer: PropTypes.func.isRequired,
};

export default SecurityShiftRequestVenueCard;
