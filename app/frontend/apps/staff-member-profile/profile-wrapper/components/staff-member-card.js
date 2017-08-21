import React from 'react';
import moment from 'moment';

import editAvatarModal from '~/lib/content-modal';

const StaffMemberCard = ({staffMember, onUpdateAvatar, onEditAvatar, currentPage}) => {
  const avatar = staffMember.get('avatar');
  const fullName = `${staffMember.get('first_name')} ${staffMember.get('surname')}`;
  const email = staffMember.get('email');
  const phoneNumber = staffMember.get('phone_number');
  const jobType = staffMember.getIn(['staff_type', 'label']);
  const disabled = staffMember.get('disabled');
  const disabledByUser = staffMember.get('disabled_by_user');
  const disabledAt = staffMember.get('disabled_at');
  const disabledReason = staffMember.get('disable_reason');

  const renderPhoneNumber = (phoneNumber) => {
    return phoneNumber
      ? <a
          href={`tel:${phoneNumber}`}
          className="boss-user-summary__link boss-user-summary__link_role_phone"
        >{phoneNumber}</a>
      : null;
  }

  const renderEmail = (email) => {
    return email
      ? <a
          href={`mailto:${email}`}
          className="boss-user-summary__link boss-user-summary__link_role_email"
        >{email}</a>
      : null;
  }

  const renderFullName = (fullName, disabled = false) => {
    return disabled
      ? `${fullName} (Disabled)`
      : fullName
  }

  const renderCardContacts = (email, phoneNumber) => {
    return (
      <div className="boss-user-summary__contacts">
        { renderEmail(email) }
        { renderPhoneNumber(phoneNumber) }
      </div>   
    )
  }
  const isActive = (currentPage, page) => {
    return currentPage === page ? 'boss-button_state_active' : '';
  }

  const renderCardActions = () => {
    return (
      <div className="boss-user-summary__meta">
        <a
          href={`profile`}
          className={`${isActive(currentPage, "profile")} boss-button boss-button_type_small boss-button_role_profile boss-user-summary__switch`}
        >Profile</a>
        <a
          href={`holidays`}
          className={`${isActive(currentPage ,"holidays")} boss-button boss-button_type_small boss-button_role_holidays boss-user-summary__switch`}
        >Holidays</a>
        <a
          href={`owed_hours`}
          className={`${isActive(currentPage ,"owed_hours")} boss-button boss-button_type_small boss-button_role_timelog boss-user-summary__switch`}
        >Owed hours</a>
      </div> 
    )
  }

  const renderdisabledContent = ({disabledByUser, disabledAt, disabledReason}) => {
    const disabledAtFormatted = moment(disabledAt).format('Do MMMM YYYY');
    return (
      <ul className="boss-user-summary__review-list">
        <li className="boss-user-summary__review-item">
          <span className="boss-user-summary__review-label">Disabled by: </span>
          <span className="boss-user-summary__review-val">
            <span>{disabledByUser} on {disabledAtFormatted}</span>
          </span>
        </li>
        <li className="boss-user-summary__review-item">
          <span className="boss-user-summary__review-label">Reason for disabling: </span>
          <span className="boss-user-summary__review-val">{disabledReason}</span>
        </li>
        <li className="boss-user-summary__review-item">
          <span className="boss-button boss-button_type_small boss-button_type_no-behavior boss-button_role_exclamation boss-user-summary__label">
            Disabled
          </span>
        </li>
      </ul>
    )
  }

  return (
    <div className="boss-page-dashboard__user-summary">
      <div className="boss-user-summary">
        <div className="boss-user-summary__side">
          <div className="boss-user-summary__avatar">
            <div className="boss-user-summary__avatar-inner">
              <img src={avatar} alt="avatar"/>
              <button
                className="boss-user-summary__avatar-icon boss-user-summary__avatar-icon_role_edit"
                onClick={() => onEditAvatar()}
              >Edit</button>
            </div>
          </div>
        </div>
        <div className="boss-user-summary__content">
          <div className="boss-user-summary__header">
            <h2 className="boss-user-summary__name">
              { renderFullName(fullName, disabled) }
            </h2>
            <span className="boss-button boss-button_type_small boss-button_type_no-behavior boss-user-summary__label">
              {jobType}
            </span>
          </div>
          { disabled
            ? renderdisabledContent({disabledByUser, disabledAt, disabledReason})
            : [renderCardContacts(email, phoneNumber), renderCardActions()]
          }
        </div>
      </div>
    </div>
  )
}

export default StaffMemberCard;
