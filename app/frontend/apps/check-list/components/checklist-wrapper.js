import React from 'react';

const ChecklistWrapper = ({children}) => {

  return (
    <div className="boss-board__content boss-board__content_state_opened">
      <div className="boss-board__content-inner">
        <div className="boss-board__checklist">
          <div className="boss-board__form">
            <div className="boss-checklist__content">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChecklistWrapper;
