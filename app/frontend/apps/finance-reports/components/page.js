import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import Immutable from 'immutable';
import { appRoutes } from '~/lib/routes';
import oFetch from 'o-fetch';
import { openConfirmationModal } from '~/components/modals';
import Dashboard from './dashboard';
import CardList from './card-list';
import ReportList from './report-list';
import ReportItem from './report-item';
import Confirm from './confirm';

class Page extends Component {
  handleDateChange = selection => {
    this.goToFinanceReportsPage({
      startDate: oFetch(selection, 'startDate'),
      venueId: oFetch(this.props, 'venueId'),
    });
  };

  goToFinanceReportsPage({ startDate, venueId }) {
    location.href = appRoutes.financeReports({
      startDate,
      venueId,
    });
  }

  handlePayRateChange = filter => {
    const changePayRateFilter = oFetch(this.props, 'changePayRateFilter');
    changePayRateFilter({ filter });
  };

  handleOpenMarkCompletedModal = params => {
    openConfirmationModal({
      submit: this.handleMarkComplete,
      config: { title: 'WARNING !!!' },
      props: { params },
    })(Confirm);
  };

  handleMarkComplete = (hideModal, values) => {
    const markReportCompleted = oFetch(this.props, 'markReportCompleted');

    return markReportCompleted(values)
      .then(hideModal)
      .catch(hideModal);
  };

  handleOpenMarkAllCompletedModal = params => {
    openConfirmationModal({
      submit: this.handleMarkAllComplete,
      config: { title: 'WARNING !!!' },
      props: { params },
    })(Confirm);
  };

  handleMarkAllComplete = (hideModal, values) => {
    const markReportsCompleted = oFetch(this.props, 'markReportsCompleted');

    return markReportsCompleted(values)
      .then(hideModal)
      .catch(hideModal);
  };

  render() {
    const startDate = oFetch(this.props, 'startDate');
    const endDate = oFetch(this.props, 'endDate');
    const date = oFetch(this.props, 'date');
    const weekDates = oFetch(this.props, 'weekDates');
    const allReady = oFetch(this.props, 'allReady');
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
      <div className="boss-page-main boss-page-main_adjust_finance-reports">
        <Dashboard
          title="Finance Reports"
          date={date}
          startDate={startDate}
          endDate={endDate}
          onDateChange={this.handleDateChange}
          onPayRateChange={this.handlePayRateChange}
        />
        <CardList
          staffTypesWithFinanceReports={staffTypesWithFinanceReports}
          onMarkAllPageCompleted={() => this.handleOpenMarkAllCompletedModal({ reportsIds, staffMemberIds })}
          allReady={allReady}
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
                onMarkAllCompleted={() => this.handleOpenMarkAllCompletedModal({ reportsIds, staffMemberIds })}
                itemRenderer={report => {
                  const staffMemberId = oFetch(report, 'staffMemberId');
                  const reportsId = oFetch(report, 'frontendId');
                  return (
                    <ReportItem
                      onMarkCompleted={() => this.handleOpenMarkCompletedModal({ staffMemberId, reportsId })}
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
  staffTypesWithFinanceReports: ImmutablePropTypes.list.isRequired,
  weekDates: ImmutablePropTypes.list.isRequired,
  changePayRateFilter: PropTypes.func.isRequired,
  allReady: PropTypes.bool.isRequired,
  markReportCompleted: PropTypes.func.isRequired,
  markReportsCompleted: PropTypes.func.isRequired,
};

export default Page;
