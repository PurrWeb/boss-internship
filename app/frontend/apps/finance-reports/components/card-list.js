import React, { Component } from 'react';
import PropTypes from 'prop-types';
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

  renderMarkAllComplete() {
    const onMarkAllPageCompleted = oFetch(this.props, 'onMarkAllPageCompleted');

    return (
      <div className="boss-page-main__note boss-page-main__note_role_info">
        <h3 className="boss-page-main__note-title">Complete All Reports</h3>
        <p className="boss-page-main__note-text">All Reports on this page are completable</p>
        <p className="boss-page-main__note-text">
          Clicking here will complete all reports on this week after which no edits will be possible.
        </p>
        <p className="boss-page-main__note-text boss-page-main__note-text_role_important">
          Do not click unless you are sure the numbers are correct.
        </p>
        <div className="boss-page-main__note-actions">
          <button onClick={onMarkAllPageCompleted} type="button" className="boss-button boss-button_role_confirm">
            Mark All Complete
          </button>
        </div>
      </div>
    );
  }

  render() {
    const staffTypesWithFinanceReports = oFetch(this.props, 'staffTypesWithFinanceReports');
    const allReady = oFetch(this.props, 'allReady');
    const reports = this.renderItems(staffTypesWithFinanceReports);
    const hasReports = reports.filter(report => report !== null).size !== 0;
    return (
      <div className="boss-page-main__content">
        <div className="boss-page-main__inner">
          {hasReports ? reports : this.renderEmptyReports()}
          {allReady && hasReports && this.renderMarkAllComplete()}
        </div>
      </div>
    );
  }
}

CardList.propTypes = {
  staffTypesWithFinanceReports: ImmutablePropTypes.list.isRequired,
  itemRenderer: PropTypes.func.isRequired,
  allReady: PropTypes.bool.isRequired,
  onMarkAllPageCompleted: PropTypes.func.isRequired,
};

export default CardList;
