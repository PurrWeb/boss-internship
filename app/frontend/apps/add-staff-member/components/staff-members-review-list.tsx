import * as React from 'react';

export const UNREVIEWED_STAFF_MEMBERS = 'UNREVIEWED_STAFF_MEMBERS';
export const REVIEWED_STAFF_MEMBERS = 'REVIEWED_STAFF_MEMBERS';

const CLASSES = {
  [UNREVIEWED_STAFF_MEMBERS]: {
    listMainClass: 'boss-vetting__review',
    listItemClass: 'boss-user-summary boss-user-summary_role_review',
    buttonClass: 'boss-button boss-button_role_cancel boss-button_type_small boss-user-summary__action',
    buttonText: 'Dismiss'
  },
  [REVIEWED_STAFF_MEMBERS]: {
    listMainClass: 'boss-vetting__dismiss',
    listItemClass: 'boss-user-summary boss-user-summary_role_review boss-user-summary_state_dismissed',
    buttonClass: 'boss-button boss-button_role_review boss-button_type_small boss-user-summary__action',
    buttonText: 'Rreview'
  }
};

const StaffMembersReviewCard = (props: any) => {
  const classes = CLASSES[props.listType];

  return (
    <div className="boss-vetting__person">
      <div className={classes.listItemClass}>
        <div className="boss-user-summary__side">
          <div className="boss-user-summary__avatar">
            <div className="boss-user-summary__avatar-inner">
              <img src={props.staffMember.avatar_url} alt="Trulla Collier" className="boss-user-summary__pic"/>
            </div>
            <a href="javascript:;" className="boss-user-summary__avatar-icon boss-user-summary__avatar-icon_role_info">
              Profile
            </a>
          </div>
          <div className="boss-user-summary__controls">
            <a onClick={() => props.onCardAction(props.staffMember.id)} href="javascript:;"
               className={classes.buttonClass}>
              {classes.buttonText}
            </a>
          </div>
        </div>
        <div className="boss-user-summary__content">
          <div className="boss-user-summary__header">
            <h2 className="boss-user-summary__name">{props.staffMember.first_name} {props.staffMember.surname}</h2>
          </div>
          <ul className="boss-user-summary__review-list">
            <li className="boss-user-summary__review-item">
              <span className="boss-user-summary__review-label">Email address: </span>
              <span className="boss-user-summary__review-val">{props.staffMember.email_address}</span>
            </li>
            <li className="boss-user-summary__review-item">
              <span className="boss-user-summary__review-label">Staff Type: </span>
              <span className="boss-user-summary__review-val">{props.staffMember.staff_type}</span>
            </li>
            <li className="boss-user-summary__review-item">
              <span className="boss-user-summary__review-label">Disabled By: </span>
              <span className="boss-user-summary__review-val">{props.staffMember.disabled_by_user}
                on {props.staffMember.disabled_at}</span>
            </li>
            <li className="boss-user-summary__review-item">
              <span className="boss-user-summary__review-label">Reason for disabling: </span>
              <span className="boss-user-summary__review-val">{props.staffMember.disable_reason}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

const StaffMembersReviewList = (props: any) => {
  const staffMembers =
    props.staffMemberList.map((item: any) =>
          <StaffMembersReviewCard
            key={item.id}
            onCardAction={props.onCardAction}
            listType={props.listType}
            staffMember={item}/>
    );

  const classes = CLASSES[props.listType];

  return (
    <div className={classes.listMainClass}>
      {staffMembers}
    </div>
  );
};


export default StaffMembersReviewList;
