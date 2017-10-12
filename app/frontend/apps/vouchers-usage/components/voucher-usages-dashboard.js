import React from 'react';

export default function VoucherUsagesDashboard({
  title,
  voucher,
}) {
  return (
    <div className="boss-page-main__dashboard">
      <div className="boss-page-main__inner">
        <div className="boss-page-dashboard boss-page-dashboard_updated">
          <div className="boss-page-dashboard__group">
            <h1 className="boss-page-dashboard__title">{title}</h1>
          </div>
          <div className="boss-page-dashboard__group">
            <div className="boss-page-dashboard__meta">
              <p className="boss-page-dashboard__meta-item boss-page-dashboard__meta-item_role_subtitle boss-page-dashboard__meta-item_role_voucher">
                <span className="boss-page-dashboard__meta-text">
                  {voucher.description}
                </span>
              </p>
              <p className="boss-page-dashboard__meta-item boss-page-dashboard__meta-item_role_subtitle boss-page-dashboard__meta-item_role_venue">
                <span className="boss-page-dashboard__meta-text">
                  {voucher.venue_name}
                </span>
              </p>
            </div>
            <div className="boss-page-dashboard__buttons-group boss-page-dashboard__buttons-group_position_last">
              <a href="/vouchers" className="boss-button boss-page-dashboard__button">
                Back to Index
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
};
