import React from 'react';
import oFetch from 'o-fetch';

const DetailsListItem = (props) => {
  let value = oFetch(props.item, 'value');
  const name = oFetch(props.item, 'name');
  if (typeof value === 'function') {
    value = value();
  }
  return (
    <li className="boss-details__item">
      <p className="boss-details__label">{name}</p>
      <p className="boss-details__value">{value}</p>
    </li>
  )
}

export default DetailsListItem;
