import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import StaffMemberInfo from './staff-member-info';
import AddShift from './add-shift';
import AddMultipleSubmitButton from './add-multiple-submit-button';
import safeMoment from '~/lib/safe-moment';
import iScroll from 'boss-iscroll';
import ReactIScroll from 'react-iscroll';

const scrollOptions = {
  scrollbars: true,
  mouseWheel: true,
  interactiveScrollbars: true,
  shrinkScrollbars: 'scale',
  fadeScrollbars: false,
  click: true,
  enable_ofscroll: true,
};

class HolidayItem extends React.Component {
  holidayDate = date => {
    return safeMoment.uiDateParse(date).format('DDMMM');
  };

  render() {
    const holiday = this.props.item;
    const startDate = holiday.get('start_date');
    const endDate = holiday.get('end_date');
    const date =
      startDate === endDate
        ? `${this.holidayDate(startDate)}`
        : `${this.holidayDate(startDate)} - ${this.holidayDate(endDate)}`;

    return <p className="boss-summary__text">{date}</p>;
  }
}

class RotaShiftItem extends React.Component {
  holidayDate = (startsAt, endsAt) => {
    return `${safeMoment.iso8601Parse(startsAt).format('DD MMM HH:mm')} to ${safeMoment
      .iso8601Parse(endsAt)
      .format('HH:mm')}`;
  };

  render() {
    const rotaShift = this.props.item;
    const startsAt = rotaShift.get('startsAt');
    const endsAt = rotaShift.get('endsAt');
    const venueName = rotaShift.get('venueName');
    return (
      <div>
        <p className="boss-summary__text">{this.holidayDate(startsAt, endsAt)}</p>
        <p className="boss-summary__text boss-summary__text_faded">{`(${venueName})`}</p>
      </div>
    );
  }
}

class Summary extends React.Component {
  static defaultProps = {
    className: '',
    count: 0,
    suffix: '',
    text: '',
    items: [],
  };

  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
    };
  }

  toggleSummary = () => {
    this.setState(state => ({ isOpen: !state.isOpen }));
  };

  renderItems = items => {
    return (
      <ul className="boss-summary__list">
        {items.map((item, key) => {
          return (
            <li key={key} className="boss-summary__item">
              {React.cloneElement(this.props.children, { item: item })}
            </li>
          );
        })}
      </ul>
    );
  };

  render() {
    const { className, count, suffix, text, items } = this.props;

    const isOpenClass = this.state.isOpen ? 'boss-summary__action_state_opened' : '';
    const isContentClosedClass = this.state.isOpen ? '' : 'boss-summary__content_state_closed';

    return (
      <div className={`boss-staff-summary__info-item ${className}`}>
        <div className="boss-summary">
          <div className="boss-summary__header">
            <p className="boss-summary__text">
              <span className="boss-summary__text-marked">
                {count}
                {suffix}
              </span>{' '}
              {text}
            </p>
          </div>
          <div style={{ height: '180px' }} className={`boss-summary__content ${isContentClosedClass}`}>
            <ReactIScroll iScroll={iScroll} options={scrollOptions}>
              <div className="boss-summary__content-inner">{this.renderItems(this.props.items)}</div>
            </ReactIScroll>
          </div>
          {count > 0 && (
            <button onClick={this.toggleSummary} className={`boss-summary__action ${isOpenClass}`}>
              Details
            </button>
          )}
        </div>
      </div>
    );
  }
}

class StaffMemberItem extends React.Component {
  state = {
    isOpen: false,
  };

  toggleDetails = () => {
    this.setState(state => ({ isOpen: !state.isOpen }));
  };

