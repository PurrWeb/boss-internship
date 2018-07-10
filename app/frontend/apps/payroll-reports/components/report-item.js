import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import oFetch from 'o-fetch';
import classNames from 'classnames';
import utils from '~/lib/utils';
import { appRoutes } from '~/lib/routes';

class ReportItem extends Component {
  renderWeekDaysCells() {
    const report = oFetch(this.props, 'report');
    const mondayHoursCount = utils.round(oFetch(report, 'mondayHoursCount'), 2);
    const tuesdayHoursCount = utils.round(oFetch(report, 'tuesdayHoursCount'), 2);
    const wednesdayHoursCount = utils.round(oFetch(report, 'wednesdayHoursCount'), 2);
    const thursdayHoursCount = utils.round(oFetch(report, 'thursdayHoursCount'), 2);
    const fridayHoursCount = utils.round(oFetch(report, 'fridayHoursCount'), 2);
    const saturdayHoursCount = utils.round(oFetch(report, 'saturdayHoursCount'), 2);
    const sundayHoursCount = utils.round(oFetch(report, 'sundayHoursCount'), 2);
    const staffMemberId = oFetch(this.props, 'report.staffMemberId');
    const weekDates = oFetch(this.props, 'weekDates');

    return [
      mondayHoursCount,
      tuesdayHoursCount,
      wednesdayHoursCount,
      thursdayHoursCount,
      fridayHoursCount,
      saturdayHoursCount,
      sundayHoursCount,
    ].map((dayHoursCount, index) => {
      const weekDate = weekDates.get(index);

      if (dayHoursCount === 0) {
        return (
          <div key={index} className="boss-table__cell">
            <p className="boss-table__text">-</p>
          </div>
        );
      } else {
        return (
          <div key={index} className="boss-table__cell">
            <p className="boss-table__text">
              <a href={appRoutes.staffMemberHoursOverview(staffMemberId, weekDate)} className="boss-table__link">
                {dayHoursCount}
              </a>
            </p>
          </div>
        );
      }
    });
  }

  render() {
    const report = oFetch(this.props, 'report');
    const startDate = oFetch(this.props, 'startDate');
    const endDate = oFetch(this.props, 'endDate');
    const fullName = oFetch(report, 'staffMemberName');
    const weeklyHours = utils.round(oFetch(report, 'weeklyHours'), 2);
    const owedHours = utils.round(oFetch(report, 'owedHours'), 2);

    const acessories = utils.round(oFetch(report, 'acessories'), 2);
    const acessoriesColor = utils.colorizedAmount(acessories);
    const totalHoursCount = utils.round(oFetch(report, 'totalHoursCount') + owedHours, 2);
    const holidayDaysCount = oFetch(report, 'holidayDaysCount');
    const staffMemberId = oFetch(report, 'staffMemberId');
    const payRateType = oFetch(report, 'payRateType');
    const netWagesCents = oFetch(report, 'netWagesCents');
    const canSeeNetWages = oFetch(report, 'canSeeNetWages');

    const fullNameCellClassName = classNames({
      'boss-table__text': true,
      'boss-table__text_indicator_accessory': acessories !== 0,
    });

    const owedHoursClassName = classNames({
      'boss-table__cell': true,
      'boss-table__cell_indicator_clock-warning': owedHours !== 0,
    });
    const holidayDaysCountClassName = classNames({
      'boss-table__cell': true,
      'boss-table__cell_indicator_clock-warning': holidayDaysCount !== 0,
    });
    return (
      <div className="boss-table__row">
        <div className="boss-table__cell">
          <p className={fullNameCellClassName}>
            <a
              href={appRoutes.staffMember(staffMemberId)}
              className="boss-table__link"
              style={{ textTransform: 'capitalize' }}
            >
              {fullName}
            </a>
          </p>
        </div>
        <div className="boss-table__cell">
          <p className="boss-table__text" style={{ textTransform: 'capitalize' }}>
            {payRateType}
          </p>
        </div>
        {this.renderWeekDaysCells()}
        <div className="boss-table__cell">
          <p className="boss-table__text">{weeklyHours}</p>
        </div>
        {owedHours === 0 ? (
          <div className={owedHoursClassName}>
            <p className="boss-table__text">{owedHours}</p>
          </div>
        ) : (
          <div className={owedHoursClassName}>
            <a href={appRoutes.staffMemberOwedHours(staffMemberId)} className="boss-table__link">
              {owedHours}
            </a>
          </div>
        )}

        <div className="boss-table__cell">
          {acessories === 0 ? (
            <p className="boss-table__text">{utils.moneyFormat(acessories)}</p>
          ) : (
            <a
              href={appRoutes.staffMemberAccessories(staffMemberId)}
              className="boss-table__text"
              style={{ color: acessoriesColor }}
            >
              {utils.moneyFormat(acessories)}
            </a>
          )}
        </div>
        <div className="boss-table__cell">
          <p className="boss-table__text boss-table__text_role_important">{totalHoursCount}</p>
        </div>
        {holidayDaysCount === 0 ? (
          <div className={holidayDaysCountClassName}>
            <p className="boss-table__text">{holidayDaysCount}</p>
          </div>
        ) : (
          <div className={holidayDaysCountClassName}>
            <a href={appRoutes.staffMemberHolidaysFromFinanceReport(staffMemberId, startDate, endDate)} className="boss-table__link">
              {holidayDaysCount}
            </a>
          </div>
        )}
        <div className="boss-table__cell">
          <p className="boss-table__text">
            { netWagesCents && <span>{ canSeeNetWages ? utils.moneyFormat(netWagesCents / 100.0) : 'XXXX'  }</span> }
          </p>
        </div>
      </div>
    );
  }
}

ReportItem.propTypes = {
  report: PropTypes.shape({
    staffMemberId: PropTypes.number.isRequired,
    mondayHoursCount: PropTypes.number.isRequired,
    tuesdayHoursCount: PropTypes.number.isRequired,
    wednesdayHoursCount: PropTypes.number.isRequired,
    thursdayHoursCount: PropTypes.number.isRequired,
    fridayHoursCount: PropTypes.number.isRequired,
    saturdayHoursCount: PropTypes.number.isRequired,
    sundayHoursCount: PropTypes.number.isRequired,
    weeklyHours: PropTypes.number.isRequired,
    owedHours: PropTypes.number.isRequired,
    totalHoursCount: PropTypes.number.isRequired,
    holidayDaysCount: PropTypes.number.isRequired,
    staffMemberName: PropTypes.string.isRequired,
    acessories: PropTypes.number.isRequired,
  }).isRequired,
  weekDates: ImmutablePropTypes.list.isRequired,
};

export default ReportItem;
