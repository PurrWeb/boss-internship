import React from 'react';

const HolidaysHeader = ({title, onAddNew}) => {
  
  return (
    <header className="boss-board__header">
      <h2 className="boss-board__title">
        {title}
      </h2>
      <div className="boss-board__button-group">
        <button
          onClick={onAddNew}
          className="boss-button boss-button_role_add"
        >Add Holidays</button>
      </div>
    </header>
  )
}

export default HolidaysHeader;
