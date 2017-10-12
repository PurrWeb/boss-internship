import React from 'react';

export default function RedeemBadge({
  children,
  figureSrc = "",
  caption = ""
}) {
  return (
    <div className="boss-form-badge boss-form-badge_adjust_rv">
      <div className="boss-form-badge__figure">
        <img src={figureSrc} alt="" className="boss-form-badge__image"/>
        <h3 className="boss-form-badge__caption">{caption}</h3>
      </div>
      <div className="boss-form-badge__fields">
        <div className="boss-form-badge__field">
          <div className="boss-form-badge__select">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
};
