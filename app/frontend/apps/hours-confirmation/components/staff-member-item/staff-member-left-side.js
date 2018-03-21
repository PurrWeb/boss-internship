import React, { Component } from 'react';
import oFetch from 'o-fetch';
import { STATUSES, STATUS_CLASSES } from './index';
import { formattedTime } from '../../selectors';

class StaffMemberLeftSide extends Component {
  render() {
    const {
      status,
      fullName,
      avatarUrl,
      staffTypeName,
      staffTypeColor,
      clockedStats,
      clockedBreaksStats,
      rotaedStats,
      hoursAcceptanceStats,
      hoursAcceptanceBreaksStats,
      timeDiff,
    } = this.props;

    const formattedRotaedStats = formattedTime(rotaedStats);
    const formattedClockedStats = formattedTime(clockedStats - clockedBreaksStats);
    const formattedHoursAcceptanceStats = formattedTime(hoursAcceptanceStats - hoursAcceptanceBreaksStats);

    const showAcceptanceDifference = hoursAcceptanceStats !== 0;

    return (
      <div className="boss-hrc__side">
        <div className="boss-hrc__user-info">
          <div className="boss-user-badge">
            <div className="boss-user-badge__avatar">
              <div className="boss-user-badge__avatar-inner">
                <img
                  src={avatarUrl}
                  alt={fullName}
                  className="boss-user-badge__pic"
                />
              </div>
              <span
                className={`boss-user-badge__avatar-icon boss-user-badge__avatar-icon_status_${
                  STATUS_CLASSES[status]
                }`}
              />
            </div>
            <div className="boss-user-badge__info">
              <h2 className="boss-user-badge__name">{fullName}</h2>
              <span
                className="boss-button boss-button_type_small boss-user-badge__label"
                style={{ backgroundColor: `${staffTypeColor}` }}
              >
                {staffTypeName}
              </span>
            </div>
            <ul className="boss-user-badge__meta">
              <li className="boss-user-badge__meta-item">
                <p className="boss-user-badge__time boss-user-badge__time_role_rotaed">
                  <span className="boss-user-badge__time-value">
                    {formattedRotaedStats}
                  </span>
                </p>
                <p className="boss-user-badge__time-label">Rotaed</p>
              </li>
              <li className="boss-user-badge__meta-item">
                <p className="boss-user-badge__time boss-user-badge__time_role_clocked">
                  <span className="boss-user-badge__time-value">
                    {formattedClockedStats}
                  </span>
                </p>
                <p className="boss-user-badge__time-label">Clocked</p>
              </li>
              <li className="boss-user-badge__meta-item">
                <p className="boss-user-badge__time boss-user-badge__time_role_accepted">
                  <span className="boss-user-badge__time-value">
                    {formattedHoursAcceptanceStats}
                  </span>
                  {showAcceptanceDifference &&
                    timeDiff.sign !== '' && (
                      <span
                        style={{ display: 'block' }}
                        className="boss-user-badge__time-note"
                      >
                        ({timeDiff.full})
                      </span>
                    )}
                </p>
                <p className="boss-user-badge__time-label">Accepted</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default StaffMemberLeftSide;
