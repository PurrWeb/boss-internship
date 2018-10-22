import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { appRoutes } from '~/lib/routes';
import safeMoment from '~/lib/safe-moment';
import { DashboardActions } from '~/components/boss-dashboards';
import DashboardWeekSelect from '~/components/boss-dashboards/dashboard-week-select';
import SecurityRotaContent from './security-rota-content';
import SecurityRotaWeekDays from './security-rota-week-days';
import SecurityRotaOverviewChart from '~/components/security-rota-overview-chart';
import SecurityRotaStaffCount from './security-rota-staff-count';
import { GRANULARITY } from '../selectors';

class SecurityRotaOverviewPage extends Component {
  handleDateChage = selection => {
    this.goToOverviewPage({
      startDate: selection.startUIDate,
    });
  };

  handleRotaDayClick = date => {
    this.props.getSecurityRotaDayDataAction({ date });
  };

  render() {
    const {
      startDate,
      endDate,
      date,
      venueStaffCountList,
      staffMembers,
      rotaShifts,
      venues,
      rotas,
      breakdown,
      isLoading,
      groups,
      securityShiftRequestsCount,
    } = this.props;
    const jsSecurityShiftRequestsCount = securityShiftRequestsCount.toJS();
    const rotaEditUrlDate = safeMoment.uiDateParse(date).format('DD-MM-YYYY');
    const rotaDate = safeMoment.uiDateParse(date).format('dddd, D MMMM YYYY');
    return (
      <div className="boss-page-main">
        <DashboardWeekSelect
          startDate={startDate}
          endDate={endDate}
          onDateChange={this.handleDateChage}
          title="Security Rota"
        >
          <DashboardActions>
            <a
              href={appRoutes.securityRotaPdfDownload({
                date: this.props.date,
              })}
              className="boss-button boss-button_role_pdf-download boss-page-dashboard__button"
            >
              Download PDF
            </a>
          </DashboardActions>
        </DashboardWeekSelect>
        <SecurityRotaContent
          isLoading={isLoading}
          rotaEditUrlDate={rotaEditUrlDate}
          rotaDate={rotaDate}
          rotaShiftsLength={rotaShifts.size}
          rotaWeekDaysRenderer={() => (
            <SecurityRotaWeekDays
              securityShiftRequestsCount={jsSecurityShiftRequestsCount}
              date={date}
              onDateChange={this.handleRotaDayClick}
            />
          )}
          leftSideRenderer={() => (
            <SecurityRotaOverviewChart
              staff={staffMembers.toJS()}
              shifts={rotaShifts.toJS()}
              dateOfRota={safeMoment.uiDateParse(this.props.date).toDate()}
              breakdown={breakdown}
              granularity={GRANULARITY}
              groups={groups}
            />
          )}
          rightSideRenderer={() => (
            <SecurityRotaStaffCount
              venueStaffCountList={this.props.venueStaffCountList}
            />
          )}
        />
      </div>
    );
  }

  goToOverviewPage({ startDate }) {
    location.href = appRoutes.securityRotaOverview({
      startDate,
    });
  }
}

SecurityRotaOverviewPage.PropTypes = {
  date: PropTypes.string.isRequired,
  startDate: PropTypes.string.isRequired,
  endDate: PropTypes.string.isRequired,
  getSecurityRotaDayDataAction: PropTypes.func.isRequired,
  venueStaffCountList: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      count: PropTypes.number.isRequired,
    }),
  ).isRequired,
  staffMembers: PropTypes.array.isRequired,
  rotaShifts: PropTypes.array.isRequired,
  venues: PropTypes.array.isRequired,
  rotas: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
  breakdown: PropTypes.array.isRequired,
  groups: PropTypes.array.isRequired,
};

export default SecurityRotaOverviewPage;
