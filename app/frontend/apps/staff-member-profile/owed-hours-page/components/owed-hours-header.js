import React from 'react';
import oFetch from 'o-fetch';

const OwedHoursHeader = (props) => {
  const [
    title,
    onAddNew,
    isStaffMemberDisabled,
    canCreateOwedHours
  ] = oFetch(props, 'title', 'onAddNew', 'isStaffMemberDisabled', 'canCreateOwedHours');

  return (
    <header className="boss-board__header">
      <h2 className="boss-board__title">
        {title}
      </h2>
      <div className="boss-board__button-group">
        {(!isStaffMemberDisabled && canCreateOwedHours) && <button
          onClick={onAddNew}
          className="boss-button boss-button_role_add"
        >Add hours</button>
        }
      </div>
    </header>
  )
}

export default OwedHoursHeader;
