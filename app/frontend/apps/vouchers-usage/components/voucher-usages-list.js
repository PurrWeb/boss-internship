import React from 'react';
import VoucherUsagesTable from './voucher-usages-table';
import VoucherUsagesMobileItem from './voucher-usages-mobile-item';

export default function VoucherUsagesList({items}) {

  const renderMobileItems = (items) => {
    return items.map((item, key) => {
      return <VoucherUsagesMobileItem key={key} item={item} />
    });
  }

  return (
    <div className="boss-page-main__group boss-page-main__group_adjust_vouchers-index-table">
      <div className="boss-table boss-table_page_vouchers-index">
        <VoucherUsagesTable items={items} />
      </div>
      {renderMobileItems(items)}
    </div>
  )
};
