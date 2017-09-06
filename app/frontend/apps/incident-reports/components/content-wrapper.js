import React from 'react';

function ContentWrapper({children}) {
  return (
    <div className="boss-page-main__content">
      <div className="boss-page-main__inner">
        {children}
      </div>
    </div>
  )
}

export default ContentWrapper;
