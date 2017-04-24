import * as React from 'react';

const StaffMembersReviewCard = (props: any) => {
  return (
    <div className="boss-vetting__person">
      <div className="boss-user-summary boss-user-summary_role_review">
        <div className="boss-user-summary__side">
          <div className="boss-user-summary__avatar">
            <div className="boss-user-summary__avatar-inner">
              <img src="./images/jd.jpg" alt="Trulla Collier" className="boss-user-summary__pic" />
            </div>
            <a href="javascript:;" className="boss-user-summary__avatar-icon boss-user-summary__avatar-icon_role_info">
              Profile
            </a>
          </div>
          <div className="boss-user-summary__controls">
            <a onClick={() => props.onCardAction(props.staffMember)} href="javascript:;" className="boss-button boss-button_role_cancel boss-button_type_small boss-user-summary__action">
              Dismiss
            </a>
          </div>
        </div>
        <div className="boss-user-summary__content">
          <div className="boss-user-summary__header">
            <h2 className="boss-user-summary__name">{props.staffMember.name}</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

const StaffMembersReviewList = (props: any) => {
  const staffMembers =
    props.staffMemberList.map((item: any) => <StaffMembersReviewCard
      onCardAction={props.onCardAction}
      staffMember={item}/>
    );

  return (
    <div className="boss-vetting__review">
      {staffMembers}
    </div>
  );
};


export default StaffMembersReviewList;
