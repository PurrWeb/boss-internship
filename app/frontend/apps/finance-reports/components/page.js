import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import Immutable from 'immutable';
import { appRoutes } from '~/lib/routes';
import oFetch from 'o-fetch';
import { openConfirmationModal, openWarningModal } from '~/components/modals';
import Dashboard from './dashboard';
import CardList from './card-list';
import ReportList from './report-list';
import { PureJSReportItem } from './report-item';
import Confirm from './confirm';
import * as _ from 'lodash';

class Page extends Component {
  handleDateChange = selection => {
    this.goToFinanceReportsPage({
      startDate: oFetch(selection, 'startUIDate'),
      venueId: oFetch(this.props, 'venueId'),
    });
  };

  goToFinanceReportsPage({ startDate, venueId }) {
    location.href = appRoutes.financeReports({
     startDate,
      venueId,
    });
  }

  handleFilterChange = filter => {
    const changePayRateFilter = oFetch(this.props, 'changePayRateFilter');
    changePayRateFilter({ filter });
  };

  handleOpenMarkCompletedModal = params => {
    const isNegativeTotal = oFetch(params, 'isNegativeTotal');
    if (isNegativeTotal) {
      openWarningModal({
        submit: this.handleMarkComplete,
        config: {
          title: 'Are You Sure?',
          text: [
            'You are attempting to complete a finance report with a negative total.',
            'If you choose to proceed all accessory requests will be removed and moved to the next available finance report.',
          ],
          buttonText: 'Continue and move Accessory Requests',
        },
        props: params,
      });
    } else {
      openConfirmationModal({
        submit: this.handleMarkComplete,
        config: { title: 'WARNING !!!' },
        props: { params },
      })(Confirm);
    }
  };

  handleMarkComplete = (hideModal, values) => {
    const markReportCompleted = oFetch(this.props, 'markReportCompleted');

    return markReportCompleted(values)
      .then(hideModal)
      .catch(hideModal);
  };

  handleOpenMarkAllCompletedModal = params => {
    const isNegativeTotal = oFetch(params, 'isNegativeTotal');
    if (isNegativeTotal) {
      openWarningModal({
        submit: this.handleMarkAllComplete,
        config: {
          title: 'Are You Sure?',
          text: [
            'You are attempting to complete a finance report with a negative total.',
            'If you choose to proceed all accessory requests will be removed and moved to the next available finance report.',
          ],
          buttonText: 'Continue and move Accessory Requests',
        },
        props: params,
      });
    } else {
      openConfirmationModal({
        submit: this.handleMarkAllComplete,
        config: { title: 'WARNING !!!' },
        props: { params },
      })(Confirm);
    }
  };

  handleMarkAllComplete = (hideModal, values) => {
    const markReportsCompleted = oFetch(this.props, 'markReportsCompleted');

    return markReportsCompleted(values)
      .then(hideModal)
      .catch(hideModal);
  };

  canExportToCSV(options) {
    return true;
  }

  render() {
    const startDate = oFetch(this.props, 'startDate');
    const endDate = oFetch(this.props, 'endDate');
    const date = oFetch(this.props, 'date');
    const venueId = oFetch(this.props, 'venueId');
    const filterType = oFetch(this.props, 'filterType');
    const weekDates = oFetch(this.props, 'weekDates');
    const allReady = oFetch(this.props, 'allReady');
    const permissions = oFetch(this.props, 'permissions');
    const showPDFDownloadLink = oFetch(permissions, 'showPDFDownloadLink');
    const staffTypesWithFinanceReports = oFetch(this.props, 'staffTypesWithFinanceReports');

    const staffMemberIds = staffTypesWithFinanceReports
      .reduce(
        (acc, staffType) =>
          acc.concat(
            staffType
              .get('reports')
              .filter(report => report.getIn(['status']) === 'ready')
              .map(report => report.get('staffMemberId')),
          ),
        Immutable.List(),
      )
      .toJS();

    const reportsTotals = staffTypesWithFinanceReports.reduce(
      (acc, staffType) =>
        acc.concat(
          staffType
            .get('reports')
            .filter(report => report.getIn(['status']) === 'ready')
            .map(report => report.get('total')),
        ),
      Immutable.List(),
    );
    const isNegativeTotal = !!reportsTotals.find(total => total < 0);

    const canExportToCSV = this.canExportToCSV({ staffTypesWithFinanceReports });

    return (
      <div className="boss-page-main boss-page-main_adjust_finance-reports">
        <Dashboard
          title="Finance Reports"
          date={date}
          startDate={startDate}
          endDate={endDate}
          venueId={venueId}
          filterType={filterType}
          onDateChange={this.handleDateChange}
          onFilterChange={this.handleFilterChange}
          canExportToCSV={canExportToCSV}
          showPDFDownloadLink={showPDFDownloadLink}
        />
        <CardList
          staffTypesWithFinanceReports={staffTypesWithFinanceReports}
          onMarkAllPageCompleted={() =>
            this.handleOpenMarkAllCompletedModal({ staffMemberIds, isNegativeTotal })
          }
          allReady={allReady}
          itemRenderer={staffType => {
            const staffTypeJS = staffType.toJS();
            const reportsJS = oFetch(staffTypeJS, 'reports');

            const staffMemberIds = reportsJS
              .filter(report => {
                return oFetch(report, 'status') === 'ready';
              })
              .map(report => oFetch(report, 'staffMemberId'));

            const isNegativeTotal = !!reportsJS.find(report => oFetch(report, 'total') < 0);
            return (
              <ReportList
                staffType={staffType}
                startDate={startDate}
                onMarkAllCompleted={() =>
                  this.handleOpenMarkAllCompletedModal({ staffMemberIds, isNegativeTotal })
                }
                itemRenderer={report => {
                  return (
                    <PureJSReportItem
                      onMarkCompleted={this.handleOpenMarkCompletedModal}
                      weekDates={weekDates}
                      report={report}
                      startDate={startDate}
                      endDate={endDate}
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
  filterType: PropTypes.string.isRequired,
  staffTypesWithFinanceReports: ImmutablePropTypes.list.isRequired,
  weekDates: ImmutablePropTypes.list.isRequired,
  changePayRateFilter: PropTypes.func.isRequired,
  allReady: PropTypes.bool.isRequired,
  markReportCompleted: PropTypes.func.isRequired,
  markReportsCompleted: PropTypes.func.isRequired,
};

export default Page;
