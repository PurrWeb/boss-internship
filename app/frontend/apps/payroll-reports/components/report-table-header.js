import React, { Component } from 'react';
import PropTypes from 'prop-types';
import safeMoment from '~/lib/safe-moment';
import oFetch from 'o-fetch';
import utils from '~/lib/utils';

class ReportTableHeader extends Component {
  renderWeekCells() {
    const staffTypeName = oFetch(this.props, 'staffTypeName')
    const startDate = safeMoment.uiDateParse(oFetch(this.props, 'startDate'));

    return [1, 2, 3, 4, 5, 6, 7].map(weekDay => {
      const currentDate = startDate.isoWeekday(weekDay);
      return (<div key={`${staffTypeName}:header:${weekDay}`} className="boss-table__cell boss-table__cell_role_header">
      {currentDate.format(utils.tableDateFormat)} <br /> {currentDate.format(utils.monthDateFormat)}
    </div>)
    });
  }

  render() {
    return (
      <div className="boss-table__row">
        <div className="boss-table__cell boss-table__cell_role_header">Name</div>
        <div className="boss-table__cell boss-table__cell_role_header">Pay Type</div>
        {this.renderWeekCells()}
        <div className="boss-table__cell boss-table__cell_role_header">Weekly Hours</div>
        <div className="boss-table__cell boss-table__cell_role_header">Owed Hours</div>
        <div className="boss-table__cell boss-table__cell_role_header">Accessories</div>
        <div className="boss-table__cell boss-table__cell_role_header">Total Hours</div>
        <div className="boss-table__cell boss-table__cell_role_header">Paid Holidays (Days)</div>
        <div className="boss-table__cell boss-table__cell_role_header">Net Wages</div>
      </div>
    );
  }
}

ReportTableHeader.propTypes = {
  startDate: PropTypes.string.isRequired,
};

export default ReportTableHeader;
