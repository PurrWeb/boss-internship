import React, { Component } from 'react';
import safeMoment from '~/lib/safe-moment';
import oFetch from 'o-fetch';
import { Collapse } from 'react-collapse';
import { getTimeDiff } from '../../selectors';

function TimeView({ label, date }) {
  const time = safeMoment.iso8601Parse(date).format('HH:mm');
  return (
    <div className="boss-time-shift__hours">
      <p className="boss-time-shift__label">
        <span className="boss-time-shift__label-text">{label}</span>
      </p>
      <div className="boss-time-shift__select">
        <p className="boss-time-shift__select-value">{time}</p>
      </div>
    </div>
  );
}

class AcceptedClockInPeriod extends Component {
  state = {
    isOpened: false,
  };

  renderAcceptedActions(period) {
    const acceptanceDiff = getTimeDiff([period]);
    const acceptedBy = oFetch(period, 'acceptedBy') || 'N/A';
    const acceptedAt = oFetch(period, 'acceptedAt');
    const acceptedAtFormatted = acceptedAt
      ? safeMoment.iso8601Parse(acceptedAt)
      : 'N/A';

    return (
      <div>
        <p className="boss-time-shift__status boss-time-shift__status_state_visible">
          <span className="boss-time-shift__status-count">
            {acceptanceDiff.fullTime} Accepted
          </span>
          <span className="boss-time-shift__status-meta">
            by {acceptedBy} at {acceptedAtFormatted}
          </span>
        </p>
        <button className="boss-button boss-button_role_cancel boss-time-shift__button boss-time-shift__button_role_unaccept-shift boss-time-shift__button_state_visible">
          Unaccept
        </button>
      </div>
    );
  }

  renderBreaks(period) {
    const breaks = oFetch(period, 'breaks');
    return breaks.map(periodBreak => {
      const startsAt = oFetch(periodBreak, 'startsAt');
      const endsAt = oFetch(periodBreak, 'endsAt');

      return (
        <div className="boss-time-shift__break-item">
          <div className="boss-time-shift__log boss-time-shift__log_layout_break">
            <div className="boss-time-shift__group">
              <div className="boss-time-shift__time">
                <div className="boss-time-shift__interval">
                  <TimeView label="Start" date={startsAt} />
                  <div className="boss-time-shift__delimiter" />
                  <TimeView label="End" date={endsAt} />
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    });
  }

  toggleBreaks = () => {
    this.setState(state => ({ isOpened: !state.isOpened }));
  };

  render() {
    const { period } = this.props;
    const startsAt = oFetch(period, 'startsAt');
    const endsAt = oFetch(period, 'endsAt');
    const reasonNote = oFetch(period, 'reasonNote');
    console.log(period);
    return (
      <div className="boss-time-shift__form">
        <div className="boss-time-shift__log boss-time-shift__log_state_accepted">
          <div className="boss-time-shift__group">
            <div className="boss-time-shift__time">
              <div className="boss-time-shift__interval">
                <TimeView label="Start" date={startsAt} />
                <div className="boss-time-shift__delimiter" />
                <TimeView label="End" date={endsAt} />
              </div>
            </div>
            <div className="boss-time-shift__message">
              <p className="boss-time-shift__label">
                <span className="boss-time-shift__label-text">Reason</span>
              </p>
              <p className="boss-time-shift__message-value">
                {reasonNote || 'N/A'}
              </p>
            </div>
          </div>
          {this.renderAcceptedActions(period)}
        </div>
        <div className="boss-time-shift__break boss-time-shift__log_state_accepted">
          <div className="boss-time-shift__break-controls">
            <button
              onClick={this.toggleBreaks}
              className="boss-time-shift__break-toggle boss-time-shift__break-toggle_state_visible boss-time-shift__break-toggle_state_opened"
            >
              Breaks
            </button>
          </div>
          {this.state.isOpened && (
            <div
              className="boss-time-shift__break-content boss-time-shift__break_state_opened"
              style={{ display: 'block' }}
            >
              <div className="boss-time-shift__break-inner">
                {this.renderBreaks(period)}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default AcceptedClockInPeriod;
