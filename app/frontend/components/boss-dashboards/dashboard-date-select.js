import React from 'react';
import PropTypes from 'prop-types';

import DashboardActions from './dashboard-actions';
import safeMoment from '~/lib/safe-moment';
import BossDatePicker from '~/components/react-dates/boss-date-picker';


class DashboardDateSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: safeMoment.uiDateParse(props.date),
    };
  }

  parseChildrens = () => {
    React.Children.map(this.props.children, (child, i) => {
      if (child.type === DashboardActions) {
        this.actions = React.cloneElement(child);
      }
      return;
    });
  };

  onDateChange = date => {
    this.setState({ date: safeMoment.uiDateParse(date) }, () => {
      this.props.onDateChange(date);
    });
  };

  render() {
    this.parseChildrens();
    return (
      <div className="boss-page-main__dashboard">
        <div className="boss-page-main__inner">
          <div className="boss-page-dashboard boss-page-dashboard_updated">
            <div className="boss-page-dashboard__group">
              <div className="boss-page-dashboard__sub-group">
                <h1 className="boss-page-dashboard__title">
                  {this.props.title}
                </h1>
              </div>
              {this.actions}
            </div>

            <div className="boss-page-dashboard__group">
              <div className="boss-page-dashboard__controls-group">
                <div className="boss-form">
                  <div className="boss-form__row boss-form__row_justify_space boss-form__row_position_last">
                    <BossDatePicker 
                      id="date"
                      date={this.state.date}
                      onApply={this.onDateChange}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

DashboardDateSelect.propTypes = {
  title: PropTypes.string.isRequired,
  className: PropTypes.string,
  date: PropTypes.string,
  venueId: PropTypes.number,
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.element]),
};

DashboardDateSelect.defaultProps = {
  className: '',
};

export default DashboardDateSelect;
