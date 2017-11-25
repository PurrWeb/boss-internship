import React from 'react';
import oFetch from 'o-fetch'

class DetailsList extends React.PureComponent {
  render() {
    return (
      <div className="boss-page-main__isle">
        <section className="boss-details">
          <p className="boss-details__pointer">
            <span className="boss-details__pointer-text">{oFetch(this.props, 'sectionNumber')}</span>
          </p>
          <div className="boss-details__content">
            <h3 className="boss-details__title">{oFetch(this.props, 'categoryName')}</h3>
            <ul className="boss-details__list">
              {oFetch(this.props, 'children')}
            </ul>
          </div>
        </section>
      </div>
    )
  }
}


export default DetailsList;
