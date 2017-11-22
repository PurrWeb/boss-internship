import React from 'react';
import oFetch from 'o-fetch';

const DetailsListItem = (props) => {
  return (
    <li className="boss-details__item">
      <p className="boss-details__label">{oFetch(props.item, 'name')}</p>
      <p className="boss-details__value">{oFetch(props.item, 'value')}</p>
    </li>
  )
}

export default DetailsListItem;
