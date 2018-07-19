import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Popover from 'react-popover';
import safeMoment from '~/lib/safe-moment';
import WeekPicker from '~/components/week-picker';
import utils from '~/lib/utils';

class DashboardFilter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isCalendarOpen: false,
    };
  }

  togglePopover = () => {
    this.setState({ isCalendarOpen: !this.state.isCalendarOpen });
  };

  render() {
    const startDate = safeMoment.uiDateParse(this.props.startDate).format(utils.commonDateFormatCalendar());
    const endDate = safeMoment.uiDateParse(this.props.endDate).format(utils.commonDateFormatCalendar());

    const popoverClass = classNames({
      'boss-page-dashboard__meta-item boss-page-dashboard__meta-item_type_faded boss-page-dashboard__meta-item_role_date boss-page-dashboard__meta-item_role_popover': true,
      'boss-page-dashboard__meta-item_state_opened': this.state.isCalendarOpen,
    });
    return (
      <div className="boss-page-dashboard__group">
        <div className="boss-page-dashboard__meta">
          <Popover
            isOpen={this.state.isCalendarOpen}
            body={this.renderCalendar()}
            place="below"
            tipSize={0.01}
            onOuterAction={this.togglePopover}
            className="boss-popover boss-popover_context_dashboard-calendar"
            style={{ marginTop: '10px' }}
          >
            <p className={popoverClass} onClick={this.togglePopover}>
              <span className="boss-page-dashboard__meta-text">{startDate}</span>
              {' - '}
              <span className="boss-page-dashboard__meta-text">{endDate}</span>
            </p>
          </Popover>
        </div>
        {this.props.children}
      </div>
    );
  }
  renderCalendar() {
    return (
      <div className="boss-popover__inner">
        <WeekPicker
          selectionStartDate={safeMoment.uiDateParse(this.props.startDate).toDate()}
          onChange={selection => {
            this.props.onDateChange(selection);
            this.togglePopover();
          }}
        />
      </div>
    );
  }
}

DashboardFilter.propTypes = {
  className: PropTypes.string,
  startDate: PropTypes.string.isRequired,
  endDate: PropTypes.string.isRequired,
  onDateChange: PropTypes.func.isRequired,
};

DashboardFilter.defaultProps = {
  className: '',
};

export default DashboardFilter;
