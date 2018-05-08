import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import Immutable from 'immutable';
import { appRoutes } from '~/lib/routes';
import oFetch from 'o-fetch';
import Dashboard from './dashboard';
import CardList from './card-list';
import ReportList from './report-list';
import ReportItem from './report-item';


class Page extends Component {
  handleDateChange = selection => {
    this.goToPayrollReportsPage({
      startDate: oFetch(selection, 'startDate'),
      venueId: oFetch(this.props, 'venueId'),
    });
  };

  goToPayrollReportsPage({ startDate, venueId }) {
    location.href = appRoutes.payrollReports({
      startDate,
      venueId,
    });
  }

  handlePayRateChange = filter => {
    const changePayRateFilter = oFetch(this.props, 'changePayRateFilter');
    changePayRateFilter({ filter });
  };

  render() {
    const startDate = oFetch(this.props, 'startDate');
    const endDate = oFetch(this.props, 'endDate');
    const date = oFetch(this.props, 'date');
    const venueId = oFetch(this.props, 'venueId');
    const payRateFilter = oFetch(this.props, 'payRateFilter');
    const weekDates = oFetch(this.props, 'weekDates');
    const staffTypesWithFinanceReports = oFetch(this.props, 'staffTypesWithFinanceReports');

    const staffMemberIds = staffTypesWithFinanceReports
      .reduce(
        (acc, staffType) => acc.concat(staffType.get('reports').filter(report => report.get('status') === 'ready').map(report => report.get('staffMemberId'))),
        Immutable.List(),
      )
      .toJS();

    const reportsIds = staffTypesWithFinanceReports
      .reduce(
        (acc, staffType) => acc.concat(staffType.get('reports').filter(report => report.get('status') === 'ready').map(report => report.get('frontendId'))),
        Immutable.List(),
      )
      .toJS();

    return (
      <div className="boss-page-main boss-page-main_adjust_payroll-reports">
        <Dashboard
          title="Payroll Reports"
          date={date}
          startDate={startDate}
          endDate={endDate}
          venueId={venueId}
          payRateFilter={payRateFilter}
          onDateChange={this.handleDateChange}
          onPayRateChange={this.handlePayRateChange}
        />
        <CardList
          staffTypesWithFinanceReports={staffTypesWithFinanceReports}
          itemRenderer={staffType => {
            const staffMemberIds = staffType
              .get('reports')
              .filter(report => report.get('status') === 'ready')
              .map(report => report.get('staffMemberId'))
              .toJS();

            const reportsIds = staffType
              .get('reports')
              .filter(report => report.get('status') === 'ready')
              .map(report => report.get('frontendId'))
              .toJS();
            return (
              <ReportList
                staffType={staffType}
                startDate={startDate}
                itemRenderer={report => {
                  const staffMemberId = oFetch(report, 'staffMemberId');
                  const reportsId = oFetch(report, 'frontendId');
                  return (
                    <ReportItem
                      weekDates={weekDates}
                      report={report}
                    />
                  );
                }}
              />
            );
          }}
        />
      </div>
    );
  }
}

Page.propTypes = {
  date: PropTypes.string.isRequired,
  startDate: PropTypes.string.isRequired,
  endDate: PropTypes.string.isRequired,
  venueId: PropTypes.number.isRequired,
  payRateFilter: PropTypes.string.isRequired,
  staffTypesWithFinanceReports: ImmutablePropTypes.list.isRequired,
  weekDates: ImmutablePropTypes.list.isRequired,
  changePayRateFilter: PropTypes.func.isRequired,
};

export default Page;