  render() {
    const staffMember = this.props.staffMember;
    const staffId = staffMember.get('id');
    const avatar = staffMember.get('avatarUrl');
    const fullName = `${staffMember.get('firstName')} ${staffMember.get('surname')}`;
    const staffType = this.props.staffTypes.find(staffType => staffType.get('id') === staffMember.get('staffTypeId'));
    const weeklyHours = staffMember.get('preferredHours');
    const dayPreferences = staffMember.get('preferredDays');
    const rotaedOnThisWeek = staffMember.get('hoursOnWeek');
    const weekRotaShifts = staffMember.get('weekRotaShifts');
    const holidays = staffMember.get('holidays');

    const isOpenClass = this.state.isOpen ? 'boss-staff-summary__cell_state_opened' : '';

    return (
      <div className="boss-staff-summary__row">
        <div className="boss-staff-summary__cell boss-staff-summary__cell_role_name">
          <button onClick={this.toggleDetails} className="boss-staff-summary__toggle">
            Details
          </button>
          <StaffMemberInfo
            avatarUrl={avatar}
            fullName={fullName}
            staffType={staffType.get('name')}
            staffColor={staffType.get('color')}
          />
        </div>
        <div className={`boss-staff-summary__cell boss-staff-summary__cell_role_info ${isOpenClass}`}>
          <div className="boss-staff-summary__info">
            <Summary
              count={rotaedOnThisWeek}
              suffix={'h'}
              text="rotaed this week"
              className="boss-staff-summary__info-item_role_shifts"
              items={weekRotaShifts}
            >
              <RotaShiftItem />
            </Summary>
            <Summary
              count={staffMember.get('holidaysOnWeek')}
              text="holiday days this week"
              className="boss-staff-summary__info-item_role_holidays"
              items={holidays}
            >
              <HolidayItem />
            </Summary>
            <div className="boss-staff-summary__info-item boss-staff-summary__info-item_role_preferences">
              <p className="boss-staff-summary__label boss-staff-summary__label_adjust_rd">Preferences</p>
              <div className="boss-summary">
                <ul className="boss-summary__list">
                  <li className="boss-summary__item boss-summary__item_layout_row boss-summary__item_role_header">
                    <p className="boss-summary__text boss-summary__text_context_row">Weekly Hours:</p>
                    <p className="boss-summary__text boss-summary__text_marked">{weeklyHours}</p>
                  </li>
                  <li className="boss-summary__item boss-summary__item_layout_row">
                    <p className="boss-summary__text boss-summary__text_context_row">Day Preferences:</p>
                    <p className="boss-summary__text boss-summary__text_marked">{dayPreferences}</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="boss-staff-summary__cell boss-staff-summary__cell_role_action">
          {this.props.isMultipleShift ? (
            <AddMultipleSubmitButton staffMemberId={staffId} />
          ) : (
            <button
              onClick={() => this.props.onAddShiftClick(staffId)}
              className="boss-button boss-button_type_small boss-button_role_add-secondary"
            >
              Add Shift
            </button>
          )}
          {this.props.currentStaffId === staffId && (
            <div
              ref={this.props.setRef}
              className="boss-popover boss-popover_context_rotas-daily boss-popover_state_opened"
            >
              <div className="boss-popover__inner">
                <AddShift
                  rotaDate={this.props.rotaDate}
                  staffMember={staffMember}
                  rotas={this.props.rotas}
                  handleAfterAdd={this.props.handleAfterAdd}
                  venues={this.props.venues}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

StaffMemberItem.propTypes = {
  staffMember: ImmutablePropTypes.map.isRequired,
  staffTypes: ImmutablePropTypes.list.isRequired,
  rotaDate: PropTypes.string.isRequired,
  onAddShiftClick: PropTypes.func.isRequired,
  currentStaffId: PropTypes.number,
  setRef: PropTypes.func.isRequired,
  handleAfterAdd: PropTypes.func.isRequired,
  isMultipleShift: PropTypes.bool.isRequired,
  venues: ImmutablePropTypes.list.isRequired,
  rotas: ImmutablePropTypes.list.isRequired,
};

export default StaffMemberItem;
