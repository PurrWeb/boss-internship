import React from 'react';

export const DetailsListItem = ({item: {name, value}}) => {
  return (
    <li className="boss-details__item">
      <p className="boss-details__label">{name}</p>
      <p className="boss-details__value">{value}</p>
    </li>
  )
}

const DetailsList = ({category: {categoryName, items}, index}) => {

  const renderDetailsList = () => {
    return items.map((item, key) => {
      return <DetailsListItem key={key} item={item} />
    })
  }

  return (
    <div className="boss-page-main__isle">
      <section className="boss-details">
        <p className="boss-details__pointer">
          <span className="boss-details__pointer-text">{index}</span>
        </p>
        <div className="boss-details__content">
          <h3 className="boss-details__title">{categoryName}</h3>
          <ul className="boss-details__list">
            { renderDetailsList() }
          </ul>
        </div>
      </section>
    </div>
  )
}


export default DetailsList;
