import React from 'react';

export default function Header({title = 'JSM Bars'}) {
  return (
    <div className="boss-page-header boss-page-header_adjust_security">
      <div className="boss-page-header__inner">
        <div className="boss-page-header__group boss-page-header__group_role_logo">
          <p className="boss-page-header__logo">{title}</p>
        </div>
      </div>
    </div>
  )
}
