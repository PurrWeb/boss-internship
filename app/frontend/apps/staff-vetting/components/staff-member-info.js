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

function renderWeekHours(hours) {
  return (
    <div>
      <b className="boss-user-summary__marked boss-user-summary__marked_role_alert">{`(${moment.duration(hours, 'minutes').format('*h[h] m[m]', { trim: 'both', useGrouping: false })})`}</b>
    </div>
  );
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
  acceptedHours,
  hours,
  masterVenue,
  paidHolidays,
  acceptedBreaks,
  profileLink,
  startDate,
  endDate,
  owedHours,
}) {
  const handleBouncedEmailInfoClick = e => {
    e.preventDefault();
    bouncedEmailModal(bouncedEmailData);
  };
  const nullHandleInfoClick = e => {
    //Do nothing
  };
  return (
    <div className="boss-users__flow-item">
      <InfoWrapper handleInfoClick={nullHandleInfoClick} id={id} profileLink={profileLink}>
        <div className="boss-user-summary__side">
          <div className="boss-user-summary__avatar">
            <div className="boss-user-summary__avatar-inner">
              <img src={avatarUrl} alt="" className="boss-user-summary__pic" />
            </div>
          </div>
        </div>
        <div className="boss-user-summary__content">
          <div className="boss-user-summary__header">
            <h2 className="boss-user-summary__name">
              {fullName}
              {hours !== undefined && renderWeekHours(hours)}
            </h2>
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
              <li className="boss-user-summary__review-item" onClick={handleBouncedEmailInfoClick}>
                <span className="boss-user-summary__review-wrap">{bouncedEmailData.email}</span>
              </li>
            </ul>
          ) : null}
          {masterVenue && (
            <ul className="boss-user-summary__review-list">
              <li className="boss-user-summary__review-item">
                <span className="boss-user-summary__review-label">Master Venue: </span>
                <span className="boss-user-summary__review-val boss-user-summary__review-val_marked">
                  {masterVenue}
                </span>
              </li>
              {acceptedHours !== undefined && (
                <li className="boss-user-summary__review-item">
                  <span className="boss-user-summary__review-label">Accepted: </span>
                  <a
                    className="boss-user-summary__review-val"
                    target="_blank"
                    href={appRoutes.staffMemberProfileShifts({ startDate, endDate, staffMemberId: id })}
                  >
                    {acceptedHours === 0
                      ? `0h`
                      : moment
                          .duration(acceptedHours, 'minutes')
                          .format('*h[h] m[m]', { trim: 'both', useGrouping: false })}
                  </a>
                </li>
              )}
              {acceptedBreaks !== undefined && (
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
              )}
              {paidHolidays !== undefined && (
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
              )}
              {owedHours !== undefined && (
                <li className="boss-user-summary__review-item">
                  <span className="boss-user-summary__review-label">Owed hours: </span>
                  <a
                    className="boss-user-summary__review-val"
                    target="_blank"
                    href={appRoutes.staffMemberProfileHolidays({ startDate, endDate, staffMemberId: id })}
                  >
                    {owedHours === 0
                      ? `0h`
                      : moment
                          .duration(owedHours, 'minutes')
                          .format('*h[h] m[m]', { trim: 'both', useGrouping: false })}
                  </a>
                </li>
              )}
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
