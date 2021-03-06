import React from 'react';

const HolidaysHeader = ({title, onAddNew, isStaffMemberDisabled, buttonText = ''}) => {

  return (
    <header className="boss-board__header">
      <h2 className="boss-board__title">
        {title}
      </h2>
      <div className="boss-board__button-group">
        { !isStaffMemberDisabled && <button
            onClick={onAddNew}
            className="boss-button boss-button_role_add"
          >{buttonText}</button>
        }
      </div>
    </header>
  )
}

export default HolidaysHeader;
