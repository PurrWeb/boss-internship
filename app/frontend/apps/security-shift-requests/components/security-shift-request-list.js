import React, { Component } from 'react';
import PropTypes from 'prop-types';
import oFetch from 'o-fetch';
import ImmutablePropTypes from 'react-immutable-proptypes';

class SecurityShiftRequestList extends Component {
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

    if (securityShiftRequests.size === 0) {
      return (
        <div className="boss-board__inner">
          <div className="boss-board__cards">
            <h1 className="boss-page-main__text-placeholder">No requests found</h1>
          </div>
        </div>
      );
    }

    return (
      <div className="boss-board__inner">
        <div className="boss-board__table">
          <div className={`boss-table boss-table_page_ssr-${isCompleted ? 'completed' : 'pending'}`}>
            <div className="boss-table__row">
              <div className="boss-table__cell boss-table__cell_role_header">Requested times</div>
              <div className="boss-table__cell boss-table__cell_role_header">Venue</div>
              <div className="boss-table__cell boss-table__cell_role_header">Note</div>
              {this.props.isCompleted && (
                <div className="boss-table__cell boss-table__cell_role_header">Rotaed Shift</div>
              )}
              <div className="boss-table__cell boss-table__cell_role_header">Status</div>
              <div className="boss-table__cell boss-table__cell_role_header">Actions</div>
            </div>
            {this.renderItems(securityShiftRequests)}
          </div>
        </div>
      </div>
    );
  }
}

SecurityShiftRequestList.propTypes = {
  isCompleted: PropTypes.bool,
  securityShiftRequests: ImmutablePropTypes.list.isRequired,
  itemRenderer: PropTypes.func.isRequired,
};

SecurityShiftRequestList.defaultProps = {
  isCompleted: false,
};

export default SecurityShiftRequestList;
