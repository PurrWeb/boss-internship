import React from 'react';
import PropTypes from 'prop-types';
import bouncedEmailModal from '~/components/bounced-email-modal';
import moment from 'moment';
import momentDurationFormatSetup from 'moment-duration-format';
import { appRoutes } from '~/lib/routes';

momentDurationFormatSetup(moment);

function InfoWrapper({ profileLink, id, children, handleInfoClick }) {
  if (profileLink) {
    return (
      <a
        onClick={handleInfoClick}
        href={`/staff_members/${id}`}
        className={`boss-user-summary boss-user-summary_role_review-short boss-user-summary_role_link`}
      >
        {children}
      </a>
    );
  }
  return <div className={`boss-user-summary boss-user-summary_role_review-short`}>{children}</div>;
}

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
  acceptedBreaks,
  profileLink,
  startDate,
  endDate,
}) {
  const handleInfoClick = e => {
    if (bouncedEmailData) {
      e.preventDefault();
      bouncedEmailModal(bouncedEmailData);
    }
  };
  return (
    <div className="boss-users__flow-item">
      <InfoWrapper handleInfoClick={handleInfoClick} id={id} profileLink={profileLink}>
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
              <li className="boss-user-summary__review-item">
                <span className="boss-user-summary__review-label">Accepted: </span>
                <a
                  className="boss-user-summary__review-val"
                  target="_blank"
                  href={appRoutes.staffMemberProfileShifts({ startDate, endDate, staffMemberId: id })}
                >
                  {hours === 0
                    ? `0h`
                    : moment.duration(hours, 'minutes').format('*h[h] m[m]', { trim: 'both', useGrouping: false })}
                </a>
              </li>
              <li className="boss-user-summary__review-item">
                <span className="boss-user-summary__review-label">Breaks: </span>
                <a
                  className="boss-user-summary__review-val"
                  target="_blank"
                  href={appRoutes.staffMemberProfileShifts({ startDate, endDate, staffMemberId: id })}
                >
                  {acceptedBreaks === 0
                    ? `0h`
                    : moment
                        .duration(acceptedBreaks, 'minutes')
                        .format('*h[h] m[m]', { trim: 'both', useGrouping: false })}
                </a>
              </li>
              <li className="boss-user-summary__review-item">
                <span className="boss-user-summary__review-label">Paid holidays: </span>
                <a
                  className="boss-user-summary__review-val"
                  target="_blank"
                  href={appRoutes.staffMemberProfileHolidays({ startDate, endDate, staffMemberId: id })}
                >
                  {paidHolidays === 0
                    ? `0h`
                    : moment
                        .duration(paidHolidays, 'minutes')
                        .format('*h[h] m[m]', { trim: 'both', useGrouping: false })}
                </a>
              </li>
            </ul>
          )}
        </div>
      </InfoWrapper>
    </div>
  );
}

StaffMemberInfo.defaultProps = {
  profileLink: true,
};

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
  profileLink: PropTypes.bool,
};

export default StaffMemberInfo;
