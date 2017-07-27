import React from 'react';
import PropTypes from 'prop-types';

const MainContent = ({inactive, children}) => {
  return (
    <div className="boss-page-main__content">
      <div className={`boss-page-main__inner ${inactive && "boss-page-main__content_state_inactive"}`}>
        {children}
      </div>
    </div>
  )
}

export default MainContent;
