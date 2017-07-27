import React from 'react';

const ModalWrapper = ({title, statusClass, children}) => {

  return (
    <div>
      <div className={`boss-modal-window__header ${statusClass}`}>
        {title}
      </div>
      <div className="boss-modal-window__content">
        {children}
      </div>
    </div>
  )
}

export default ModalWrapper;
