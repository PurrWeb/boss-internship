import React, { Component } from 'react';
import PropTypes from 'prop-types';
import humanize from 'string-humanize';
import oFetch from 'o-fetch';
import classNames from 'classnames';
import utils from '~/lib/utils';
import safeMoment from '~/lib/safe-moment';
import { appRoutes } from '~/lib/routes';
import { Tooltip } from 'react-tippy';
import pureToJs from '~/hocs/pure-to-js';
const cellStyle = { flexDirection: 'row', alignItems: 'center' };

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
    const hoursPending = oFetch(report, 'hoursPending');
    const daysNeedingCompletion = oFetch(report, 'daysNeedingCompletion');

    return [
      mondayHoursCount,
      tuesdayHoursCount,
      wednesdayHoursCount,
      thursdayHoursCount,
      fridayHoursCount,
      saturdayHoursCount,
      sundayHoursCount,
    ].map((dayHoursCount, index) => {
      const weekDate = weekDates[index];
      if (hoursPending === true && daysNeedingCompletion[weekDate]) {
        const tooltipContent = (
          <span>
            <a target="_blank" href={appRoutes.staffMemberHoursOverview(staffMemberId, weekDate)}>
              {daysNeedingCompletion[weekDate].join(', ')}
            </a>
          </span>
        );
        return (
          <div key={index} className={this.getCellClassName({ alertStyles: true })} style={cellStyle}>
            <a
              href={appRoutes.staffMemberHoursOverview(staffMemberId, weekDate)}
              className={`${this.getTextClassName({ alertStyles: true })} boss-table__link`}
            >
              {dayHoursCount}
            </a>
            {this.renderTooltip(tooltipContent)}
          </div>
        );
      } else {
        return (
          <div key={index} className={this.getCellClassName({ alertStyles: false })} style={cellStyle}>
            <p style={{ marginBottom: 0 }} className={this.getTextClassName({ alertStyles: false })}>
              <a
                href={appRoutes.staffMemberHoursOverview(staffMemberId, weekDate)}
                className={`${this.getTextClassName({ alertStyles: false })} boss-table__link`}
              >
                {dayHoursCount}
              </a>
            </p>
          </div>
        );
      }
    });
  }

  getCellClassName(params) {
    const alertStyles = oFetch(params, 'alertStyles');
    return classNames({
      'boss-table__cell': true,
      'boss-table__cell_state_alert': alertStyles,
    });
  }

  getTextClassName(params) {
    const alertStyles = oFetch(params, 'alertStyles');
    return classNames({
      'boss-boss-table__text': true,
      'boss-table__text_state_alert': alertStyles,
    });
  }

  renderTooltip(content) {
    return (
      <Tooltip arrow theme="light" position="right" interactive html={content}>
        <span className="boss-table__tooltip">
          <span className="boss-tooltip boss-tooltip_role_alert">
            <span className="boss-tooltip__icon" />
          </span>
        </span>
      </Tooltip>
    );
  }

  renderSageId = props => {
    const [sageId, allowNoSageId, staffMemberId] = oFetch(props, 'sageId', 'allowNoSageId', 'staffMemberId');
    if (sageId) {
      return (
        <div className="boss-table__cell">
          <div className="boss-table__text">{sageId}</div>
        </div>
      );
    }
    if (!sageId && allowNoSageId) {
      return (
        <div className="boss-table__cell">
          <div className="boss-table__text" />
        </div>
      );
    }
    if (!sageId && !allowNoSageId) {
      return (
        <div className="boss-table__cell boss-table__cell_state_alert">
          <a href={appRoutes.staffMember(staffMemberId)}>
            <p className="boss-table__text boss-table__text_state_alert">
              <span className="boss-table__tooltip">
                <span className="boss-tooltip boss-tooltip_role_alert">
                  <span className="boss-tooltip__icon" />
                </span>
              </span>
            </p>
          </a>
        </div>
      );
    }
  };

  render() {
    const report = oFetch(this.props, 'report');
    const mStartDate = safeMoment.uiDateParse(oFetch(this.props, 'startDate'));
    const mEndDate = safeMoment.uiDateParse(oFetch(this.props, 'endDate'));
    const fullName = oFetch(report, 'staffMemberName');
    const weeklyHours = utils.round(oFetch(report, 'weeklyHours'), 2);
    const owedHours = utils.round(oFetch(report, 'owedHours'), 2);

    const acessories = utils.round(oFetch(report, 'acessories'), 2);
    const acessoriesColor = utils.colorizedAmount(acessories);
    const payRateDescription = oFetch(report, 'payRateDescription');
    const totalHoursCount = utils.round(oFetch(report, 'totalHoursCount') + owedHours, 2);
    const total = utils.round(oFetch(report, 'total'), 2);
    const isNegativeTotal = total < 0;
    const holidayDaysCount = oFetch(report, 'holidayDaysCount');
    const onMarkCompleted = oFetch(this.props, 'onMarkCompleted');
    const staffMemberId = oFetch(report, 'staffMemberId');
    const netWagesCents = oFetch(report, 'netWagesCents');
    const canSeeNetWages = oFetch(report, 'canSeeNetWages');
    const sageId = oFetch(report, 'staffMemberSageId');
    const allowNoSageId = oFetch(report, 'staffMemberAllowNoSageId');
    const containsTimeShiftedOwedHours = oFetch(report, 'containsTimeShiftedOwedHours');
    const containsTimeShiftedHolidays = oFetch(report, 'containsTimeShiftedHolidays');
    const pendingCalculation = oFetch(report, 'pendingCalculation');
    const staffMemberDisabled = oFetch(report, 'staffMemberDisabled');
    const hoursPending = oFetch(report, 'hoursPending');
    const completionDateReached = oFetch(report, 'completionDateReached');
    const status = oFetch(report, 'status');
    let effectiveStatus = status;
    if (effectiveStatus === 'ready' && !completionDateReached) {
      effectiveStatus = 'pending';
    } else if (effectiveStatus === 'ready' && hoursPending) {
      effectiveStatus = 'incomplete';
    }

    const isIncomplete = hoursPending || !completionDateReached;
    const isRequiringUpdate = effectiveStatus === 'requiring_update';
    const statusClassName = classNames({
      'boss-table__text': true,
      'boss-table__text_role_pending-status': effectiveStatus === 'ready' || isRequiringUpdate,
      'boss-table__text_role_alert-status': isIncomplete,
      'boss-table__text_role_success-status': status === 'done',
    });
    const fullNameCellClassName = classNames({
      'boss-table__cell': true,
      'boss-table__cell_indicator_user-disabled': staffMemberDisabled,
    });
    const fullNameCellTextClassName = classNames({
      'boss-table__text': true,
      'boss-table__text_indicator_accessory': acessories !== 0,
    });
    const rowClassName = classNames({
      'boss-table__row': true,
      'boss-table__row_state_alert': hoursPending,
      'boss-table__row_state_pre-calculated': pendingCalculation,
    });
    const owedHoursClassName = classNames({
      'boss-table__cell': true,
      'boss-table__cell_indicator_clock-warning': owedHours !== 0 && containsTimeShiftedOwedHours,
    });
    const holidayDaysCountClassName = classNames({
      'boss-table__cell': true,
      'boss-table__cell_indicator_clock-warning': holidayDaysCount !== 0 && containsTimeShiftedHolidays,
    });
    return (
      <div className={rowClassName}>
        <div className={fullNameCellClassName}>
          <p className={fullNameCellTextClassName}>
            <a
              href={appRoutes.staffMember(staffMemberId)}
              className="boss-table__link"
              style={{ textTransform: 'capitalize' }}
            >
              {fullName}
            </a>
          </p>
        </div>
        {this.renderSageId({ sageId, allowNoSageId, staffMemberId })}
        {this.renderWeekDaysCells()}
        <div className={this.getCellClassName({ alertStyles: false })} style={cellStyle}>
          <p className={this.getTextClassName({ alertStyles: false })}>{weeklyHours}</p>
        </div>
        {owedHours === 0 ? (
          <div className={owedHoursClassName} style={cellStyle}>
            <p className={this.getTextClassName({ alertStyles: false })}>{owedHours}</p>
          </div>
        ) : (
          <div className={owedHoursClassName} style={cellStyle}>
            <a
              href={appRoutes.staffMemberOwedHours({
                staffMemberId: staffMemberId,
                mPayslipStartDate: mStartDate,
                mPayslipEndDate: mEndDate,
              })}
              className={`${this.getTextClassName({ alertStyles: false })} boss-table__link`}
            >
              {owedHours}
            </a>
          </div>
        )}

        <div className={this.getCellClassName({ alertStyles: false })} style={cellStyle}>
          {acessories === 0 ? (
            <p className={this.getTextClassName({ alertStyles: false })}>{utils.moneyFormat(acessories)}</p>
          ) : (
            <a
              href={appRoutes.staffMemberAccessories({ staffMemberId })}
              className={this.getTextClassName({ alertStyles: false })}
              style={{ color: acessoriesColor }}
            >
              {utils.moneyFormat(acessories)}
            </a>
          )}
        </div>
        <div className={this.getCellClassName({ alertStyles: false })} style={cellStyle}>
          <p className={this.getTextClassName({ alertStyles: false })}>{payRateDescription}</p>
        </div>
        <div className={this.getCellClassName({ alertStyles: false })} style={cellStyle}>
          <p className={`${this.getTextClassName({ alertStyles: false })} boss-table__text_role_important`}>
            {totalHoursCount}
          </p>
        </div>
        <div className={this.getCellClassName({ alertStyles: false })} style={cellStyle}>
          <p className={this.getTextClassName({ alertStyles: false })} style={total < 0 ? { color: 'red' } : {}}>
            {utils.moneyFormat(total)}
          </p>
        </div>
        {holidayDaysCount === 0 ? (
          <div className={holidayDaysCountClassName} style={cellStyle}>
            <p className={this.getTextClassName({ alertStyles: false })}>{holidayDaysCount}</p>
          </div>
        ) : (
          <div className={holidayDaysCountClassName} style={cellStyle}>
            <a
              href={appRoutes.staffMemberProfileHolidaysTabFromFinanceReport({
                staffMemberId: staffMemberId,
                mPayslipStartDate: mStartDate,
                mPayslipEndDate: mEndDate,
              })}
              className={`${this.getTextClassName({ alertStyles: false })} boss-table__link`}
            >
              {holidayDaysCount}
            </a>
          </div>
        )}
        <div className="boss-table__cell">
          <p className="boss-table__text">
            {netWagesCents && <span>{canSeeNetWages ? utils.moneyFormat(netWagesCents / 100.0) : 'XXXX'}</span>}
          </p>
        </div>
        <div className="boss-table__cell">
          <p className={statusClassName}>{humanize(effectiveStatus)}</p>
          {effectiveStatus === 'ready' && (
            <div className="boss-table__actions">
              <button
                onClick={() => onMarkCompleted({ staffMemberId, isNegativeTotal })}
                className="boss-button boss-button_type_extra-small boss-button_role_confirm-light boss-table__action"
              >
                Mark Completed
              </button>
            </div>
          )}
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
    total: PropTypes.number.isRequired,
    holidayDaysCount: PropTypes.number.isRequired,

    staffMemberName: PropTypes.string.isRequired,
    acessories: PropTypes.number.isRequired,
    payRateDescription: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
  }).isRequired,
  weekDates: PropTypes.array.isRequired,
  onMarkCompleted: PropTypes.func.isRequired,
};

export default ReportItem;

export const PureJSReportItem = pureToJs(ReportItem);
