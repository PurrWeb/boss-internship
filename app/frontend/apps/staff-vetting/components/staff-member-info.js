import React from 'react';
import PropTypes from 'prop-types';
import bouncedEmailModal from '~/components/bounced-email-modal';
import moment from 'moment';
import momentDurationFormatSetup from 'moment-duration-format';

momentDurationFormatSetup(moment);

function StaffMemberInfo({
  id,
  avatarUrl,
  fullName,
  staffType,
  staffColor,
  age,
  expiredSiaBadge,
  bouncedEmailData,
  hours,
  masterVenue,
  paidHolidays,
}) {
  const handleInfoClick = e => {
    if (bouncedEmailData) {
      e.preventDefault();
      bouncedEmailModal(bouncedEmailData);
    }
  };
  return (
    <div className="boss-users__flow-item">
      <a
        onClick={handleInfoClick}
        href={`/staff_members/${id}`}
        className="boss-user-summary boss-user-summary_role_review-short boss-user-summary_role_link"
      >
        <div className="boss-user-summary__side">
          <div className="boss-user-summary__avatar">
            <div className="boss-user-summary__avatar-inner">
              <img src={avatarUrl} alt="" className="boss-user-summary__pic" />
            </div>
          </div>
        </div>
        <div className="boss-user-summary__content">
          <div className="boss-user-summary__header">
            <h2 className="boss-user-summary__name">{fullName}</h2>
            {!expiredSiaBadge && (
              <p
                className="boss-button boss-button_type_label boss-user-summary__label"
                style={{ backgroundColor: staffColor }}
              >
                {staffType}
              </p>
            )}
          </div>
          {age && (
            <ul className="boss-user-summary__review-list">
              <li className="boss-user-summary__review-item">
                <span className="boss-user-summary__review-label">Age: </span>
                <span className="boss-user-summary__review-val">{age}</span>
              </li>
            </ul>
          )}
          {expiredSiaBadge && (
            <ul className="boss-user-summary__review-list">
              <li className="boss-user-summary__review-item">
                <span className="boss-user-summary__review-label">Expiry Date: </span>
                <span className="boss-user-summary__review-val">{expiredSiaBadge}</span>
              </li>
            </ul>
          )}
          {bouncedEmailData ? (
            <ul className="boss-user-summary__review-list">
              <li className="boss-user-summary__review-item">
                <span className="boss-user-summary__review-wrap">{bouncedEmailData.email}</span>
              </li>
            </ul>
          ) : null}
          {masterVenue && (
            <ul className="boss-user-summary__review-list">
              <li className="boss-user-summary__review-item">
                <span className="boss-user-summary__review-label">Master Venue: </span>
                <span className="boss-user-summary__review-val">{masterVenue}</span>
              </li>
              {hours !== 0 && (
                <li className="boss-user-summary__review-item">
                  <span className="boss-user-summary__review-label">Accepted: </span>
                  <span className="boss-user-summary__review-val">
                    {moment.duration(hours, 'minutes').format('h[h] m[m]', { trim: 'all', useGrouping: false })}
                  </span>
                </li>
              )}
              {paidHolidays !== 0 && (
                <li className="boss-user-summary__review-item">
                  <span className="boss-user-summary__review-label">Paid holidays: </span>
                  <span className="boss-user-summary__review-val">
                    {moment.duration(paidHolidays, 'minutes').format('h[h] m[m]', { trim: 'all', useGrouping: false })}
                  </span>
                </li>
              )}
            </ul>
          )}
        </div>
      </a>
    </div>
  );
}

StaffMemberInfo.propTypes = {
  id: PropTypes.number.isRequired,
  avatarUrl: PropTypes.string.isRequired,
  fullName: PropTypes.string.isRequired,
  staffType: PropTypes.string.isRequired,
  staffColor: PropTypes.string.isRequired,
  age: PropTypes.number,
  expiredSiaBadge: PropTypes.string,
  bouncedEmailData: PropTypes.object,
  hours: PropTypes.number,
  masterVenue: PropTypes.string,
};

export default StaffMemberInfo;
