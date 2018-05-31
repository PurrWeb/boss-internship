import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import oFetch from 'o-fetch';
import classNames from 'classnames';
import utils from '~/lib/utils';
import { appRoutes } from '~/lib/routes';
import { Tooltip } from 'react-tippy';

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
    const status = oFetch(report, 'status');
    const isIncomplete = status === 'incomplete';

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

      const tooltipContent =
        'lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum ';

      if (dayHoursCount === 0) {
        return (
          <div key={index} className={this.getCellClassName(tooltipContent)} style={cellStyle}>
            <p className={this.getTextClassName(tooltipContent)}>-</p>
            {tooltipContent && isIncomplete && this.renderTooltip(tooltipContent)}
          </div>
        );
      } else {
        return (
          <div key={index} className={this.getCellClassName(tooltipContent)} style={cellStyle}>
            <p className={this.getTextClassName(tooltipContent)}>
              <a href={appRoutes.staffMemberHoursOverview(staffMemberId, weekDate)} className={`${this.getTextClassName(tooltipContent)} boss-table__link`}>
                {dayHoursCount}
              </a>
            </p>
            {tooltipContent && isIncomplete && this.renderTooltip(tooltipContent)}
          </div>
        );
      }
    });
  }

  getCellClassName(tooltipContent = null) {
    const report = oFetch(this.props, 'report');
    const status = oFetch(report, 'status');
    const isIncomplete = status === 'incomplete';
    return classNames({
      'boss-table__cell': true,
      'boss-table__cell_state_alert': !!tooltipContent && isIncomplete,
    });
  }

  getTextClassName(tooltipContent = null) {
    const report = oFetch(this.props, 'report');
    const status = oFetch(report, 'status');
    const isIncomplete = status === 'incomplete';
    return classNames({
      'boss-boss-table__text': true,
      'boss-table__text_state_alert': !!tooltipContent && isIncomplete,
    });
  }

  renderTooltip(content) {
    return (
      <Tooltip
        arrow
        theme="light"
        position="right"
        html={<span>{content}</span>}
        style={{ marginLeft: 5, marginBottom: 7 }}
      >
        <span className="boss-table__tooltip">
          <span className="boss-tooltip boss-tooltip_role_alert">
            <span className="boss-tooltip__icon" />
          </span>
        </span>
      </Tooltip>
    );
  }

  render() {
    const report = oFetch(this.props, 'report');
    const fullName = oFetch(report, 'staffMemberName');
    const weeklyHours = utils.round(oFetch(report, 'weeklyHours'), 2);
    const owedHours = utils.round(oFetch(report, 'owedHours'), 2);

    const status = oFetch(report, 'status');
    const acessories = utils.round(oFetch(report, 'acessories'), 2);
    const acessoriesColor = utils.colorizedAmount(acessories);
    const payRateDescription = oFetch(report, 'payRateDescription');
    const totalHoursCount = utils.round(oFetch(report, 'totalHoursCount') + owedHours, 2);
    const total = utils.round(oFetch(report, 'total'), 2);
    const holidayDaysCount = oFetch(report, 'holidayDaysCount');
    const onMarkCompleted = oFetch(this.props, 'onMarkCompleted');
    const staffMemberId = oFetch(report, 'staffMemberId');
    const netWagesCents = oFetch(report, 'netWagesCents');
    const canSeeNetWages = oFetch(report, 'canSeeNetWages');
    const sageId = oFetch(report, 'staffMemberSageId');

    const isIncomplete = status === 'incomplete';

    const statusClassName = classNames({
      'boss-table__text': true,
      'boss-table__text_role_pending-status': status === 'ready',
      'boss-table__text_role_alert-status': isIncomplete,
      'boss-table__text_role_success-status': status === 'done',
    });
    const fullNameCellClassName = classNames({
      'boss-table__text': true,
      'boss-table__text_indicator_accessory': acessories !== 0,
    });

    return (
      <div className={rowClassName}>
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
        { sageId && <div className="boss-table__cell">
          <div className="boss-table__text">
            {sageId}
          </div>
        </div> }
        { !sageId && <div className="boss-table__cell boss-table__cell_state_alert">
            <a href={appRoutes.staffMember(staffMemberId)} >
              <p className="boss-table__text boss-table__text_state_alert">
                <span className="boss-table__tooltip">
                  <span className="boss-tooltip boss-tooltip_role_alert">
                    <span className="boss-tooltip__icon"></span>
                  </span>
                </span>
              </p>
            </a>
          </div> }
        {this.renderWeekDaysCells()}
        <div className={this.getCellClassName(tooltipContent)} style={cellStyle}>
          <p className={this.getTextClassName(tooltipContent)}>{weeklyHours}</p>
          {tooltipContent && isIncomplete && this.renderTooltip(tooltipContent)}
        </div>
        {owedHours === 0 ? (
          <div className={this.getCellClassName(tooltipContent2)} style={cellStyle}>
            <p className={this.getTextClassName(tooltipContent2)}>{owedHours}</p>
            {tooltipContent2 && isIncomplete && this.renderTooltip(tooltipContent2)}
          </div>
        ) : (
          <div className={this.getCellClassName(tooltipContent2)} style={cellStyle}>
            <a href={appRoutes.staffMemberOwedHours(staffMemberId)} className={`${this.getTextClassName(tooltipContent2)} boss-table__link`}>
              {owedHours}
            </a>
            {tooltipContent2 && isIncomplete && this.renderTooltip(tooltipContent2)}
          </div>
        )}

        <div className={this.getCellClassName(tooltipContent)} style={cellStyle}>
          {acessories === 0 ? (
            <p className={this.getTextClassName(tooltipContent)}>{utils.moneyFormat(acessories)}</p>
          ) : (
            <a
              href={appRoutes.staffMemberAccessories(staffMemberId)}
              className={this.getTextClassName(tooltipContent)}
              style={{ color: acessoriesColor }}
            >
              {utils.moneyFormat(acessories)}
            </a>
          )}
          {tooltipContent && isIncomplete && this.renderTooltip(tooltipContent)}
        </div>
        <div className={this.getCellClassName(tooltipContent)} style={cellStyle}>
          <p className={this.getTextClassName(tooltipContent)}>{payRateDescription}</p>
          {tooltipContent && isIncomplete && this.renderTooltip(tooltipContent)}
        </div>
        <div className={this.getCellClassName(tooltipContent)} style={cellStyle}>
          <p className={`${this.getTextClassName(tooltipContent)} boss-table__text_role_important`}>{totalHoursCount}</p>
          {tooltipContent && isIncomplete && this.renderTooltip(tooltipContent)}
        </div>
        <div className={this.getCellClassName(tooltipContent)} style={cellStyle}>
          <p className={this.getTextClassName(tooltipContent)}>{utils.moneyFormat(total)}</p>
          {tooltipContent && isIncomplete && this.renderTooltip(tooltipContent)}
        </div>
        {holidayDaysCount === 0 ? (
          <div className={this.getCellClassName(tooltipContent)} style={cellStyle}>
            <p className={this.getTextClassName(tooltipContent)}>{holidayDaysCount}</p>
            {tooltipContent && isIncomplete && this.renderTooltip(tooltipContent)}
          </div>
        ) : (
          <div className={this.getCellClassName(tooltipContent)} style={cellStyle}>
            <a
              href={appRoutes.staffMemberHolidays(staffMemberId)}
              className={`${this.getTextClassName(tooltipContent)} boss-table__link`}
            >
              {holidayDaysCount}
            </a>
            {tooltipContent && isIncomplete && this.renderTooltip(tooltipContent)}
          </div>
        )}
        <div className="boss-table__cell">
          <p className="boss-table__text">
            { netWagesCents && <span>{ canSeeNetWages ? utils.moneyFormat(netWagesCents / 100.0) : 'XXXX'  }</span> }
          </p>
        </div>
        <div className="boss-table__cell">
          <p className={statusClassName}>{status}</p>
          {status === 'ready' && (
            <div className="boss-table__actions">
              <button
                onClick={onMarkCompleted}
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
  weekDates: ImmutablePropTypes.list.isRequired,
  onMarkCompleted: PropTypes.func.isRequired,
};

export default ReportItem;
