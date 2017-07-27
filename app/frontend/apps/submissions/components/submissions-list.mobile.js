import React from 'react';
import PropTypes from 'prop-types';
import SubmissionsListItemMobile from './submissions-list-item.mobile';

export const SubmissionsListMobile = ({items, onDetailsClick}) => {
  
  const renderItems = (items) => {
    return items.map((item, key) => {
      return <SubmissionsListItemMobile onDetailsClick={onDetailsClick} key={key} item={item} />
    })
  }

  const renderEmptyList = () => {
    return (
      <div className="boss-check boss-check_role_board boss-check_page_checklist-review">
        <div className="boss-check__row">
          <h1 className="boss-check__cell">No checklists found</h1>
        </div>
      </div>
    )
  }

  return (
    <div>
      { !!items.size ? renderItems(items) : renderEmptyList() }
    </div>
  )
}

export default SubmissionsListMobile;
