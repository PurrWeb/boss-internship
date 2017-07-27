import React from 'react';

export default (props) => {

  let {
    staffMember,
    rotaedHours,
    clockedHours,
    acceptedHours,
    rotaedAcceptedHoursDifference,
    staffTypeObject,
  } = props;

  let getDifferenceMessage = function(rotaedAcceptedHoursDifference){

    let resultFragments = ["("];

    if (rotaedAcceptedHoursDifference == 0) {
      resultFragments.push(rotaedAcceptedHoursDifference + "h");
    } else if(rotaedAcceptedHoursDifference > 0) {
      resultFragments.push("+" + rotaedAcceptedHoursDifference + "h");
    } else {
      resultFragments.push("" + rotaedAcceptedHoursDifference + "h");
    }
    resultFragments.push(")");

    return resultFragments.join('');
  };

  let differenceMessage = getDifferenceMessage(rotaedAcceptedHoursDifference);

  return <div className="boss-hrc__user-info">
    <div className="boss-user-badge">
      <div className="boss-user-badge__avatar">
        <div className="boss-user-badge__avatar-inner">
          <img src={staffMember.avatar_url} className="boss-user-badge__avatar-inner" />
        </div>
        <span className="boss-user-badge__avatar-icon boss-user-badge__avatar-icon_status_offline">Status</span>
      </div>
      <div className="boss-user-badge__info">
        <h2 className="boss-user-badge__name"> {staffMember.first_name} {staffMember.surname}</h2>
        <span className="boss-button boss-button_type_small boss-button_role_supervisor boss-user-badge__label"> {staffTypeObject.name} </span>
      </div>
    </div>
    <ul className="boss-user-badge__meta">
      <li className="boss-user-badge__meta-item">
        <p className="boss-user-badge__time boss-user-badge__time_role_rotaed">
          <span className="boss-user-badge__time-value">{rotaedHours}</span>
          <span className="boss-user-badge__time-units">h</span>
        </p>
        <p className="boss-user-badge__time-label"> Rotaed </p>
      </li>
      <li className="boss-user-badge__meta-item">
        <p className="boss-user-badge__time boss-user-badge__time_role_clocked">
          <span className="boss-user-badge__time-value">{clockedHours}</span>
          <span className="boss-user-badge__time-units">h</span>
        </p>
        <p className="boss-user-badge__time-label"> Clocked </p>
      </li>
      <li className="boss-user-badge__meta-item">
        <p className="boss-user-badge__time boss-user-badge__time_role_accepted">
          <span className="boss-user-badge__time-value">{acceptedHours}</span>
          <span className="boss-user-badge__time-units">h </span>
          <span className="boss-user-badge__time-note">
            {differenceMessage}
          </span>
        </p>
        <p className="boss-user-badge__time-label"> Accepted </p>
      </li>
    </ul>
  </div>
};