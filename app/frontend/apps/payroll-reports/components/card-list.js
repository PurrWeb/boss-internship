import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';
import oFetch from 'o-fetch';

class CardList extends Component {
  renderItems(staffTypesWithFinanceReports) {
    const itemRenderer = oFetch(this.props, 'itemRenderer');

    return staffTypesWithFinanceReports.map(staffType => {
      if (staffType.get('reports').size === 0) return null;
      return React.cloneElement(itemRenderer(staffType), {
        key: staffType.get('id').toString(),
      });
    });
  }

  renderEmptyReports() {
    return (
      <div className="boss-page-main__note">
        <p className="boss-page-main__text-placeholder">There are no reports to show.</p>
      </div>
    );
  }

  renderNotification() {
    return (
      <div className="boss-page-main__note boss-page-main__note_role_info boss-page-main__note_context_stack">
        <h3 className="boss-page-main__note-title">
          <span className="boss-page-main__note-title-marked">20</span> Staff Members without uploaded payments
        </h3>
        <div className="boss-page-main__note-actions">
          <button type="button" className="boss-button">
            Send payment notifications
          </button>
        </div>
      </div>
    );
  }

  render() {
    const staffTypesWithFinanceReports = oFetch(this.props, 'staffTypesWithFinanceReports');
    return (
      <div className="boss-page-main__content">
        <div className="boss-page-main__inner">
          {staffTypesWithFinanceReports.size === 0
            ? this.renderEmptyReports()
            : this.renderItems(staffTypesWithFinanceReports)}
        </div>
      </div>
    );
  }
}

CardList.propTypes = {
  staffTypesWithFinanceReports: ImmutablePropTypes.list.isRequired,
  itemRenderer: PropTypes.func.isRequired,
};

export default CardList;
