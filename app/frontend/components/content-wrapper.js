import React from 'react';

const ContentWrapper = ({children}) => {

  return (
    <div className="boss-page-main__content">
      <div className="boss-page-main__inner">
        {children}
      </div>
    </div>
  )
}

export default ContentWrapper;
