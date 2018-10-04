import React from 'react';
import PropTypes from 'prop-types';
import oFetch from 'o-fetch';
import AsyncButton from 'react-async-button';
import utils from '~/lib/utils';
import moment from 'moment';

class CalendarInfo extends React.PureComponent {
  render() {
    const [onCancel, onApply, date, startDate, endDate] = oFetch(
      this.props,
      'onCancel',
      'onApply',
      'date',
      'startDate',
      'endDate',
    );

    return (
      <div>
        <div className="DayPicker_preview">
          <p className="DayPicker_preview-text">
            {date && date.format(utils.commonDateFormat)}
            {startDate && startDate.format(utils.commonDateFormat)}
            {endDate && ` — ${endDate.format(utils.commonDateFormat)}`}
          </p>
        </div>
        <div className="DayPicker_actions">
          <button onClick={onCancel} type="button" className="DayPicker_action DayPicker_action_role_cancel">
            Cancel
          </button>
          <AsyncButton
            className="DayPicker_action DayPicker_action_role_apply"
            text="Apply"
            pendingText="Applying ..."
            onClick={onApply}
            disabled={!(date || (startDate && endDate))}
          />
        </div>
      </div>
    );
  }
}

CalendarInfo.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onApply: PropTypes.func.isRequired,
  date: PropTypes.instanceOf(moment),
  startDate: PropTypes.instanceOf(moment),
  endDate: PropTypes.instanceOf(moment),
};

CalendarInfo.defaultProps = {
  date: null,
  startDate: null,
  endDate: null,
};

export default CalendarInfo;
